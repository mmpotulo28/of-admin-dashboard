import React, { useState } from 'react';
import { useEventsContext } from '@/context/EventsContext';
import Actions from '@/components/Common/Actions';
import styles from './eventFilterForm.module.css';
import { iButtonType } from '@/components/Common/button';
import { iVariant } from '@/lib/types';
import { scrollToElement } from '@/lib/helpers';

const EventFilterForm: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    categories,
    locations,
    isLoading,
  } = useEventsContext();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(localFilters);
    scrollToElement('events');
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({
      category: '',
      dateRange: { startDate: '', endDate: '' },
      location: '',
      searchQuery: '',
    });
  };

  return (
    <form className={styles.eventFilterForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={localFilters.category}
          onChange={handleInputChange}
          disabled={isLoading}
        >
          <option value="">All Categories</option>
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dateRange">Date Range</label>
        <div className={styles.dateRangeGroup}>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={localFilters.dateRange.startDate}
            onChange={handleDateChange}
            disabled={isLoading}
          />
          <span>-</span>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={localFilters.dateRange.endDate}
            onChange={handleDateChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location">City</label>
        <select
          id="location"
          name="location"
          value={localFilters.location}
          onChange={handleInputChange}
          disabled={isLoading}
        >
          <option value="">All Locations</option>
          {locations.map((location: string) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <Actions
        actions={[
          {
            label: 'Apply Filters',
            type: iButtonType.Submit,
            disabled: isLoading,
          },
          {
            label: 'Reset Filters',
            click: () => handleReset(),
            type: iButtonType.Button,
            variant: iVariant.Secondary,
            disabled: isLoading,
          },
        ]}
        className={styles.buttonGroup}
      />
    </form>
  );
};

export default EventFilterForm;
