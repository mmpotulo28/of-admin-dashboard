import {
  iFormState,
  iFormAction,
  iFullEvent,
  iStatus,
  iVenue,
  ApiResponse,
  iApiUser,
} from './types';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import { CurrentInternalUser, CurrentUser } from '@stackframe/stack';
import { iTeamId } from '@/context/AccessControlContext';

/**
 * Scrolls the window smoothly to the element with the specified ID.
 * If the element is not found, logs an error to the console.
 * If the code is running in a non-browser environment, the function returns immediately.
 *
 * @param id - The ID of the element to scroll to.
 *
 * @remarks
 * This function assumes there is a fixed navbar with a height of 70 pixels.
 * It adjusts the scroll position to account for this offset.
 *
 * @example
 * ```typescript
 * scrollToElement("section1");
 * ```
 */
export const scrollToElement = (id: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const element: HTMLElement | null = document.getElementById(id);
  if (!element) {
    console.error('Element not found:', id);
    return;
  }

  const offset = 150; // Height of the fixed navbar
  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  window.history.pushState(null, '', `#${id}`);
};

/**
 * Formats a given string to be URL-friendly by converting it to lowercase
 * and replacing all spaces with hyphens.
 *
 * @param str - The string to be formatted.
 * @returns The formatted string suitable for use in URLs.
 */
export const formatStringForURL = (str: string) => {
  return str.toLowerCase().replace(/\s/g, '-');
};

/**
 * Creates a debounced function that delays invoking the provided function until after the specified wait time has elapsed
 * since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A new debounced function.
 */

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Formats an event date object into a string.
 *
 * @param date - The event date object containing day, number, and monthYear.
 * @returns A formatted string representing the event date.
 */
export const formatEventDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

/**+
 * Generates an array of unique random colors.
 *
 * @param count - The number of unique random colors to generate.
 * @returns An array of unique random colors in `rgba` format.
 */
export const getRandomColor = (count: number) => {
  const colors = new Set<string>();
  while (colors.size < count) {
    const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 1)`;
    colors.add(color);
  }
  return Array.from(colors);
};

/**
 * Ensures that all numbers in the provided array are non-negative.
 * If a number is negative, it is replaced with 0.
 * If the input array is undefined, an empty array is returned.
 *
 * @param data - An array of numbers or undefined.
 * @returns A new array with all negative numbers replaced by 0, or an empty array if the input is undefined.
 */
export const ensureNonNegative = (data: (number | string)[]) => {
  // if data is a string array return the original data
  if (typeof data[0] === 'string') return data;

  return (
    data?.map((value) =>
      typeof value === 'number' && value < 0 ? 0 : value
    ) || []
  );
};

/**
 * Checks if all ticket types for a given event are unavailable.
 *
 * @param {iFullEvent} event - The event object containing ticket information.
 * @returns {boolean} - Returns `true` if all ticket types have zero availability, otherwise `false`.
 */
export const checkEventAvailability = (event: iFullEvent): boolean => {
  return event.ticketTypes.every((ticket) => ticket.availability === 0);
};

/**
 * Reducer function to manage form state.
 *
 * @param {iFormState} state - The current state of the form.
 * @param {iFormAction} action - The action to be performed on the form state.
 * @returns {iFormState} The updated form state.
 *
 * The reducer supports the following action types:
 * - 'SET_FIELD': Updates a specific field in the form state.
 * - 'SET_FORM_DATA': Updates the form state with the provided data.
 * - Default: Returns the current state if the action type is not recognized.
 */
export const formReducer = (
  state: iFormState,
  action: iFormAction
): iFormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SET_FORM_DATA':
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

/**
 * Delays the execution of an asynchronous function by a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const asyncDelay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Validates an email address format.
 *
 * @param email - The email address to validate.
 * @returns True if the email format is valid, otherwise false.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number format.
 * The phone number must start with a '+' followed by the country code and digits (e.g., +27631231234).
 *
 * @param phoneNumber - The phone number to validate.
 * @returns True if the phone number format is valid, otherwise false.
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+27\d{9}$/; // Example for South Africa (+27)
  return phoneRegex.test(phoneNumber);
};

/**
 * Validates a name format.
 * The name must only contain letters and spaces.
 *
 * @param name - The name to validate.
 * @returns True if the name format is valid, otherwise false.
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

/**
 * Validates an address format.
 * The address must be a non-empty string.
 *
 * @param address - The address to validate.
 * @returns True if the address format is valid, otherwise false.
 */
export const validateAddress = (address: string): boolean => {
  return typeof address === 'string' && address.trim().length > 0;
};

export const shiftDateByDays = (days: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return {
    day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
    number: currentDate.getDate().toString(),
    monthYear: currentDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  };
};

/**
 * Fetches a list of events from the API.
 *
 * @returns {Promise<iFullEvent[]>} A promise that resolves to an array of `iFullEvent` objects.
 * @throws {Error} Throws an error if the fetch request fails or the response is not OK.
 *
 * @example
 * ```typescript
 * fetchEvents()
 *   .then(events => console.log(events))
 *   .catch(error => console.error(error));
 * ```
 */
export const fetchEvents = async (): Promise<iFullEvent[]> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const data: iFullEvent[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchUsers = async ({
  user,
  setIsLoading,
  setErrors,
  specific,
}) => {
  const headers = () => {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
    const clientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
    const serverKey = process.env.NEXT_PUBLIC_STACK_SECRET_SERVER_KEY;

    if (!projectId || !clientKey || !serverKey) {
      console.error(
        'One or more environment variables are missing. Please check your .env.local file.'
      );
    }

    return {
      'X-Stack-Access-Type': 'server',
      'X-Stack-Project-Id': projectId || '',
      'X-Stack-Publishable-Client-Key': clientKey || '',
      'X-Stack-Secret-Server-Key': serverKey || '',
      'X-Stack-Access-Token': '',
      'X-Stack-Refresh-Token': '',
    };
  };

  setIsLoading(true);
  try {
    const accessToken = user ? (await user.getAuthJson()).accessToken : '';
    const refreshToken = user ? (await user.getAuthJson()).refreshToken : '';
    if (accessToken) {
      headers['X-Stack-Access-Token'] = accessToken;
    }

    if (refreshToken) {
      headers['X-Stack-Refresh-Token'] = refreshToken;
    }

    const response = await axios.get<ApiResponse>(
      'https://api.stack-auth.com/api/v1/users',
      { headers: headers() }
    );

    const formattedUsers: iApiUser[] = response.data.items;

    if (specific) {
      const specificUser = formattedUsers.find((user) => user.id === specific);
      if (specificUser) {
        return [specificUser];
      } else {
        setErrors({ users: 'User not found' });
        return [];
      }
    }

    return formattedUsers;
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.error('AxiosError:', error.response?.data || error.message);
      setErrors({
        users: `Error fetching users: ${
          error.response?.data?.error || error.message
        }`,
      });
    } else {
      console.error('Unexpected error:', error);
      setErrors({ users: 'An unexpected error occurred.' });
    }
  } finally {
    setIsLoading(false);
  }
};

/**
 * Sends an invitation to a user to join the Stack Auth team.
 *
 * This function uses environment variables to configure the request headers and
 * sends a POST request to the Stack Auth API to invite a user to the team. The
 * user's access and refresh tokens are included in the headers if available.
 *
 * @param user - The user to invite, which can be of type `CurrentInternalUser`,
 * `CurrentUser`, or `null`. If `null`, no user-specific tokens will be included.
 *
 * @returns A promise that resolves to the response body from the API, or logs an
 * error if the request fails.
 *
 * @throws Logs an error to the console if required environment variables are missing
 * or if the API request fails.
 *
 * @remarks
 * - Ensure the following environment variables are set in your `.env.local` file:
 *   - `NEXT_PUBLIC_STACK_PROJECT_ID`
 *   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
 *   - `NEXT_PUBLIC_STACK_SECRET_SERVER_KEY`
 *   - `NEXT_PUBLIC_BASE_URL`
 * - The function logs an error if any of these variables are missing.
 * - The `team_id` is hardcoded as `ad962777-8244-496a-b6a2-e0c6a449c79e`.
 * - The `callback_url` is constructed using the `NEXT_PUBLIC_BASE_URL` environment variable.
 */
export const inviteToStackAuthTeam = async (
  user: CurrentInternalUser | CurrentUser | null
) => {
  const headers = () => {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
    const clientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
    const serverKey = process.env.NEXT_PUBLIC_STACK_SECRET_SERVER_KEY;

    if (!projectId || !clientKey || !serverKey) {
      console.error(
        'One or more environment variables are missing. Please check your .env.local file.'
      );
    }

    return {
      'X-Stack-Access-Type': 'server',
      'X-Stack-Project-Id': projectId || '',
      'X-Stack-Publishable-Client-Key': clientKey || '',
      'X-Stack-Secret-Server-Key': serverKey || '',
      'X-Stack-Access-Token': '',
      'X-Stack-Refresh-Token': '',
    };
  };

  try {
    const accessToken = user ? (await user.getAuthJson()).accessToken : '';
    const refreshToken = user ? (await user.getAuthJson()).refreshToken : '';
    if (accessToken) {
      headers['X-Stack-Access-Token'] = accessToken;
    }

    if (refreshToken) {
      headers['X-Stack-Refresh-Token'] = refreshToken;
    }

    const response = await fetch(
      'https://api.stack-auth.com/api/v1/team-invitations/send-code',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers(),
        },
        body: JSON.stringify({
          team_id: iTeamId.organizer,
          email: user?.primaryEmail,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth-ext/team-invitation`,
        }),
      }
    );

    return response;
  } catch (error) {
    console.error('Error inviting user:', error);
  }
};

export const fetchVenues = async (
  OnlyApproved?: boolean
): Promise<{ venues: iVenue[]; error: any }> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/venues`
    );
    let formattedVenues: iVenue[] = [];
    if (OnlyApproved) {
      formattedVenues = response.data.filter(
        (venue: iVenue) => venue.applicationStatus === iStatus.Approved
      );
    } else {
      formattedVenues = response.data;
    }
    return { venues: formattedVenues, error: null };
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { venues: [], error: error };
  }
};

/**
 * Sends an email using the `/api/email/send` endpoint.
 *
 * @param {Object} params - Email parameters.
 * @param {string[]} params.to - Array of recipient email addresses.
 * @param {string} params.subject - Subject of the email.
 * @param {string} params.body - Body content of the email (plain text).
 * @param {string} params.senderId - ID of the user sending the email.
 * @param {string} params.serviceName - Name of the email service.
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the email sending operation.
 */
export const sendCustomEmail = async ({
  to,
  subject,
  html,
  senderId,
  serviceName,
}: {
  to: string[]; // Accept an array of email addresses
  subject: string;
  html: string;
  senderId: string;
  serviceName: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    if (!to || !subject || !html || !senderId || !serviceName) {
      throw new Error(
        `Missing required fields: to, subject, html, senderId, serviceName: ${to}, ${subject}, ${html}, ${senderId}, ${serviceName}`
      );
    }

    const response: AxiosResponse = await axios.post('/api/email/send', {
      to,
      subject,
      html,
      senderId,
      serviceName,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: 'Emails sent successfully',
      };
    } else {
      throw new Error(
        `Failed to send emails: ${response.data}\n${response.statusText}`
      );
    }
  } catch (error: any) {
    console.error('Error in sendEmail:', error.message);
    return {
      success: false,
      message: 'Failed to send emails due to an unexpected error',
    };
  }
};

/**
 * Sends an email notification for a new organizer application.
 *
 * @param {Object} params - Email parameters.
 * @param {string} params.userDisplayName - The display name of the user.
 * @param {string} params.applicationDetails - The details of the organizer application.
 * @param {string} params.reviewLink - The link to review the application.
 */
export const sendOrganizerApplicationEmail = async ({
  senderId,
  userDisplayName,
  applicationDetails,
  reviewLink,
}: {
  senderId: string;
  userDisplayName: string;
  applicationDetails: string;
  reviewLink: string;
}) => {
  const subject = `An Organizer Application for ${userDisplayName} has been created`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #41b3ff;">New Organizer Application</h2>
      <p>An organizer application for <strong>${userDisplayName}</strong> has been submitted.</p>
      <p><strong>Application Details:</strong></p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Value</th>
        </tr>
        ${applicationDetails}
      </table>
      <p>
        <a href="${reviewLink}" style="color: #41b3ff; text-decoration: none; font-weight: bold;">
          Click here to review the application
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <footer style="font-size: 0.9em; color: #555;">
        <p>Thank you for using our service.</p>
        <p style="margin: 0;">The OnlyFriends Ticket Team</p>
      </footer>
    </div>
  `;

  return await sendCustomEmail({
    to: ['info@onlyfriendsent.com', process.env.NEXT_PUBLIC_SYSTEM_EMAIL || ''],
    subject,
    html,
    senderId,
    serviceName: 'OrgApplicationService',
  });
};

/**
 * Sends a confirmation email to the user who just applied to become an organizer.
 *
 * @param {Object} params - Email parameters.
 * @param {string} params.userEmail - The email address of the user.
 * @param {string} params.userDisplayName - The display name of the user.
 * @param {string} params.applicationDetails - The details of the organizer application.
 */
export const sendUserApplicationEmail = async ({
  userEmail,
  userDisplayName,
  applicationDetails,
  senderId,
}: {
  userEmail: string;
  userDisplayName: string;
  applicationDetails: string;
  senderId: string;
}) => {
  const subject = `Your Organizer Application has been Received`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #41b3ff;">Application Confirmation</h2>
      <p>Dear <strong>${userDisplayName}</strong>,</p>
      <p>Thank you for applying to become an organizer. Your application has been successfully recorded and is under review.</p>
      <p><strong>Application Details:</strong></p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Value</th>
        </tr>
        ${applicationDetails}
      </table>
      <p>We will notify you once your application has been reviewed.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <footer style="font-size: 0.9em; color: #555;">
        <p>Thank you for using our service.</p>
        <p style="margin: 0;">The OnlyFriends Ticket Team</p>
      </footer>
    </div>
  `;

  return await sendCustomEmail({
    to: [userEmail],
    subject,
    html,
    senderId,
    serviceName: 'UserApplicationService',
  });
};

/**
 * Sends an email to the user with ticket details after successful ticket creation.
 *
 * @param {Object} params - Email parameters.
 * @param {string} params.userEmail - The email address of the user.
 * @param {string} params.eventName - The name of the event.
 * @param {string} params.ticketId - The ID of the ticket.
 * @param {string} params.eventDate - The date of the event.
 * @param {string} params.senderId - The ID of the sender.
 */
export const sendUserTicketEmail = async ({
  userEmail,
  eventName,
  ticketId,
  eventDate,
  senderId,
}: {
  userEmail: string;
  eventName: string;
  ticketId: string;
  eventDate: string;
  senderId: string;
}) => {
  const subject = `Your Ticket for ${eventName} is Ready`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #41b3ff;">Thank you for your purchase!</h2>
      <p>Your ticket for <strong>${eventName}</strong> has been successfully created.</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Event Date:</strong> ${eventDate}</p>
      <p>We look forward to seeing you at the event!</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <footer style="font-size: 0.9em; color: #555;">
        <p>Thank you for using our service.</p>
        <p style="margin: 0;">The OnlyFriends Ticket Team</p>
      </footer>
    </div>
  `;

  return await sendCustomEmail({
    to: [userEmail],
    subject,
    html,
    senderId,
    serviceName: 'TicketService',
  });
};

/**
 * Sends an email to the organizer with ticket details after a ticket is sold.
 *
 * @param {Object} params - Email parameters.
 * @param {string} params.organizerEmail - The email address of the organizer.
 * @param {string} params.eventName - The name of the event.
 * @param {string} params.ticketId - The ID of the ticket.
 * @param {string} params.buyerName - The name of the buyer.
 * @param {string} params.buyerEmail - The email address of the buyer.
 * @param {string} params.senderId - The ID of the sender.
 */
export const sendOrganizerTicketEmail = async ({
  organizerEmail,
  eventName,
  ticketId,
  buyerName,
  buyerEmail,
  senderId,
}: {
  organizerEmail: string;
  eventName: string;
  ticketId: string;
  buyerName: string;
  buyerEmail: string;
  senderId: string;
}) => {
  const subject = `A Ticket for ${eventName} Has Been Sold`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #41b3ff;">New Ticket Sold</h2>
      <p>A ticket for your event <strong>${eventName}</strong> has been sold.</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Buyer:</strong> ${buyerName}</p>
      <p><strong>Email:</strong> ${buyerEmail}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <footer style="font-size: 0.9em; color: #555;">
        <p>Thank you for using our service.</p>
        <p style="margin: 0;">The OnlyFriends Ticket Team</p>
      </footer>
    </div>
  `;

  return await sendCustomEmail({
    to: [organizerEmail],
    subject,
    html,
    senderId,
    serviceName: 'TicketService',
  });
};

/**
 * Shares an event as a post on the connected Facebook Page.
 *
 * @param {Object} params - Event details.
 * @param {string} params.title - The title of the event.
 * @param {string} params.description - A brief description of the event.
 * @param {string} params.imageUrl - The URL of the event image.
 * @param {string} [params.pageId] - The Facebook Page ID (optional, defaults to NEXT_PUBLIC_FACEBOOK_PAGE_ID).
 * @returns {Promise<void>} - Resolves if the post is successful, otherwise throws an error.
 */
export const shareEventToFacebook = async ({
  title,
  description,
  imageUrls,
  pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
}: {
  title: string;
  description: string;
  imageUrls: string[];
  pageId?: string;
}): Promise<void> => {
  const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;
  const graphApiVersion =
    process.env.NEXT_PUBLIC_FACEBOOK_GRAPH_API_VERSION || 'v22.0';

  if (!accessToken || !pageId) {
    console.error('Facebook access token or Page ID is missing.');
    throw new Error(
      'Facebook integration is not configured properly. Please check your environment variables.'
    );
  }

  try {
    // Upload images to Facebook
    const uploadedImageIds = await Promise.all(
      imageUrls.map(async (imageUrl) => {
        const response = await axios.post(
          `https://graph.facebook.com/${graphApiVersion}/${pageId}/photos`,
          {
            url: imageUrl,
            published: false,
          },
          {
            params: { access_token: accessToken },
          }
        );
        return response.data.id;
      })
    );

    // Create a post with the uploaded images
    await axios.post(
      `https://graph.facebook.com/${graphApiVersion}/${pageId}/feed`,
      {
        message: `${title}\n\n${description}`,
        attached_media: uploadedImageIds.map((id) => ({ media_fbid: id })),
      },
      {
        params: { access_token: accessToken },
      }
    );

    console.log('Event successfully shared to Facebook with images.');
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Facebook API error:',
        error.response?.data || error.message
      );
      if (error.response?.data?.error) {
        console.error('Error details:', error.response.data.error);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error(
      'Failed to share event to Facebook. Please verify your Page ID, access token, and permissions.'
    );
  }
};
