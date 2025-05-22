'use client';
import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import TicketChart, { iChartType } from '@/components/Dashboard/TicketChart';
import DashCard, { iGridColSpan } from '@/components/Dashboard/DashCard';
import styles from './sales.module.css';
import {
  benchmarkingDataset,
  campaignEffectivenessDataset,
  customerDemographicsDataset,
  dailySalesDataset,
  dummyData,
  emailMarketingDataset,
  liveSalesDataDataset,
  loyaltyProgramImpactDataset,
  monthlySalesDataset,
  pastEventsComparisonDataset,
  purchaseBehaviorDataset,
  regionalPerformanceDataset,
  revenueByPromotionDataset,
  revenueByTicketTypeDataset,
  salesByLocationDataset,
  weeklySalesDataset,
} from '@/lib/data';

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState(dummyData);

  const setSalesDataCallback = useCallback(() => {
    setSalesData(dummyData);
  }, []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSalesDataCallback();
    }, 1000);
  }, [setSalesDataCallback]);

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        {/* <h1>Sales Analytics</h1> */}
        <div className={styles.grid}>
          <section className={styles.overview + ' slideInLeft'}>
            <h2>Overview Dashboard</h2>
            <DashCard title="Total Sales" colSpan={iGridColSpan.One}>
              <p>${salesData.totalSales}</p>
            </DashCard>
            <DashCard title="Tickets Sold" colSpan={iGridColSpan.One}>
              <p>VIP: {salesData.ticketsSold.vip}</p>
              <p>General Admission: {salesData.ticketsSold.general}</p>
            </DashCard>
            <DashCard title="Remaining Inventory" colSpan={iGridColSpan.One}>
              <p>{salesData.remainingInventory}</p>
            </DashCard>
            <DashCard title="Event Performance" colSpan={iGridColSpan.One}>
              <p>{salesData.eventPerformance}</p>
            </DashCard>
          </section>

          <section className={styles.trends + ' slideInTop'}>
            <h2>Sales Trends</h2>
            <DashCard title="Daily Sales">
              <TicketChart
                datasets={[dailySalesDataset]}
                chartType={iChartType.Line}
              />
            </DashCard>

            <DashCard title="Weekly Sales">
              <TicketChart
                datasets={[weeklySalesDataset]}
                chartType={iChartType.Line}
              />
            </DashCard>

            <DashCard title="Monthly Sales">
              <TicketChart
                datasets={[monthlySalesDataset]}
                chartType={iChartType.Line}
              />
            </DashCard>
          </section>

          <section className={styles.revenue + ' slideInRight'}>
            <h2>Revenue Breakdown</h2>

            <DashCard title="Revenue by Ticket Type">
              <TicketChart
                legend
                square
                datasets={[revenueByTicketTypeDataset]}
                chartType={iChartType.Doughnut}
              />
            </DashCard>

            <DashCard title="Revenue by Promotion">
              <TicketChart
                datasets={[revenueByPromotionDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>
          </section>

          <section className={styles.customerInsights + ' slideInLeft'}>
            <h2>Customer Insights</h2>
            <DashCard title="Customer Demographics">
              <TicketChart
                datasets={[customerDemographicsDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>

            <DashCard title="Purchase Behavior">
              <TicketChart
                datasets={[purchaseBehaviorDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>

            <DashCard title="Loyalty Program Impact">
              <TicketChart
                datasets={[loyaltyProgramImpactDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>
          </section>

          <section className={styles.marketingPerformance + ' slideInTop'}>
            <h2>Marketing Performance</h2>
            <DashCard title="Campaign Effectiveness">
              <TicketChart
                datasets={[campaignEffectivenessDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>

            <DashCard title="Social Media Impact">
              <TicketChart datasets={[]} chartType={iChartType.Bar} />
            </DashCard>

            <DashCard title="Email Marketing">
              <TicketChart
                datasets={[emailMarketingDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>
          </section>

          <section className={styles.eventComparison + ' slideInRight'}>
            <h2>Event Comparison</h2>
            <DashCard title="Past Events Comparison">
              <TicketChart
                datasets={[pastEventsComparisonDataset]}
                chartType={iChartType.Line}
              />
            </DashCard>

            <DashCard title="Benchmarking">
              <TicketChart
                legend
                datasets={[benchmarkingDataset]}
                chartType={iChartType.Pie}
                square
              />
            </DashCard>
          </section>

          <section className={styles.geographicInsights + ' slideInBottom'}>
            <h2>Geographic Insights</h2>
            <DashCard title="Sales by Location">
              <TicketChart
                datasets={[salesByLocationDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>

            <DashCard title="Regional Performance">
              <TicketChart
                datasets={[regionalPerformanceDataset]}
                chartType={iChartType.Bar}
              />
            </DashCard>
          </section>

          <section className={styles.realTimeUpdates + ' slideInBottom'}>
            <h2>Real-Time Updates</h2>
            <DashCard title="Live Sales Data">
              <TicketChart
                datasets={[liveSalesDataDataset]}
                chartType={iChartType.Line}
              />
            </DashCard>

            <DashCard title="Alerts and Notifications">
              {/* Display alerts and notifications without chart */}
              <ul>
                {salesData.alertsAndNotifications.map((alert, index) => (
                  <li key={index}>{alert.message}</li>
                ))}
              </ul>
            </DashCard>
          </section>

          <section className={styles.recommendations + ' slideInBottom'}>
            <h2>Recommendations</h2>
            <DashCard title="Improve Sales">
              <p>
                To improve sales, consider implementing the following
                strategies:
              </p>
              <ul>
                <li>Offer discounts to early bird customers</li>
                <li>Launch a social media campaign</li>
                <li>Send out targeted email marketing campaigns</li>
              </ul>
            </DashCard>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesAnalytics;
