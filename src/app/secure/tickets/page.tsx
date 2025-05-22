'use client';
import React, { useState, useMemo, useEffect } from 'react';
import styles from './tickets.module.css';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import Divider from '@/components/Divider';
import { iTheme, iDetailedTicket } from '@/lib/types';
import TicketItem from '@/components/Dashboard/TicketItem';
import EventControls from '@/components/Dashboard/EventControls';
import Pagination from '@/components/pagination';
import axios from 'axios';

const TicketPage: React.FC = () => {
  const [sort, setSort] = useState<string>('date');
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tickets, setTickets] = useState<iDetailedTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const ticketsPerPage = 12;

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + '/tickets'
        );
        setTickets(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredAndSortedTickets = useMemo(() => {
    const filterTickets = (tickets: iDetailedTicket[]) => {
      return tickets.filter((ticket) => {
        if (
          search &&
          !ticket.event.title.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      });
    };

    const filtered = filterTickets(tickets);
    const sorted = filtered.sort((a, b) => {
      if (sort === 'date')
        return (
          new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
        );
      if (sort === 'title') return a.event.title.localeCompare(b.event.title);
      return 0;
    });
    return sorted;
  }, [search, sort, tickets]);

  const totalPages = Math.ceil(
    filteredAndSortedTickets.length / ticketsPerPage
  );
  const paginatedTickets = filteredAndSortedTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  return (
    <DashboardLayout type="admin">
      <EventControls
        sort={sort}
        search={search}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        onFilterChange={() => {}}
        filter="all"
      />
      {loading && <p>Loading tickets...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      <div className={styles.tickets}>
        {paginatedTickets?.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>

      <Divider theme={iTheme.Dark} />
      <Pagination
        currentPage={currentPage}
        totalItems={filteredAndSortedTickets.length}
        onNextPage={() =>
          setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
        }
        onPrevPage={() =>
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
        }
        onPageClick={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default TicketPage;
