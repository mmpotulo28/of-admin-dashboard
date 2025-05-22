import React from "react";
import styles from "./dashcontrols.module.css";

interface EventControlsProps {
  filter: string;
  sort: string;
  search: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventControls: React.FC<EventControlsProps> = ({
  filter,
  sort,
  search,
  onFilterChange,
  onSortChange,
  onSearchChange,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.control}>
        <label htmlFor="filter">Filter :</label>
        <select id="filter" value={filter} onChange={onFilterChange}>
          <option value="all">All</option>
          <option value="attended">Attended</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className={styles.control}>
        <label htmlFor="sort">Sort:</label>
        <select id="sort" value={sort} onChange={onSortChange}>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.control}>
        <label htmlFor="search">Search :</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search by title"
        />
      </div>
    </div>
  );
};

export default EventControls;
