'use client';
import { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import LockUp from '@/components/Common/lockup';
import { iApiUser, iSize, iTheme, iVariant } from '@/lib/types';
import UserTable from './components/UserTable';
import styles from './users.module.css';
import { useUser } from '@stackframe/stack';
import Actions from '@/components/Common/Actions';
import { BiRefresh } from 'react-icons/bi';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { iButtonType, iTarget } from '@/components/Common/button';
import DashCard from '@/components/Dashboard/DashCard';
import TicketChart, {
  iChartType,
  iDataset,
} from '@/components/Dashboard/TicketChart';
import SkeletonLoader from './components/SkeletonLoader';
import Insight from '@/components/Dashboard/Insights';
import { fetchUsers } from '@/lib/helpers';

// Define types for the API response

const Users: React.FC = () => {
  const user = useUser();
  const [users, setUsers] = useState<iApiUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter] = useState<string>('all');
  const [sort] = useState<string>('date');
  const [search] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      clearErrors();
      const u = await fetchUsers({
        user,
        setIsLoading,
        setErrors,
        specific: false,
      });
      if (u) {
        setUsers(u);
      }
    };
    fetchData();
  }, [clearErrors, user]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
  }, []);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'all') return true;
      return user.display_name === filter;
    })
    .filter((user) => {
      return user.display_name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'date') {
        return (
          new Date(a.signed_up_at_millis).getTime() -
          new Date(b.signed_up_at_millis).getTime()
        );
      } else if (sort === 'name') {
        return a.display_name.localeCompare(b.display_name);
      }
      return 0;
    });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Insights and visualization data
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.primary_email_verified
  ).length;
  const inactiveUsers = totalUsers - activeUsers;

  // Prepare data for TicketChart
  const signupTrendDataset: iDataset = {
    data: users.map((user) => ({
      label: new Date(user.signed_up_at_millis).toLocaleDateString(),
      value: 1,
    })),
    legendText: 'Signups',
    color: '#4caf50',
  };

  const lastLoginTrendDataset: iDataset = {
    data: users.map((user) => ({
      label: new Date(user.last_active_at_millis).toLocaleDateString(),
      value: 1,
    })),
    legendText: 'Last Logins',
    color: '#2196f3',
  };

  const statusTrendDataset: iDataset = {
    data: [
      { label: 'Active Users', value: activeUsers },
      { label: 'Inactive Users', value: inactiveUsers },
    ],
    legendText: 'User Status',
    color: '#f44336',
  };

  const authMethodsDataset: iDataset = {
    data: [
      {
        label: 'Email',
        value: users.filter((user) => user.auth_with_email).length,
      },
      {
        label: 'OAuth',
        value: users.filter((user) => (user.oauth_providers ?? []).length > 0)
          .length,
      },
      {
        label: 'OTP',
        value: users.filter((user) => user.otp_auth_enabled).length,
      },
      {
        label: 'Passkey',
        value: users.filter((user) => user.passkey_auth_enabled).length,
      },
    ],
    legendText: 'Authentication Methods',
    color: '#ff9800',
  };

  if (isLoading) {
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
          title="View Site Users"
          subtitle="View and manage users"
          theme={iTheme.Dark}
          size={iSize.Large}
        />

        <Actions
          actions={[
            {
              label: 'Refresh',
              click: fetchUsers,
              size: iSize.Small,
              iconEnd: <BiRefresh />,
            },
            {
              label: 'Edit Users',
              iconEnd: <MdOutlineOpenInNew />,
              type: iButtonType.Link,
              size: iSize.Small,
              variant: iVariant.Secondary,
              url: {
                link: `https://app.stack-auth.com/projects/${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}/users`,
                target: iTarget.Blank,
              },
            },
          ]}
        />

        <p className="error-text">{errors.users}</p>

        <Insight
          insights={[
            {
              label: 'Total Users',
              value: totalUsers,
            },
            {
              label: 'Active Users',
              value: activeUsers,
            },
            {
              label: 'Inactive Users',
              value: inactiveUsers,
            },
          ]}
        />

        <div className={styles.chartContainer}>
          <DashCard title="Signup Trend">
            <TicketChart
              datasets={[signupTrendDataset]}
              chartType={iChartType.Line}
            />
          </DashCard>
          <DashCard title="Last Login Trend">
            <TicketChart
              datasets={[lastLoginTrendDataset]}
              chartType={iChartType.Line}
            />
          </DashCard>
          <DashCard title="Status Trend">
            <TicketChart
              datasets={[statusTrendDataset]}
              chartType={iChartType.Bar}
            />
          </DashCard>
          <DashCard title="Authentication Methods">
            <TicketChart
              datasets={[authMethodsDataset]}
              chartType={iChartType.Doughnut}
            />
          </DashCard>
        </div>

        <UserTable
          paginatedUsers={paginatedUsers}
          currentPage={currentPage}
          filteredUsersLength={filteredUsers?.length}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePageClick={handlePageClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
