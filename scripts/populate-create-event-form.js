// Prefill script for the Create Event form
(() => {
  const dummyData = {
    title: 'Summer Music Festival',
    subtitle: 'An unforgettable night of music and fun',
    organizer: 'MusicWorld Inc.',
    date: { day: 'Saturday', number: '15', monthYear: '2023-07' },
    time: '18:00 - 23:00',
    location: 'Central Park, New York',
    website: 'https://summermusicfestival.com',
    category: 'Music',
    tags: 'Music, Festival, Live',
    images: ['stage.jpg', 'crowd.jpg', 'artist.jpg'],
    overview:
      "Join us for the Summer Music Festival featuring top artists, food trucks, and an amazing atmosphere. Don't miss out!",
    ticket: [
      {
        name: 'General',
        subtitle: 'Access to the main event area',
        price: 50,
        availability: 500,
        features: 'Access to food trucks, General seating',
      },
      {
        name: 'VIP',
        subtitle: 'Exclusive access to VIP areas',
        price: 150,
        availability: 100,
        features:
          'Front row seats, Complimentary drinks, Meet and greet with artists',
      },
    ],
  };

  // Helper function to set input values
  const setInputValue = (name, value) => {
    const input = document.querySelector(`[name="${name}"]`);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  // Prefill basic fields
  setInputValue('title', dummyData.title);
  setInputValue('subtitle', dummyData.subtitle);
  setInputValue('organizer', dummyData.organizer);
  setInputValue('date', `${dummyData.date.monthYear}-${dummyData.date.number}`);
  setInputValue('startTime', dummyData.time.split(' - ')[0]);
  setInputValue('endTime', dummyData.time.split(' - ')[1]);
  setInputValue('location', dummyData.location);
  setInputValue('website', dummyData.website);
  setInputValue('category', dummyData.category);
  setInputValue('tags', dummyData.tags);
  setInputValue('overview', dummyData.overview);

  // Prefill images (simulate file names)
  const imagesInput = document.querySelector(`[name="images"]`);
  if (imagesInput) {
    console.log(
      'Images cannot be prefilled programmatically due to browser restrictions. Please upload manually.'
    );
  }

  // Prefill ticket types
  dummyData.tickets.forEach((ticket, index) => {
    if (index > 0) {
      document.querySelector('button[aria-label="Add Ticket Type"]').click();
    }
    setInputValue(`tickets[${index}].name`, ticket.name);
    setInputValue(`tickets[${index}].subtitle`, ticket.subtitle);
    setInputValue(`tickets[${index}].price`, ticket.price);
    setInputValue(`tickets[${index}].availability`, ticket.availability);
    setInputValue(`tickets[${index}].features`, ticket.features);
  });

  console.log('Form prefilled with dummy data. Please review and submit.');
})();
