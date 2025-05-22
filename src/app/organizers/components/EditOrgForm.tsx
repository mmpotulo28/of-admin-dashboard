import React from 'react';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import Input from '@/components/Common/input';
import Select from '@/components/Common/select';
import Actions from '@/components/Common/Actions';
import { iOrganizer } from '../page';

interface EditOrgFormProps {
  editingOrganizer: iOrganizer | null;
  errors: Record<string, string>;
  setEditingOrganizer: (organizer: iOrganizer | null) => void;
  handleSaveEdit: () => void;
  clearErrors: () => void;
}

const EditOrgForm: React.FC<EditOrgFormProps> = ({
  editingOrganizer,
  errors,
  setEditingOrganizer,
  handleSaveEdit,
}) => {
  if (!editingOrganizer) return null;

  return (
    <div>
      <LockUp
        title="Edit Organizer"
        subtitle="Modify the details of the organizer"
        theme={iTheme.Dark}
        size={iSize.Medium}
      />
      <br />
      <Input
        type="text"
        label="Name"
        placeholder="Enter organizer name"
        value={editingOrganizer.name}
        error={errors?.name}
        onChange={(e) =>
          setEditingOrganizer({
            ...editingOrganizer,
            name: e.target.value,
          })
        }
      />
      <Input
        type="email"
        label="Email"
        placeholder="Enter organizer email"
        value={editingOrganizer.email}
        error={errors?.email}
        onChange={(e) =>
          setEditingOrganizer({
            ...editingOrganizer,
            email: e.target.value,
          })
        }
      />
      <Input
        type="text"
        label="Cell Number"
        placeholder="Enter cell number"
        value={editingOrganizer.cellNumber}
        error={errors?.cellNumber}
        onChange={(e) =>
          setEditingOrganizer({
            ...editingOrganizer,
            cellNumber: e.target.value,
          })
        }
      />
      <Input
        type="text"
        label="Address"
        placeholder="Enter address"
        value={editingOrganizer.address}
        error={errors?.address}
        onChange={(e) =>
          setEditingOrganizer({
            ...editingOrganizer,
            address: e.target.value,
          })
        }
      />
      <Select
        name="status"
        label="Status"
        value={editingOrganizer.status}
        error=""
        handleSelectChange={(e) =>
          setEditingOrganizer({
            ...editingOrganizer,
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
          },
        ]}
      />
    </div>
  );
};

export default EditOrgForm;
