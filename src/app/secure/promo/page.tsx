'use client';
import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './promo.module.css';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import { FaCaretRight } from 'react-icons/fa';
import { iButtonType } from '@/components/Common/button';
import { MdDeleteForever, MdSave } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';
import DashCard from '@/components/Dashboard/DashCard';
import TicketChart, {
  iChartType,
  iDataset,
} from '@/components/Dashboard/TicketChart';
import Input from '@/components/Common/input';
import Select from '@/components/Common/select';

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  expiryDate: string;
  status: 'used' | 'unused' | 'expired';
  minimumAmount: number;
  usedBy?: string;
  usedOn?: string;
  ticketType?: string;
  revenue?: number;
}

type PromoAction =
  | { type: 'ADD_PROMO'; payload: PromoCode }
  | { type: 'DELETE_PROMO'; payload: number }
  | {
      type: 'EDIT_PROMO';
      payload: { id: number; updatedPromo: Partial<PromoCode> };
    }
  | { type: 'SAVE_PROMO'; payload: number }
  | { type: 'DISCARD_PROMO'; payload: number };

const promoReducer = (state: PromoCode[], action: PromoAction): PromoCode[] => {
  switch (action.type) {
    case 'ADD_PROMO':
      return [...state, { ...action.payload, id: state.length + 1 }];
    case 'DELETE_PROMO':
      return state.filter((promo) => promo.id !== action.payload);
    case 'EDIT_PROMO':
      return state.map((promo) =>
        promo.id === action.payload.id
          ? { ...promo, ...action.payload.updatedPromo }
          : promo
      );
    case 'SAVE_PROMO':
    case 'DISCARD_PROMO':
      return state;
    default:
      return state;
  }
};

const Promo: React.FC = () => {
  const [promoCodes, dispatch] = useReducer(promoReducer, [
    {
      id: 1,
      code: 'SAVE10',
      discount: 10,
      expiryDate: '2023-12-31',
      status: 'unused',
      minimumAmount: 50,
      revenue: 0,
    },
    {
      id: 2,
      code: 'WELCOME20',
      discount: 20,
      expiryDate: '2023-11-30',
      status: 'used',
      minimumAmount: 100,
      usedBy: 'John Doe',
      usedOn: '2023-10-01',
      ticketType: 'VIP',
      revenue: 200,
    },
  ]);

  const [formState, setFormState] = useState<PromoCode>({
    id: 0,
    code: '',
    discount: 0,
    expiryDate: '',
    status: 'unused',
    minimumAmount: 0,
    revenue: 0,
  });

  const [editedPromoCodes, setEditedPromoCodes] = useState<
    Record<number, Partial<PromoCode>>
  >({});

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (new Date(formState.expiryDate) < new Date()) {
        alert("Expiry date cannot be before today's date.");
        return;
      }
      dispatch({ type: 'ADD_PROMO', payload: formState });
      setFormState({
        id: 0,
        code: '',
        discount: 0,
        expiryDate: '',
        status: 'unused',
        minimumAmount: 0,
        revenue: 0,
      });
    },
    [formState]
  );

  const handleDeletePromoCode = useCallback((id: number) => {
    dispatch({ type: 'DELETE_PROMO', payload: id });
  }, []);

  const handleEditPromoCode = useCallback(
    (id: number, updatedPromo: Partial<PromoCode>) => {
      setEditedPromoCodes((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...updatedPromo },
      }));
    },
    []
  );

  const handleSaveChanges = useCallback(
    (id: number) => {
      dispatch({
        type: 'EDIT_PROMO',
        payload: { id, updatedPromo: editedPromoCodes[id] },
      });
      setEditedPromoCodes((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [editedPromoCodes]
  );

  const handleDiscardChanges = useCallback((id: number) => {
    setEditedPromoCodes((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const updatedPromoCodes = promoCodes.map((promo) => {
      if (
        new Date(promo.expiryDate) < new Date() &&
        promo.status === 'unused'
      ) {
        return { ...promo, status: 'expired' };
      }
      return promo;
    });
    updatedPromoCodes.forEach((promo) => {
      dispatch({
        type: 'EDIT_PROMO',
        payload: {
          id: promo.id,
          updatedPromo: {
            status: promo.status as 'used' | 'unused' | 'expired',
          },
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usedPromoCodes = promoCodes.filter(
    (promo) => promo.status === 'used'
  ).length;
  const unusedPromoCodes = promoCodes.filter(
    (promo) => promo.status === 'unused'
  ).length;
  const expiredPromoCodes = promoCodes.filter(
    (promo) => promo.status === 'expired'
  ).length;

  const revenueByPromoDataset: iDataset = {
    data: promoCodes.map((promo) => ({
      label: promo.code,
      value: promo.revenue || 0,
    })),
    legendText: 'Revenue by Promo Code',
    color: '#FFBB28',
  };

  const promoStatusDataset: iDataset = {
    data: [
      { label: 'Used', value: usedPromoCodes },
      { label: 'Unused', value: unusedPromoCodes },
      { label: 'Expired', value: expiredPromoCodes },
    ],
    legendText: 'Promo Code Status',
    color: '#0088FE',
  };

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp title="Manage Promo Codes" theme={iTheme.Dark} />
        <div className={styles.grid}>
          <div className={styles.formContainer}>
            <h2>Create New Promo Code</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                name="code"
                type="text"
                label="Promo Code"
                placeholder="Promo Code"
                value={formState.code}
                onChange={onChange}
              />
              <Input
                name="discount"
                type="number"
                min={0}
                label="Discount (%)"
                placeholder="Discount (%)"
                value={formState.discount}
                onChange={onChange}
              />

              <Input
                name="expiryDate"
                type="date"
                label="Expiry Date"
                value={formState.expiryDate}
                onChange={onChange}
              />
              <Input
                name="minimumAmount"
                type="number"
                min={0}
                label="Minimum Amount"
                placeholder="Minimum Amount"
                value={formState.minimumAmount}
                onChange={onChange}
              />

              <Actions
                fullWidth
                actions={[
                  {
                    label: 'Add Promo Code',
                    variant: iVariant.Primary,
                    size: iSize.Small,
                    iconEnd: <FaCaretRight />,
                    type: iButtonType.Submit,
                  },
                ]}
              />
            </form>
          </div>

          <DashCard title="Promo Code Status">
            <TicketChart
              legend
              square
              datasets={[promoStatusDataset]}
              chartType={iChartType.Doughnut}
            />
          </DashCard>
          <DashCard title="Revenue by Promo Code">
            <TicketChart
              legend
              square
              datasets={[revenueByPromoDataset]}
              chartType={iChartType.Pie}
            />
          </DashCard>

          <div className={styles.promoListContainer}>
            <h2>Existing Promo Codes</h2>
            <div className="tableContainer">
              <table className={styles.promoTable}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount (%)</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Minimum Amount</th>
                    <th>Used By</th>
                    <th>Used On</th>
                    <th>Ticket Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo.id}>
                      <td>
                        <Input
                          type="text"
                          value={editedPromoCodes[promo.id]?.code || promo.code}
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              code: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={
                            editedPromoCodes[promo.id]?.discount ||
                            promo.discount
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              discount: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          value={
                            editedPromoCodes[promo.id]?.expiryDate ||
                            promo.expiryDate
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <Select
                          name="status"
                          value={
                            editedPromoCodes[promo.id]?.status || promo.status
                          }
                          handleSelectChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              status: e.target.value as
                                | 'used'
                                | 'unused'
                                | 'expired',
                            })
                          }
                          options={[
                            { value: 'unused', label: 'Unused' },
                            { value: 'used', label: 'Used' },
                            { value: 'expired', label: 'Expired' },
                          ]}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={
                            editedPromoCodes[promo.id]?.minimumAmount ||
                            promo.minimumAmount
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              minimumAmount: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={
                            editedPromoCodes[promo.id]?.usedBy ||
                            promo.usedBy ||
                            ''
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              usedBy: e.target.value,
                            })
                          }
                          disabled={promo.status !== 'used'}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          value={
                            editedPromoCodes[promo.id]?.usedOn ||
                            promo.usedOn ||
                            ''
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              usedOn: e.target.value,
                            })
                          }
                          disabled={promo.status !== 'used'}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={
                            editedPromoCodes[promo.id]?.ticketType ||
                            promo.ticketType ||
                            ''
                          }
                          onChange={(e) =>
                            handleEditPromoCode(promo.id, {
                              ticketType: e.target.value,
                            })
                          }
                          disabled={promo.status !== 'used'}
                        />
                      </td>
                      <td>
                        {!editedPromoCodes[promo.id] && (
                          <Actions
                            fullWidth
                            actions={[
                              {
                                label: 'Delete',
                                variant: iVariant.Secondary,
                                size: iSize.Small,
                                iconEnd: <MdDeleteForever />,
                                type: iButtonType.Icon,
                                click: () => handleDeletePromoCode(promo.id),
                              },
                            ]}
                          />
                        )}
                        {editedPromoCodes[promo.id] && (
                          <Actions
                            fullWidth
                            actions={[
                              {
                                label: 'Save',
                                variant: iVariant.Primary,
                                size: iSize.Small,
                                type: iButtonType.Icon,
                                iconEnd: <MdSave />,
                                click: () => handleSaveChanges(promo.id),
                              },
                              {
                                label: 'Discard',
                                variant: iVariant.Secondary,
                                size: iSize.Small,
                                iconEnd: <VscDiscard />,
                                type: iButtonType.Icon,
                                click: () => handleDiscardChanges(promo.id),
                              },
                            ]}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Promo;
