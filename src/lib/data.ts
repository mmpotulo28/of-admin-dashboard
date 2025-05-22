import { iDataset } from '@/components/Dashboard/TicketChart';

export const dummyData = {
  totalSales: 50000,
  ticketsSold: { vip: 200, general: 800 },
  remainingInventory: 500,
  eventPerformance: 'Better than last event',
  dailySales: [
    { date: '2023-10-01', sales: 1000 },
    { date: '2023-10-02', sales: 1500 },
    { date: '2023-10-03', sales: 1200 },
    { date: '2023-10-04', sales: 1800 },
    { date: '2023-10-05', sales: 1600 },
  ],
  weeklySales: [
    { week: 'Week 1', sales: 7000 },
    { week: 'Week 2', sales: 8000 },
    { week: 'Week 3', sales: 7500 },
    { week: 'Week 4', sales: 9000 },
    { week: 'Week 5', sales: 8500 },
  ],
  monthlySales: [
    { month: 'January', sales: 20000 },
    { month: 'February', sales: 30000 },
    { month: 'March', sales: 25000 },
    { month: 'April', sales: 35000 },
    { month: 'May', sales: 40000 },
    { month: 'June', sales: 45000 },
  ],
  revenueByTicketType: [
    { name: 'VIP', value: 30000 },
    { name: 'General', value: 20000 },
    { name: 'Early Bird', value: 15000 },
    { name: 'Group', value: 10000 },
    { name: 'Student', value: 5000 },
  ],
  revenueByPromotion: [
    { promotion: 'Discount Code', revenue: 10000 },
    { promotion: 'Early Bird', revenue: 15000 },
    { promotion: 'Group Discount', revenue: 8000 },
    { promotion: 'Student Discount', revenue: 5000 },
    { promotion: 'Flash Sale', revenue: 12000 },
  ],
  customerDemographics: [
    { ageGroup: '18-25', count: 300 },
    { ageGroup: '26-35', count: 400 },
    { ageGroup: '36-45', count: 200 },
    { ageGroup: '46-55', count: 100 },
    { ageGroup: '56+', count: 50 },
  ],
  purchaseBehavior: [
    { behavior: 'Early Bird', count: 500 },
    { behavior: 'Last Minute', count: 200 },
    { behavior: 'Group Purchase', count: 150 },
    { behavior: 'Single Purchase', count: 300 },
    { behavior: 'Promo Code', count: 100 },
  ],
  loyaltyProgramImpact: [
    { member: 'Yes', sales: 30000 },
    { member: 'No', sales: 20000 },
    { member: 'New Member', sales: 15000 },
    { member: 'Returning Member', sales: 25000 },
    { member: 'VIP Member', sales: 35000 },
  ],
  campaignEffectiveness: [
    { campaign: 'Email', sales: 15000 },
    { campaign: 'Social Media', sales: 20000 },
    { campaign: 'Influencer', sales: 10000 },
    { campaign: 'Paid Ads', sales: 25000 },
    { campaign: 'Organic', sales: 5000 },
  ],
  socialMediaImpact: [
    { platform: 'Facebook', sales: 10000 },
    { platform: 'Instagram', sales: 15000 },
    { platform: 'Twitter', sales: 5000 },
    { platform: 'LinkedIn', sales: 3000 },
    { platform: 'TikTok', sales: 7000 },
  ],
  emailMarketing: [
    { campaign: 'Newsletter', sales: 10000 },
    { campaign: 'Promotional', sales: 5000 },
    { campaign: 'Event Reminder', sales: 8000 },
    { campaign: 'Follow-Up', sales: 3000 },
    { campaign: 'Special Offer', sales: 7000 },
  ],
  pastEventsComparison: [
    { event: 'Event 1', sales: 40000 },
    { event: 'Event 2', sales: 45000 },
    { event: 'Event 3', sales: 35000 },
    { event: 'Event 4', sales: 50000 },
    { event: 'Event 5', sales: 55000 },
  ],
  benchmarking: [
    { benchmark: 'Industry Average', sales: 30000 },
    { benchmark: 'Top Performer', sales: 60000 },
    { benchmark: 'Median', sales: 40000 },
    { benchmark: 'Bottom Performer', sales: 20000 },
    { benchmark: 'Above Average', sales: 45000 },
  ],
  salesByLocation: [
    { location: 'New York', sales: 20000 },
    { location: 'Los Angeles', sales: 15000 },
    { location: 'Chicago', sales: 10000 },
    { location: 'Houston', sales: 8000 },
    { location: 'Miami', sales: 7000 },
  ],
  regionalPerformance: [
    { region: 'East Coast', sales: 25000 },
    { region: 'West Coast', sales: 20000 },
    { region: 'Midwest', sales: 15000 },
    { region: 'South', sales: 10000 },
    { region: 'North', sales: 5000 },
  ],
  liveSalesData: [
    { time: '10:00 AM', sales: 500 },
    { time: '10:05 AM', sales: 700 },
    { time: '10:10 AM', sales: 600 },
    { time: '10:15 AM', sales: 800 },
    { time: '10:20 AM', sales: 900 },
  ],
  alertsAndNotifications: [
    { alert: 'Low Inventory', message: 'Only 50 tickets left for VIP' },
    { alert: 'High Sales', message: 'Sales spiked at 2 PM' },
    { alert: 'New Promotion', message: 'Flash Sale starting soon' },
    { alert: 'Event Reminder', message: 'Event starts in 1 hour' },
    { alert: 'Ticket Sold Out', message: 'General Admission tickets sold out' },
  ],
};

export const dailySalesDataset: iDataset = {
  data: dummyData.dailySales,
  legendText: 'Daily Sales',
  color: '#8884d8',
};

export const weeklySalesDataset: iDataset = {
  data: dummyData.weeklySales,
  legendText: 'Weekly Sales',
  color: '#82ca9d',
};

export const monthlySalesDataset: iDataset = {
  data: dummyData.monthlySales,
  legendText: 'Monthly Sales',
  color: '#FFBB28',
};

export const revenueByTicketTypeDataset: iDataset = {
  data: dummyData.revenueByTicketType,
  legendText: 'Revenue by Ticket Type',
  color: '#FF8042',
};

export const revenueByPromotionDataset: iDataset = {
  data: dummyData.revenueByPromotion,
  legendText: 'Revenue by Promotion',
  color: '#00C49F',
};

export const customerDemographicsDataset: iDataset = {
  data: dummyData.customerDemographics,
  legendText: 'Customer Demographics',
  color: '#0088FE',
};

export const purchaseBehaviorDataset: iDataset = {
  data: dummyData.purchaseBehavior,
  legendText: 'Purchase Behavior',
  color: '#FFBB28',
};

export const loyaltyProgramImpactDataset: iDataset = {
  data: dummyData.loyaltyProgramImpact,
  legendText: 'Loyalty Program Impact',
  color: '#FF8042',
};

export const campaignEffectivenessDataset: iDataset = {
  data: dummyData.campaignEffectiveness,
  legendText: 'Campaign Effectiveness',
  color: '#00C49F',
};

export const socialMediaImpactDataset: iDataset = {
  data: dummyData.socialMediaImpact,
  legendText: 'Social Media Impact',
  color: '#0088FE',
};

export const emailMarketingDataset: iDataset = {
  data: dummyData.emailMarketing,
  legendText: 'Email Marketing',
  color: '#FFBB28',
};

export const pastEventsComparisonDataset: iDataset = {
  data: dummyData.pastEventsComparison,
  legendText: 'Past Events Comparison',
  color: '#FF8042',
};

export const benchmarkingDataset: iDataset = {
  data: dummyData.benchmarking,
  legendText: 'Benchmarking',
  color: '#00C49F',
};

export const salesByLocationDataset: iDataset = {
  data: dummyData.salesByLocation,
  legendText: 'Sales by Location',
  color: '#0088FE',
};

export const regionalPerformanceDataset: iDataset = {
  data: dummyData.regionalPerformance,
  legendText: 'Regional Performance',
  color: '#FFBB28',
};

export const liveSalesDataDataset: iDataset = {
  data: dummyData.liveSalesData,
  legendText: 'Live Sales Data',
  color: '#FF8042',
};

export const initialState = {
  username: 'john_doe',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone_number: '123-456-7890',
  address: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  country: 'USA',
  facebook: 'https://facebook.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  instagram: 'https://instagram.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  avatar_url: '/image/logo-long.jpg',
  login_provider: 'google',
  user_type: 'organizer',
};

export const initialStateBlank = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  github: '',
  avatar_url: '/image/logo-long.jpg',
  login_provider: '',
  user_type: '',
};

export const eventCategories = [
  { value: 'Music', label: 'Music' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Business', label: 'Business' },
  { value: 'Art', label: 'Art' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Night-Club', label: 'Night Club' },
  { value: 'Other', label: 'Other' },
];
