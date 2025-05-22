'use client';
import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import styles from './access-codes.module.css';
import Modal from '@/components/Modal';
import EventControls from '@/components/Dashboard/EventControls';
import DashCard from '@/components/Dashboard/DashCard';
import TicketChart, {
  iChartType,
  iDataset,
} from '@/components/Dashboard/TicketChart';
import Pagination from '@/components/pagination';
import { MdOutlineAddCircleOutline, MdOutlineOpenInNew } from 'react-icons/md';
import Input from '@/components/Common/input';
import Select from '@/components/Common/select';
import { iButtonType, iTarget } from '@/components/Common/button';

interface AccessCode {
  id: number;
  code: string;
  eventId: number;
  user: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const initialAccessCodes: AccessCode[] = [
  {
    id: 1,
    code: 'VALID_ACCESS_CODE',
    eventId: 1000000001,
    user: 'John Doe',
    status: 'active',
    createdAt: new Date().toLocaleString(),
  },
  {
    id: 2,
    code: 'EXPIRED_ACCESS_CODE',
    eventId: 1000000002,
    user: 'Jane Smith',
    status: 'inactive',
    createdAt: new Date().toLocaleString(),
  },
];

const AccessCodes: React.FC = () => {
  const [accessCodes, setAccessCodes] =
    useState<AccessCode[]>(initialAccessCodes);
  const [newCode, setNewCode] = useState<string>('');
  const [newEventId, setNewEventId] = useState<number>(0);
  const [newUser, setNewUser] = useState<string>('');
  const [editingCode, setEditingCode] = useState<AccessCode | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('date');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleAddCode = useCallback(() => {
    const newAccessCode: AccessCode = {
      id: accessCodes?.length + 1,
      code: newCode,
      eventId: newEventId,
      user: newUser,
      status: 'active',
      createdAt: new Date().toLocaleString(),
    };
    setAccessCodes([...accessCodes, newAccessCode]);
    setNewCode('');
    setNewEventId(0);
    setNewUser('');
    setShowAddModal(false);
  }, [accessCodes, newCode, newEventId, newUser]);

  const handleEditCode = useCallback((code: AccessCode) => {
    setEditingCode(code);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingCode) {
      setAccessCodes(
        accessCodes?.map((code) =>
          code.id === editingCode.id ? editingCode : code
        )
      );
      setEditingCode(null);
    }
  }, [accessCodes, editingCode]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter(e.target.value);
    },
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value);
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
  }, []);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const filteredAccessCodes = accessCodes
    .filter((code) => {
      if (filter === 'all') return true;
      return code.status === filter;
    })
    .filter((code) => {
      return code.code.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'date') {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sort === 'code') {
        return a.code.localeCompare(b.code);
      }
      return 0;
    });

  const paginatedAccessCodes = filteredAccessCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusCounts = (codes: AccessCode[]) => {
    const statusCounts = {
      active: 0,
      inactive: 0,
    };
    codes.forEach((code) => {
      statusCounts[code.status]++;
    });
    return statusCounts;
  };

  const statusCounts = getStatusCounts(filteredAccessCodes);
  const overallStatusCounts = getStatusCounts(accessCodes);

  const chartData: iDataset[] = [
    {
      data: Object.entries(statusCounts).map(([label, value]) => ({
        label,
        value,
      })),
      legendText: 'Access Codes Status',
      color: '#4caf50',
    },
  ];

  const overallChartData: iDataset[] = [
    {
      data: Object.entries(overallStatusCounts).map(([label, value]) => ({
        label,
        value,
      })),
      legendText: 'Overall Access Codes Status',
      color: '#2196f3',
    },
  ];

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp
          title="Manage Access Codes"
          subtitle="View and manage access codes for your events"
          theme={iTheme.Dark}
          size={iSize.Large}
          centered
        />

        <EventControls
          filter={filter}
          sort={sort}
          search={search}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
        />

        <Actions
          actions={[
            {
              label: 'Add New Code',
              click: () => setShowAddModal(true),
              iconStart: <MdOutlineAddCircleOutline />,
              size: iSize.Small,
              variant: iVariant.Primary,
            },
            {
              label: 'Verify Tickets',
              iconStart: <MdOutlineOpenInNew />,
              size: iSize.Small,
              variant: iVariant.Secondary,
              type: iButtonType.Link,
              url: { link: '/stuff/verify', target: iTarget.Blank },
            },
          ]}
        />
        <div className={styles.codesContainer}>
          <div className="tableContainer">
            <table className={styles.codesTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Event ID</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccessCodes.map((code) => (
                  <tr key={code.id}>
                    <td>{code.id}</td>
                    <td>{code.code}</td>
                    <td>{code.eventId}</td>
                    <td>{code.user}</td>
                    <td className={styles[code.status]}>{code.status}</td>
                    <td>{code.createdAt}</td>
                    <td>
                      <Actions
                        fullWidth
                        actions={[
                          {
                            label: 'Edit',
                            click: () => handleEditCode(code),
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
            totalItems={filteredAccessCodes?.length}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onPageClick={handlePageClick}
          />
        </div>
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <div className={styles.editFormContainer}>
              <h2>Add New Access Code</h2>
              <Input
                type="text"
                label="Access Code"
                placeholder="Enter new access code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
              <Input
                type="number"
                label="Event ID"
                placeholder="Enter event ID"
                value={newEventId}
                onChange={(e) => setNewEventId(Number(e.target.value))}
              />
              <Input
                type="text"
                label="User Name"
                placeholder="Enter user name"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
              <Actions
                fullWidth
                actions={[
                  {
                    label: 'Add Code',
                    click: handleAddCode,
                    size: iSize.Small,
                  },
                ]}
              />
            </div>
          </Modal>
        )}
        {editingCode && (
          <Modal onClose={() => setEditingCode(null)}>
            <div className={styles.editFormContainer}>
              <h2>Edit Access Code</h2>
              <Input
                type="text"
                label="Access Code"
                placeholder="Enter access code"
                value={editingCode.code}
                onChange={(e) =>
                  setEditingCode({ ...editingCode, code: e.target.value })
                }
              />
              <Input
                type="number"
                label="Event ID"
                placeholder="Enter event ID"
                value={editingCode.eventId}
                onChange={(e) =>
                  setEditingCode({
                    ...editingCode,
                    eventId: Number(e.target.value),
                  })
                }
              />
              <Input
                type="text"
                label="User Name"
                placeholder="Enter user name"
                value={editingCode.user}
                onChange={(e) =>
                  setEditingCode({ ...editingCode, user: e.target.value })
                }
              />
              <Select
                name="status"
                label="Status"
                value={editingCode.status}
                handleSelectChange={(e) =>
                  setEditingCode({
                    ...editingCode,
                    status: e.target.value as 'active' | 'inactive',
                  })
                }
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
              <Actions
                fullWidth
                actions={[
                  {
                    label: 'Save',
                    click: handleSaveEdit,
                    size: iSize.Small,
                  },
                ]}
              />
            </div>
          </Modal>
        )}
        <div className={styles.analysisContainer}>
          <DashCard title="Access Codes Status">
            <TicketChart
              legend
              datasets={chartData}
              chartType={iChartType.Bar}
            />
          </DashCard>
          <DashCard title="Overall Access Codes Status">
            <TicketChart
              datasets={overallChartData}
              chartType={iChartType.Bar}
            />
          </DashCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccessCodes;
