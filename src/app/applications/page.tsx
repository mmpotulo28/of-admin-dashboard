'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import Actions from '@/components/Common/Actions';
import Modal from '@/components/Modal';
import Insight from '@/components/Dashboard/Insights';
import styles from './applications.module.css';
import { iApplication, iSize, iStatus, iTheme, iVariant } from '@/lib/types';
import toast, { CheckmarkIcon } from 'react-hot-toast';
import { MdCancel } from 'react-icons/md';
import SkeletonLoader from '../users/components/SkeletonLoader';
import LockUp from '@/components/Common/lockup';
import Pagination from '@/components/pagination';
import { useUser } from '@stackframe/stack';
import axios from 'axios';
import { Logger } from '@/lib/logger';
import { usePathname } from 'next/navigation';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<iApplication[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<iApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const user = useUser();
  const path = usePathname();

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/organisers`,
          {
            method: 'GET',
            headers: { accept: 'application/json' },
          }
        );

        console.log('response', response);

        const formattedApplications = response.data.map((app: any) => ({
          id: app.id,
          name: app.organiser?.name,
          email: app.organiser?.email,
          phone: app.phoneNumber,
          address: app.address,
          orgId: app.organiser.id,
          organizationName: app.organisationName,
          organizationWebsite: app.organisationWebsite,
          bankName: app.bankName,
          accountNumber: app.bankAccountNumber,
          routingNumber: app.routingNumber,
          documents: {
            idDocument: app.idDocumentFileName,
            proofOfBankAccount: app.proofOfBankAccountFileName,
          },
          status: app.applicationStatus,
          submittedDate: new Date(app.id).toLocaleDateString(),
          lastUpdated: new Date().toLocaleDateString(),
        }));

        setApplications(formattedApplications);
      } catch (err: any) {
        await Logger.error(err, {
          source: 'applications.tsx',
          severity: 'high',
          user_id: user?.id,
          request_path: path ?? undefined,
          request_method: 'GET',
          application: 'onlyfriends-ticket',
          raw_json: JSON.stringify(err),
        });
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [path, user?.id]);

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(
    (app) => app.status === iStatus.Approved
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === iStatus.Rejected
  ).length;
  const pendingApplications =
    totalApplications - approvedApplications - rejectedApplications;

  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (id: string, status: iStatus) => {
    setStatusUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organisers/update-status/${id}/${status}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      toast.success('Status updated successfully!');

      // invite user into the organizer stackAuth team if status is Approved
      if (status !== iStatus.Approved) {
        try {
          await user
            ?.useTeam('did')
            ?.inviteUser({ email: selectedApplication?.email || '' });

          toast.success('User invited to the StackAuth team successfully!');
        } catch (error) {
          toast.error(
            'Failed to invite user to the StackAuth team. Please try again.'
          );

          await Logger.error(error, {
            source: 'applications.tsx',
            severity: 'medium',
            user_id: user?.id,
            request_path: path ?? undefined,
            request_method: 'GET',
            application: 'onlyfriends-ticket',
            raw_json: JSON.stringify(error),
          });
        }
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );

      setSelectedApplication(null);
    } catch (err: any) {
      toast.error('Failed to update status. Please try again.');
      await Logger.error(err, {
        source: 'applications.tsx',
        severity: 'medium',
        user_id: user?.id,
        request_path: path ?? undefined,
        request_method: 'GET',
        application: 'onlyfriends-ticket',
        raw_json: JSON.stringify(err),
      });
    } finally {
      setStatusUpdating(false);
    }
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalApplications / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1); // Reset to the first page
  };

  if (loading || statusUpdating) {
    return (
      <DashboardLayout type="admin">
        <SkeletonLoader />;
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp
          title="Organizer Applications"
          subtitle="Manage and review organizer applications"
          theme={iTheme.Dark}
        />
        <Insight
          insights={[
            {
              label: 'Total Applications',
              value: totalApplications,
            },
            {
              label: 'Approved Applications',
              value: approvedApplications,
            },
            {
              label: 'Rejected Applications',
              value: rejectedApplications,
            },
            {
              label: 'Pending Applications',
              value: pendingApplications,
            },
          ]}
        />

        <div className="tableContainer">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.organizationName}</td>
                  <td>{app.status}</td>
                  <td>{app.submittedDate}</td>
                  <td>{app.lastUpdated}</td>
                  <td>
                    <Actions
                      actions={[
                        {
                          label: 'View Details',
                          click: () => setSelectedApplication(app),
                          size: iSize.Small,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalApplications}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onPageClick={handlePageClick}
          changeItemsPerPage={handleItemsPerPageChange}
        />

        {selectedApplication && (
          <Modal full onClose={() => setSelectedApplication(null)}>
            <div className={styles.modal}>
              <h2>Application Details</h2>
              <p>
                <strong>Name:</strong> {selectedApplication.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedApplication.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApplication.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedApplication.address}
              </p>
              <p>
                <strong>Organization Name:</strong>{' '}
                {selectedApplication.organizationName}
              </p>
              <p>
                <strong>Organization Website:</strong>{' '}
                <a
                  href={selectedApplication.organizationWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedApplication.organizationWebsite}
                </a>
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedApplication.bankName}
              </p>
              <p>
                <strong>Account Number:</strong>{' '}
                {selectedApplication.accountNumber}
              </p>
              <p>
                <strong>Routing Number:</strong>{' '}
                {selectedApplication.routingNumber}
              </p>
              <p>
                <strong>ID Document:</strong>{' '}
                <a
                  href={selectedApplication.documents.idDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </p>
              <p>
                <strong>Proof of Bank Account:</strong>{' '}
                <a
                  href={selectedApplication.documents.proofOfBankAccount}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </p>

              <textarea
                name="rejectionReason"
                placeholder="(if rejecting) Specify the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />

              <div className={styles.actions}>
                <Actions
                  actions={[
                    {
                      label: 'Approve',
                      click: () =>
                        handleStatusChange(
                          selectedApplication.orgId || selectedApplication.id,
                          iStatus.Approved
                        ),
                      size: iSize.Medium,
                      variant: iVariant.Secondary,
                      iconStart: <CheckmarkIcon />,
                      disabled: statusUpdating,
                    },
                    {
                      label: 'Reject',
                      click: () =>
                        handleStatusChange(
                          selectedApplication.orgId || selectedApplication.id,
                          iStatus.Rejected
                        ),
                      size: iSize.Medium,
                      variant: iVariant.Secondary,
                      iconStart: <MdCancel />,
                      disabled: statusUpdating,
                    },
                  ]}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
