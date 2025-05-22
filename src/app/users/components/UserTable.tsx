import React from 'react';
import Pagination from '@/components/pagination';
import styles from '../users.module.css';
import { iApiUser } from '..';
import Image from 'next/image';
import { MdVerifiedUser } from 'react-icons/md';
import { BiQuestionMark } from 'react-icons/bi';

interface UserTableProps {
  paginatedUsers: iApiUser[];
  currentPage: number;
  filteredUsersLength: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageClick: (page: number) => void;
  handleEditUser?: (user: iApiUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  paginatedUsers,
  currentPage,
  filteredUsersLength,
  handleNextPage,
  handlePrevPage,
  handlePageClick,
}) => {
  return (
    <div className={styles.usersContainer}>
      <div className="tableContainer">
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Status</th>
              <th>Providers</th>
              <th>Created At</th>
              <th>Last Login At</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers?.map((user) => (
              <tr key={user.id}>
                <td>
                  <Image
                    src={user.profile_image_url}
                    alt={`${user.display_name}'s profile`}
                    className={styles.profileImage}
                    height={50}
                    width={50}
                  />
                </td>
                <td>{user.display_name}</td>
                <td>{user.primary_email}</td>
                <td>{user.selected_team?.display_name}</td>
                <td
                  className={user.primary_email_verified ? styles.active : ''}
                >
                  {user.primary_email_verified ? (
                    <MdVerifiedUser />
                  ) : (
                    <BiQuestionMark />
                  )}
                </td>
                <td>{user?.oauth_providers?.[0]?.id ?? 'N/A'}</td>
                <td>{new Date(user.signed_up_at_millis).toLocaleString()}</td>
                <td>{new Date(user.last_active_at_millis).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredUsersLength}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageClick={handlePageClick}
      />
    </div>
  );
};

export default UserTable;
