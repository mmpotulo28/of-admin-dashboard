'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import TicketChart, { iChartType } from '@/components/Dashboard/TicketChart';
import Insight from '@/components/Dashboard/Insights';
import styles from './insights.module.css';
import axios from 'axios';
import DashCard from '@/components/Dashboard/DashCard';
import LockUp from '@/components/Common/lockup';
import { iTheme } from '@/lib/types';

const AdminInsights = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/events-insights');
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch insights data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp title="Admin Insights" theme={iTheme.Dark} />

        {loading && <p>Loading insights...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && data && (
          <>
            <Insight
              insights={[
                {
                  label: 'Total Revenue',
                  value: `R${data.totalRevenue?.toFixed(2)}`,
                },
                { label: 'Total Tickets Sold', value: data.totalTicketsSold },
                { label: 'Total Events', value: data.rawData.length },
              ]}
            />

            <div className={styles.charts}>
              <DashCard title={'Events By Category'}>
                <TicketChart
                  chartType={iChartType.Bar}
                  datasets={Object.entries(data.eventsByCategory).map(
                    ([category, count]) => ({
                      data: [
                        { label: category, value: count as string | number },
                      ],
                      legendText: category,
                      color:
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    })
                  )}
                  legend
                />
              </DashCard>

              <DashCard title={'Revenue Per Organiser'}>
                <TicketChart
                  legend
                  chartType={iChartType.Line}
                  datasets={Object.entries(data.organisersRevenue).map(
                    ([organiser, revenue]) => ({
                      data: [{ label: organiser, value: revenue as number }],
                      legendText: organiser,
                      color:
                        '#' + Math.floor(Math.random() * 16777215).toString(16),
                    })
                  )}
                />
              </DashCard>

              <DashCard title={'Ticket Sales Over Time'}>
                <TicketChart
                  chartType={iChartType.Line}
                  datasets={[
                    {
                      legendText: 'Ticket Sales',
                      data: Object.entries(data.ticketSalesOverTime).map(
                        ([date, count]) => ({
                          label: date,
                          value: count as number,
                        })
                      ),
                      color: '#34a853',
                    },
                  ]}
                  legend={true}
                />
              </DashCard>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminInsights;
