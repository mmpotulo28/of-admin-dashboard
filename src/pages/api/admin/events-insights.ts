import { fetchUsers } from '@/lib/helpers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Mock data
    const rawData = [
      {
        id: 57,
        title: 'Test Demo Evenbt',
        subtitle: 'event only in demo',
        overview: 'over view. of the event. and this . and that.',
        date: '2025-04-25',
        location: 'Cape Town',
        category: 'Outdoor Event',
        organiser_id: 'b0db4d33-9908-4c5a-89da-7d196dc3354b',
        created_at: '2025-04-12 18:12:55.655093',
        updated_at: '2025-04-12 18:12:55.655093',
        tags: 'Music,Festival,Live',
        images:
          '4ab58c42-dc88-41c0-a5fa-379915f21b0f - Copy.jpg,4ab58c42-dc88-41c0-a5fa-379915f21b0f.jpg,411f405e-7af5-465c-9fa2-1e657b7bff68.jpg,4024cff5-b06a-49dd-a4f0-8bc54e1b282e.jpg,6196e1a1-f06c-4092-a53b-9305320f61ad.jpg',
        start_time: '20:00:00',
        end_time: '00:00:00',
        active: true,
        "id'": 50,
        name: 'VIP',
        description: 'Vip Access to Event',
        price: 60,
        total_tickets: 10,
        event_id: 57,
        features: 'nothing,nothing,new,nix',
        availability: 10,
        "id''": null,
        "event_id'": null,
        type_id: null,
        owner_id: null,
        purchase_date: null,
        transaction_id: null,
      },
      {
        id: 57,
        title: 'Test Demo Evenbt',
        subtitle: 'event only in demo',
        overview: 'over view. of the event. and this . and that.',
        date: '2025-04-25',
        location: 'Cape Town',
        category: 'Outdoor Event',
        organiser_id: 'b0db4d33-9908-4c5a-89da-7d196dc3354b',
        created_at: '2025-04-12 18:12:55.655093',
        updated_at: '2025-04-12 18:12:55.655093',
        tags: 'Music,Festival,Live',
        images:
          '4ab58c42-dc88-41c0-a5fa-379915f21b0f - Copy.jpg,4ab58c42-dc88-41c0-a5fa-379915f21b0f.jpg,411f405e-7af5-465c-9fa2-1e657b7bff68.jpg,4024cff5-b06a-49dd-a4f0-8bc54e1b282e.jpg,6196e1a1-f06c-4092-a53b-9305320f61ad.jpg',
        start_time: '20:00:00',
        end_time: '00:00:00',
        active: true,
        "id'": 49,
        name: 'General',
        description: 'General admission to events',
        price: 20,
        total_tickets: 55,
        event_id: 57,
        features: 'Access to all areas,Free drinks,And all',
        availability: 54,
        "id''": 94,
        "event_id'": 57,
        type_id: 49,
        owner_id: 'b0db4d33-9908-4c5a-89da-7d196dc3354b',
        purchase_date: '2025-04-14 07:50:57.201041',
        transaction_id: 32,
      },
      {
        id: 53,
        title: 'First Year Bash',
        subtitle: 'An unforgettable night of music and fun',
        overview: 'bgbfdgfdgggbfddgbfggf',
        date: '2025-04-06',
        location: 'https://summerfestival.com',
        category: 'Festival',
        organiser_id: 'b0db4d33-9908-4c5a-89da-7d196dc3354b',
        created_at: '2025-04-06 19:12:36.699071',
        updated_at: '2025-04-06 19:12:36.699071',
        tags: 'Music,Festival,Live',
        images:
          'f4532f96-9c83-4bec-b63a-bb017120df7e.jpg,pexels-mark-angelo-sampan-738078-1587927.jpg,pexels-sebastian-ervi-866902-1763075 (1).jpg,pixlr-image-generator-9bcf8459-2a15-4d12-9b23-627b5a53ef92.png,pixlr-image-generator-483a80fb-c33d-4817-b64b-9bad0140eb5e.png',
        start_time: '20:54:00',
        end_time: '23:54:00',
        active: true,
        "id'": 45,
        name: 'General',
        description: 'General admission to events',
        price: 20,
        total_tickets: 55,
        event_id: 53,
        features: 'Access to all areas,Free drinks',
        availability: 42,
        "id''": 97,
        "event_id'": 53,
        type_id: 45,
        owner_id: 'b0db4d33-9908-4c5a-89da-7d196dc3354b',
        purchase_date: '2025-04-15 12:25:36.083731',
        transaction_id: 35,
      },
      {
        id: 58,
        title: 'New Event Example',
        subtitle: 'Example subtitle',
        overview: 'Example overview',
        date: '2025-05-01',
        location: 'Johannesburg',
        category: 'Conference',
        organiser_id: 'example-organiser-id',
        created_at: '2025-04-15',
        updated_at: '2025-04-15',
        tags: 'Tech,Innovation',
        images: 'example.jpg',
        start_time: '09:00:00',
        end_time: '17:00:00',
        active: true,
        name: 'Standard',
        description: 'Standard ticket',
        price: 100,
        total_tickets: 200,
        availability: 150,
        purchase_date: '2025-04-16',
        transaction_id: 101,
      },
    ];

    // Fetch users
    const users = await fetchUsers({
      user: null,
      setIsLoading: () => {},
      setErrors: () => {},
      specific: null,
    });

    // Format data
    const totalRevenue = rawData.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
    const totalTicketsSold = rawData.reduce(
      (sum, item) => sum + (item.total_tickets - item.availability || 0),
      0
    );
    const eventsByCategory = rawData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    const organisersRevenue = rawData.reduce((acc, item) => {
      const organiser = users?.find((user) => user.id === item.organiser_id);
      const organiserName = organiser
        ? organiser.display_name
        : 'Unknown Organiser';
      acc[organiserName] =
        (acc[organiserName] || 0) +
        (item.price || 0) * (item.total_tickets - item.availability);
      return acc;
    }, {});

    const ticketSalesOverTime = rawData.reduce((acc, item) => {
      if (item.purchase_date) {
        const date = new Date(item.purchase_date).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    // Response
    return res.status(200).json({
      totalRevenue,
      totalTicketsSold,
      eventsByCategory,
      organisersRevenue,
      ticketSalesOverTime,
      rawData,
    });
  } catch (error) {
    console.error('Error querying events insights:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
