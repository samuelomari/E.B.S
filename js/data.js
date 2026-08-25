        // ==================== DATA STORE ====================
        const Store = {
            currentUser: null,
            users: [
                { id: 1, name: 'Admin User', email: 'samuelomari3941@gmail.com', password: 'eventbooking', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff' },
                { id: 2, name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff' }
            ],
            events: [
                {
                    id: 1,
                    title: 'Summer Music Festival 2024',
                    description: 'Experience the biggest music festival of the year featuring top artists from around the world. Three days of non-stop music, food, and fun.',
                    date: '2024-07-15',
                    time: '14:00',
                    location: 'Central Park, New York',
                    price: 89.99,
                    category: 'Music',
                    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60',
                    capacity: 5000,
                    booked: 3421,
                    organizer: 'NYC Events Ltd',
                    status: 'active'
                },
                {
                    id: 2,
                    title: 'Tech Conference 2024',
                    description: 'Join industry leaders and innovators for a day of cutting-edge technology discussions, workshops, and networking opportunities.',
                    date: '2024-08-20',
                    time: '09:00',
                    location: 'Convention Center, San Francisco',
                    price: 299.99,
                    category: 'Technology',
                    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
                    capacity: 1200,
                    booked: 876,
                    organizer: 'TechWorld Inc',
                    status: 'active'
                },
                {
                    id: 3,
                    title: 'Food & Wine Expo',
                    description: 'Taste exquisite cuisines and premium wines from renowned chefs and sommeliers. A culinary journey you cannot miss.',
                    date: '2024-09-10',
                    time: '11:00',
                    location: 'Grand Hall, Chicago',
                    price: 65.00,
                    category: 'Food & Drink',
                    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60',
                    capacity: 800,
                    booked: 654,
                    organizer: 'Gourmet Events',
                    status: 'active'
                },
                {
                    id: 4,
                    title: 'Marathon 2024',
                    description: 'Annual city marathon. Join thousands of runners in this prestigious race through the city streets.',
                    date: '2024-10-05',
                    time: '06:00',
                    location: 'City Center, Boston',
                    price: 45.00,
                    category: 'Sports',
                    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=60',
                    capacity: 10000,
                    booked: 7234,
                    organizer: 'Boston Athletic Association',
                    status: 'active'
                }
            ],
            tickets: [
                { id: 'TKT-001', userId: 2, eventId: 1, quantity: 2, totalPrice: 179.98, purchaseDate: '2024-06-20', status: 'active', qrCode: 'QR-ABC123', paymentMethod: 'card' },
                { id: 'TKT-002', userId: 2, eventId: 3, quantity: 1, totalPrice: 65.00, purchaseDate: '2024-06-18', status: 'active', qrCode: 'QR-DEF456', paymentMethod: 'mpesa' }
            ],
            bookings: [
                { id: 1, userId: 2, eventId: 1, quantity: 2, date: '2024-06-20', status: 'confirmed' },
                { id: 2, userId: 2, eventId: 3, quantity: 1, date: '2024-06-18', status: 'confirmed' }
            ]
        };

