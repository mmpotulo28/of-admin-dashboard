import React from 'react';
import Actions from '@/components/Common/Actions';
import Pagination from '@/components/pagination';
import { MdOutlineEdit } from 'react-icons/md';
import { iSize, iVariant } from '@/lib/types';
import styles from '../organizers.module.css';
import { iOrganizer } from '..';

interface OrgTableProps {
  paginatedOrganizers: iOrganizer[];
  currentPage: number;
  filteredOrganizersLength: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageClick: (page: number) => void;
  handleEditOrganizer: (organizer: iOrganizer) => void;
}

const OrgTable: React.FC<OrgTableProps> = ({
  paginatedOrganizers,
  currentPage,
  filteredOrganizersLength,
  handleNextPage,
  handlePrevPage,
  handlePageClick,
  handleEditOrganizer,
}) => {
  // table titles
  const titles =
    paginatedOrganizers?.length > 0
      ? Object.keys(paginatedOrganizers[0])?.map((title) => {
          return title.charAt(0).toUpperCase() + title.slice(1);
        })
      : [];

  return (
    <div className={styles.organizersContainer}>
      <div className="tableContainer">
        <table className={styles.organizersTable}>
          <thead>
            <tr>
              {titles?.map((title) => (
                <th key={title}>{title}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrganizers?.map((organizer) => (
              <tr key={organizer.id}>
                <td>{organizer.id}</td>
                <td>{organizer.name}</td>
                <td>{organizer.email}</td>
                <td>{organizer.cellNumber}</td>
                <td>{organizer.address}</td>
                <td className={styles[organizer.status]}>{organizer.status}</td>
                <td>{organizer.createdAt}</td>
                <td>{organizer.eventCount}</td>
                <td>${organizer.revenue.toFixed(2)}</td>
                <td>
                  <Actions
                    fullWidth
                    actions={[
                      {
                        label: '',
                        iconStart: <MdOutlineEdit />,
                        click: () => handleEditOrganizer(organizer),
                        size: iSize.Small,
                        variant: iVariant.Secondary,
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
        totalItems={filteredOrganizersLength}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageClick={handlePageClick}
      />
    </div>
  );
};

export default OrgTable;
