'use client';
import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import Modal from '@/components/Modal';
import {
  validateEmail,
  validatePhoneNumber,
  validateName,
  validateAddress,
} from '@/lib/helpers';
import AddNewOrgForm from './components/AddNewOrgForm';
import EditOrgForm from './components/EditOrgForm';
import OrgTable from './components/OrgTable';
import styles from './organizers.module.css';
import { MdOutlineAddCircleOutline } from 'react-icons/md';

export interface iOrganizer {
  id: number;
  name: string;
  email: string;
  cellNumber: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  eventCount: number;
  revenue: number;
}

const initialOrganizers: iOrganizer[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    cellNumber: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    status: 'active',
    createdAt: '2023-01-01 10:00:00',
    eventCount: 5,
    revenue: 1000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    cellNumber: '234-567-8901',
    address: '456 Elm St, Othertown, USA',
    status: 'inactive',
    createdAt: '2023-02-01 11:00:00',
    eventCount: 3,
    revenue: 750,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    cellNumber: '345-678-9012',
    address: '789 Oak St, Sometown, USA',
    status: 'active',
    createdAt: '2023-03-01 12:00:00',
    eventCount: 8,
    revenue: 1500,
  },
  {
    id: 4,
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    cellNumber: '456-789-0123',
    address: '101 Pine St, Anycity, USA',
    status: 'inactive',
    createdAt: '2023-04-01 13:00:00',
    eventCount: 2,
    revenue: 500,
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    cellNumber: '567-890-1234',
    address: '202 Maple St, Othercity, USA',
    status: 'active',
    createdAt: '2023-05-01 14:00:00',
    eventCount: 6,
    revenue: 1200,
  },
  {
    id: 6,
    name: 'Diana Evans',
    email: 'diana.evans@example.com',
    cellNumber: '678-901-2345',
    address: '303 Birch St, Somecity, USA',
    status: 'inactive',
    createdAt: '2023-06-01 15:00:00',
    eventCount: 4,
    revenue: 900,
  },
  {
    id: 7,
    name: 'Eve Foster',
    email: 'eve.foster@example.com',
    cellNumber: '789-012-3456',
    address: '404 Cedar St, Anothertown, USA',
    status: 'active',
    createdAt: '2023-07-01 16:00:00',
    eventCount: 7,
    revenue: 1400,
  },
  {
    id: 8,
    name: 'Frank Green',
    email: 'frank.green@example.com',
    cellNumber: '890-123-4567',
    address: '505 Spruce St, Yetanothertown, USA',
    status: 'inactive',
    createdAt: '2023-08-01 17:00:00',
    eventCount: 1,
    revenue: 300,
  },
  {
    id: 9,
    name: 'Grace Harris',
    email: 'grace.harris@example.com',
    cellNumber: '901-234-5678',
    address: '606 Willow St, Thiscity, USA',
    status: 'active',
    createdAt: '2023-09-01 18:00:00',
    eventCount: 9,
    revenue: 1600,
  },
  {
    id: 10,
    name: 'Henry Irving',
    email: 'henry.irving@example.com',
    cellNumber: '012-345-6789',
    address: '707 Ash St, Thatcity, USA',
    status: 'inactive',
    createdAt: '2023-10-01 19:00:00',
    eventCount: 0,
    revenue: 0,
  },
];

/**
 * The `Organizers` component is a React functional component that provides an interface for managing event organizers.
 * It allows users to view, add, edit, and paginate through a list of organizers.
 *
 * @component
 * @example
 * return (
 *   <Organizers />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses several state variables to manage the list of organizers, the current page, form inputs, and validation errors?.
 * It also includes modals for adding and editing organizers.
 *
 * @function
 * @name Organizers
 */
const Organizers: React.FC = () => {
  const [organizers, setOrganizers] = useState<iOrganizer[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newCellNumber, setNewCellNumber] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [editingOrganizer, setEditingOrganizer] = useState<iOrganizer | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filter] = useState<string>('all');
  const [sort] = useState<string>('date');
  const [search] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    setOrganizers(initialOrganizers);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateFields = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!validateName(newName)) newErrors.name = 'Invalid name format';
    if (!validateEmail(newEmail)) newErrors.email = 'Invalid email format';
    if (!validatePhoneNumber(newCellNumber))
      newErrors.cellNumber = 'Invalid phone number format';
    if (!validateAddress(newAddress))
      newErrors.address = 'Invalid address format';
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  }, [newAddress, newCellNumber, newEmail, newName]);

  const handleAddOrganizer = useCallback(() => {
    if (!validateFields()) return;

    const newOrganizer: iOrganizer = {
      id: organizers?.length + 1,
      name: newName,
      email: newEmail,
      cellNumber: newCellNumber,
      address: newAddress,
      status: 'active',
      createdAt: new Date().toLocaleString(),
      eventCount: 0,
      revenue: 0,
    };
    setOrganizers([...organizers, newOrganizer]);
    setNewName('');
    setNewEmail('');
    setNewCellNumber('');
    setNewAddress('');
    setShowAddModal(false);
    clearErrors();
  }, [
    validateFields,
    organizers,
    newName,
    newEmail,
    newCellNumber,
    newAddress,
    clearErrors,
  ]);

  const handleEditOrganizer = useCallback((organizer: iOrganizer) => {
    setEditingOrganizer(organizer);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingOrganizer) {
      if (!validateFields()) return;

      setOrganizers(
        organizers?.map((organizer) =>
          organizer.id === editingOrganizer.id ? editingOrganizer : organizer
        )
      );
      setEditingOrganizer(null);
      clearErrors();
    }
  }, [editingOrganizer, validateFields, organizers, clearErrors]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
  }, []);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const filteredOrganizers = organizers
    .filter((organizer) => {
      if (filter === 'all') return true;
      return organizer.status === filter;
    })
    .filter((organizer) => {
      return organizer.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'date') {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const paginatedOrganizers = filteredOrganizers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp
          title="Manage Organizers"
          subtitle="View and manage event organizers"
          theme={iTheme.Dark}
          size={iSize.Large}
        />

        <Actions
          actions={[
            {
              label: 'Add New Organizer',
              click: () => {
                setShowAddModal(true);
                clearErrors();
              },
              iconStart: <MdOutlineAddCircleOutline />,
              size: iSize.Small,
              variant: iVariant.Primary,
            },
          ]}
        />

        <OrgTable
          paginatedOrganizers={paginatedOrganizers}
          currentPage={currentPage}
          filteredOrganizersLength={filteredOrganizers?.length}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handlePageClick={handlePageClick}
          handleEditOrganizer={handleEditOrganizer}
        />

        {showAddModal && (
          <Modal
            onClose={() => {
              setShowAddModal(false);
              clearErrors();
            }}
          >
            <AddNewOrgForm
              newName={newName}
              newEmail={newEmail}
              newCellNumber={newCellNumber}
              newAddress={newAddress}
              errors={errors}
              setNewName={setNewName}
              setNewEmail={setNewEmail}
              setNewCellNumber={setNewCellNumber}
              setNewAddress={setNewAddress}
              handleAddOrganizer={handleAddOrganizer}
              clearErrors={clearErrors}
            />
          </Modal>
        )}

        {editingOrganizer && (
          <Modal
            onClose={() => {
              setEditingOrganizer(null);
              clearErrors();
            }}
          >
            <EditOrgForm
              editingOrganizer={editingOrganizer}
              errors={errors}
              setEditingOrganizer={setEditingOrganizer}
              handleSaveEdit={handleSaveEdit}
              clearErrors={clearErrors}
            />
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Organizers;
