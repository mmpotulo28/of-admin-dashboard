'use client';
import { iEmail, iSize, iTheme, iVariant } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './emails.module.css';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import DashSkeletonLoader from '@/components/Dashboard/DashboardLayout/DashSkeletonLoader';
import LockUp from '@/components/Common/lockup';
import Pagination from '@/components/pagination';
import DashCard from '@/components/Dashboard/DashCard';
import TicketChart, { iChartType } from '@/components/Dashboard/TicketChart';
import Modal from '@/components/Modal';
import Actions from '@/components/Common/Actions';
import { MdOutlineOpenInNew } from 'react-icons/md';

const EmailsPage = () => {
  const [emails, setEmails] = useState<iEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedEmail, setSelectedEmail] = useState<iEmail | null>(null);
  const [insights, setInsights] = useState<{
    emailsPerUser: Record<string, number | string>[];
    emailsPerDay: Record<string, number | string>[];
    emailsPerStatus: Record<string, number | string>[];
  }>({
    emailsPerUser: [],
    emailsPerDay: [],
    emailsPerStatus: [],
  });

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/email/read');
      setEmails(response.data);

      const emails = response.data;

      // analyze the emails to get insights
      const emailsPerDay: Record<string, number | string>[] = Object.entries(
        emails.reduce((acc: Record<string, number>, email: iEmail) => {
          const date = new Date(email.date_sent).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {})
      ).map(([date, count]) => ({ date, count: (count as number).toString() })); // Fixed the toString() call

      const emailsPerUser: Record<string, number | string>[] = emails.reduce(
        (acc: Record<string, number | string>[], email: iEmail) => {
          const user = email.from_email;
          const existingUser = acc.find((item) => item.user === user);

          if (existingUser) {
            existingUser.count = (existingUser.count as number) + 1;
          } else {
            acc.push({ user, count: 1 });
          }

          return acc;
        },
        []
      );

      const emailsPerStatus: Record<string, number | string>[] = emails.reduce(
        (acc: Record<string, number | string>[], email: iEmail) => {
          const status = email.status;
          const existingStatus = acc.find((item) => item.status === status);

          if (existingStatus) {
            existingStatus.count = (existingStatus.count as number) + 1;
          } else {
            acc.push({ status, count: 1 });
          }

          return acc;
        },
        []
      );

      setInsights({
        emailsPerDay: emailsPerDay,
        emailsPerUser: emailsPerUser,
        emailsPerStatus: emailsPerStatus,
      });

      console.log({
        emailsPerDay: emailsPerDay,
        emailsPerUser: emailsPerUser,
        emailsPerStatus: emailsPerStatus,
      });
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to fetch emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(emails.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const paginatedEmails = emails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <DashboardLayout type="admin">
        <DashSkeletonLoader
          overline="Automated"
          title="System Emails"
          subtitle="All emails sent from the system, using the internal email server"
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp
          overline="Automated"
          title="System Emails"
          subtitle="All emails sent from the system, using the internal email server"
          theme={iTheme.Dark}
          size={iSize.Large}
        />

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryButton} onClick={fetchEmails}>
              Retry
            </button>
          </div>
        )}

        {/* insights */}
        <div className={styles.insights}>
          <DashCard title="Emails Per Day">
            <TicketChart
              chartType={iChartType.Bar}
              datasets={[
                {
                  legendText: 'emails',
                  data: insights.emailsPerDay,
                  color: 'red',
                },
              ]}
            />
          </DashCard>

          <DashCard title="Emails Per User">
            <TicketChart
              chartType={iChartType.Bar}
              datasets={[
                {
                  legendText: 'emails',
                  data: insights.emailsPerUser,
                  color: 'blue',
                },
              ]}
            />
          </DashCard>

          <DashCard title="Emails Per Status">
            <TicketChart
              chartType={iChartType.Bar}
              datasets={[
                {
                  legendText: 'emails',
                  data: insights.emailsPerStatus,
                  color: 'green',
                },
              ]}
            />
          </DashCard>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date Sent</th>
              <th>Service</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmails?.map((email) => (
              <tr key={email.id}>
                <td>{email.id}</td>
                <td>{email.to_email}</td>
                <td>{email.subject}</td>
                <td className={styles.status}>{email.status}</td>
                <td>{new Date(email.date_sent).toLocaleString()}</td>
                <td>{email.service_name}</td>
                <td>
                  <Actions
                    actions={[
                      {
                        label: 'Preview',
                        iconEnd: <MdOutlineOpenInNew />,
                        variant: iVariant.Secondary,
                        size: iSize.Small,
                        click: () => setSelectedEmail(email),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={emails.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onPageClick={handlePageClick}
          changeItemsPerPage={handleItemsPerPageChange}
        />

        {selectedEmail && (
          <Modal
            onClose={() => setSelectedEmail(null)}
            title={selectedEmail.subject}
          >
            <div className={styles.emailPreview}>
              <div className={styles.header}>
                <p>
                  <strong>From:</strong> {selectedEmail.from_email}
                </p>
                <p>
                  <strong>To:</strong> {selectedEmail.to_email}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(selectedEmail.date_sent).toLocaleString()}
                </p>
                <p>
                  <strong>Service:</strong> {selectedEmail.service_name}
                </p>
              </div>
              <hr />
              <br />
              <div
                className={styles.emailBody}
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              />
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmailsPage;
