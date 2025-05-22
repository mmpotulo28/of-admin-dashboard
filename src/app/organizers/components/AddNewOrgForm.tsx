import React from 'react';
import LockUp from '@/components/Common/lockup';
import Input from '@/components/Common/input';
import Actions from '@/components/Common/Actions';
import { iSize, iTheme } from '@/lib/types';

interface iAddNewOrgFormProps {
  newName: string;
  newEmail: string;
  newCellNumber: string;
  newAddress: string;
  errors: Record<string, string>;
  setNewName: (value: string) => void;
  setNewEmail: (value: string) => void;
  setNewCellNumber: (value: string) => void;
  setNewAddress: (value: string) => void;
  handleAddOrganizer: () => void;
  clearErrors: () => void;
}

const AddNewOrgForm: React.FC<iAddNewOrgFormProps> = ({
  newName,
  newEmail,
  newCellNumber,
  newAddress,
  errors,
  setNewName,
  setNewEmail,
  setNewCellNumber,
  setNewAddress,
  handleAddOrganizer,
  clearErrors,
}) => {
  return (
    <div>
      <LockUp
        title="Add New Organizer"
        subtitle="Fill in the details to add a new organizer"
        theme={iTheme.Dark}
        size={iSize.Medium}
      />
      <Input
        type="text"
        label="Name"
        placeholder="Enter organizer name"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
          clearErrors();
        }}
        error={errors?.name}
      />
      <Input
        type="email"
        label="Email"
        placeholder="Enter organizer email"
        value={newEmail}
        onChange={(e) => {
          setNewEmail(e.target?.value);
          clearErrors();
        }}
        error={errors?.email}
      />
      <Input
        type="text"
        label="Cell Number"
        placeholder="Enter cell number"
        value={newCellNumber}
        onChange={(e) => {
          setNewCellNumber(e.target.value);
          clearErrors();
        }}
        error={errors?.cellNumber}
      />
      <Input
        type="text"
        label="Address"
        placeholder="Enter address"
        value={newAddress}
        onChange={(e) => {
          setNewAddress(e.target.value);
          clearErrors();
        }}
        error={errors?.address}
      />
      <Actions
        fullWidth
        actions={[
          {
            label: 'Add Organizer',
            click: handleAddOrganizer(),
          },
        ]}
      />
    </div>
  );
};

export default AddNewOrgForm;
