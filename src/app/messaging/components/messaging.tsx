'use client';
import styles from '../messaging.module.css';
import Actions from '@/components/Common/Actions';
import { iButtonType } from '@/components/Common/button';
import Input from '@/components/Common/input';
import { iSize, iVariant } from '@/lib/types';
import { useMessaging } from '@/context/MessagingContext';
import { iMessage } from '@/lib/db';
import { useUser } from '@stackframe/stack';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import io from 'socket.io-client';
import crypto from 'crypto';
import LockUp from '@/components/Common/lockup';
import { useAccessControl } from '@/context/AccessControlContext';
import { iUserType } from '../page';

const sharedKey = process.env.NEXT_PUBLIC_SHARED_SECRET_KEY || '';

const algorithm = process.env.NEXT_PUBLIC_MESSAGE_ENCRYPT_ALGORITHM || ''; // Encryption algorithm
const iv = Buffer.alloc(16, 0); // Initialization vector (fixed for simplicity)

const checkKey = () => {
  if (!sharedKey || sharedKey.length !== 64) {
    throw new Error(
      'Invalid or missing shared key. Ensure NEXT_PUBLIC_SHARED_SECRET_KEY is set and is a 256-bit key in hexadecimal format.'
    );
  }
};

// Encrypt message with shared symmetric key
const encryptMessage = (message: string) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(sharedKey, 'hex'),
    iv
  );
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt message with shared symmetric key
const decryptMessage = (encryptedMessage: string) => {
  checkKey();

  if (!encryptedMessage || typeof encryptedMessage !== 'string') {
    console.error('Invalid encryptedMessage:', encryptedMessage);
    throw new Error('Invalid encrypted message format');
  }

  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(sharedKey, 'hex'),
      iv
    );
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    throw new Error('Decryption failed');
  }
};

const renderSkeletonMessages = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <li
      key={index}
      className={`${styles.messageItem} ${
        index % 2 === 0 ? styles.outgoing : styles.incoming
      } ${styles.skeleton}`}
    >
      <div className={styles.messageContentSkeleton} />
      <div className={styles.messageHeaderSkeleton}>
        <span className={styles.messageSenderSkeleton} />
        <span className={styles.messageTimestampSkeleton} />
      </div>
    </li>
  ));
};

/**
 * MessagingContent is a React functional component that provides a messaging interface
 * for live updates. It handles message encryption, decryption, and socket communication
 * for real-time messaging functionality.
 */
const MessagingContent: React.FC = (): JSX.Element => {
  const { selectedEvent, events } = useMessaging();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const messageListRef = useRef<HTMLUListElement>(null);

  const user = useUser();
  const socket = useRef<ReturnType<typeof io> | null>(null);
  const retryCount = useRef<number>(0);

  const { isAdmin, isOrganizer, isUser } = useAccessControl();
  let userType = iUserType.user;

  if (isAdmin) {
    userType = iUserType.admin;
  } else if (isOrganizer) {
    userType = iUserType.organizer;
  } else if (isUser) {
    userType = iUserType.user;
  }

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSendMessage = useCallback(() => {
    if (selectedEvent && message && user) {
      setIsSending(true);
      const encryptedMessage = encryptMessage(message); // Encrypt message

      const newMessage = {
        eventId: selectedEvent,
        content: encryptedMessage,
        sender: userType,
        senderName: user?.displayName || 'anonymous',
      };

      socket.current?.emit('sendMessage', newMessage, (error: string) => {
        setIsSending(false); // Ensure isSending is set to false
        if (error) {
          setError(error);
          console.error('sending message callback', error);
        } else {
          setMessage('');
        }
        console.log('sending message done');
      });
    } else {
      alert('Please select an event and enter a message.');
    }
  }, [selectedEvent, message, user, userType]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 180;
    }
  };

  useEffect(() => {
    const initializeSocketServer = async () => {
      try {
        setError(null);
        setLoading(true);
        await fetch('/api/chat/socketio');
        console.log('Socket server initialized');
      } catch (error) {
        console.error('Failed to initialize socket server:', error);
      }
    };

    const connectSocket = () => {
      if (socket.current) return; // Prevent multiple socket connections

      socket.current = io({
        path: '/api/chat/socketio',
      });

      socket.current.connect();

      socket.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError('Failed to connect to the server. Retrying...');
        retryCount.current += 1;
        if (retryCount.current <= 5) {
          const retryDelay = Math.min(1000 * retryCount.current, 10000); // Exponential backoff up to 10 seconds
          setTimeout(connectSocket, retryDelay);
        } else {
          setError("Couldn't connect to the socket.");
          // disconnect from socket
          setIsSending(false);
          setLoading(false);
          socket.current?.disconnect();
        }
      });

      // hide loader when socket is connected
      socket.current.on('connect', () => {
        setError(null);
        retryCount.current = 0; // Reset retry count on successful connection
        console.log('Socket Connection Achieved', socket?.current?.id);
      });

      if (selectedEvent) {
        console.log('emitting getMessages with selectedEvent:', selectedEvent);
        socket.current?.emit('getMessages', selectedEvent);
      }

      socket.current.on('newMessage', (newMessage: iMessage) => {
        console.log('(Client): new message received:', newMessage);
        try {
          const decryptedContent = decryptMessage(newMessage.content); // Decrypt message
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...newMessage, content: decryptedContent },
          ]);
          scrollToBottom();
        } catch (error) {
          console.error('Error decrypting new message:', error);
        }
      });

      socket.current.on('pushMessages', (eventMessages: iMessage[]) => {
        console.log('(Client): eventMessages received:', eventMessages);
        try {
          const decryptedMessages = eventMessages.map((msg) => ({
            ...msg,
            content: msg.content
              ? decryptMessage(msg.content)
              : '[Decryption Error]',
          }));
          setMessages(decryptedMessages);
          setLoading(false);
          scrollToBottom();
        } catch (error) {
          console.error('Error decrypting messages:', error);
          setError('Failed to decrypt event messages');
          setLoading(false);
        }
      });

      socket.current.on('userCount', (count: number) => {
        console.log('(Client): userCount received:', count);
        setUserCount(count);
      });

      socket.current.on('error', (error: string) => {
        setError(error);
        setLoading(false);
      });
    };

    setMessages([]);
    initializeSocketServer().then(connectSocket);

    return () => {
      socket.current?.disconnect();
      socket.current = null; // Ensure socket is reset on cleanup
    };
  }, [selectedEvent]);

  return (
    <div className={styles.chatContent}>
      <div className={styles.header}>
        <LockUp
          size={iSize.Small}
          overline="Live Updates enabled"
          title={`Messages for ${
            events.find((e) => e.id === selectedEvent)?.title
          }`}
        />

        {/* active users */}
        <div className={styles.channelUsers}>
          <span>{userCount}</span>
        </div>
      </div>

      {error && <div className={`${styles.error} error-text`}>{error}</div>}

      <ul className={styles.messageList} ref={messageListRef}>
        {loading
          ? renderSkeletonMessages()
          : messages?.map((msg) => (
              <li
                key={msg.id}
                className={`${styles.messageItem} ${
                  msg?.senderName === user?.displayName
                    ? styles.outgoing
                    : styles.incoming
                }`}
              >
                <p className={styles.messageContent}>{msg?.content}</p>
                <div className={styles.messageHeader}>
                  <span className={styles.messageSender}>
                    {msg?.senderName}
                  </span>
                  <span className={styles.messageTimestamp}>
                    {new Date(
                      msg?.timestamp || new Date()
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))}
      </ul>

      <div className={styles.formContainer}>
        <Input
          value={message}
          label="Enter your message here..."
          placeholder="Enter your message here..."
          onChange={(e) => {
            handleMessageChange(e);
          }}
          disabled={!selectedEvent || isSending}
        />
        <Actions
          actions={[
            {
              label: '',
              variant: iVariant.Primary,
              size: iSize.Large,
              iconEnd: <FaPaperPlane />,
              type: iButtonType.Icon,
              click: handleSendMessage,
              disabled: !message || !selectedEvent || loading || isSending,
              isLoading: isSending,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MessagingContent;
