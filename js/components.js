        const Components = {
            Login: () => `
                <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl fade-in">
                        <div class="text-center">
                            <div class="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
                                <i class="fas fa-ticket-alt text-white text-2xl"></i>
                            </div>
                            <h2 class="text-3xl font-extrabold text-gray-900">Welcome back</h2>
                            <p class="mt-2 text-sm text-gray-600">Sign in with a verified Gmail account to continue</p>
                        </div>

                        <form id="login-form" class="space-y-6" onsubmit="event.preventDefault(); UI.handleLogin();">
                            <button type="submit" class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                                <i class="fab fa-google text-red-500"></i>
                                Continue with Google
                            </button>
                            <p class="text-center text-xs text-gray-500">Only verified @gmail.com accounts are allowed.</p>
                        </form>

                        <div class="mt-6">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-300"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-white text-gray-500">Quick Test / Demo Login</span>
                                </div>
                            </div>
                            <div class="mt-4 grid grid-cols-2 gap-3">
                                <button type="button" onclick="UI.handleDemoLogin('admin')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <i class="fas fa-user-shield mr-2 text-primary-600"></i> Admin Demo
                                </button>
                                <button type="button" onclick="UI.handleDemoLogin('user')" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <i class="fas fa-user mr-2 text-green-600"></i> User Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,

            UserDashboard: () => {
                const tickets = Utils.getUserTickets(Store.currentUser.id);
                const upcomingEvents = Store.events.filter(e => new Date(e.date) >= new Date() && e.status === 'active').slice(0, 3);
                
                return `
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-gray-900">Welcome back, ${Store.currentUser.name.split(' ')[0]}!</h1>
                            <p class="text-gray-600 mt-1">Here is what is happening with your events.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">My Tickets</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${tickets.length}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-ticket-alt text-primary-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Total Spent</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${Utils.formatCurrency(tickets.reduce((sum, t) => sum + t.totalPrice, 0))}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-wallet text-green-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${upcomingEvents.length}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-calendar-alt text-purple-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div class="lg:col-span-2">
                                <div class="flex items-center justify-between mb-4">
                                    <h2 class="text-xl font-bold text-gray-900">My Tickets</h2>
                                    <button onclick="Router.navigate('events')" class="text-primary-600 hover:text-primary-700 font-medium text-sm">Browse Events <i class="fas fa-arrow-right ml-1"></i></button>
                                </div>
                                ${tickets.length === 0 ? `
                                    <div class="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i class="fas fa-ticket-alt text-gray-400 text-2xl"></i>
                                        </div>
                                        <h3 class="text-lg font-medium text-gray-900 mb-1">No tickets yet</h3>
                                        <p class="text-gray-500 mb-4">Explore events and book your first ticket!</p>
                                        <button onclick="Router.navigate('events')" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Find Events</button>
                                    </div>
                                ` : `
                                    <div class="space-y-4">
                                        ${tickets.map(ticket => {
                                            const event = Utils.getEventById(ticket.eventId);
                                            const paymentIcons = {
                                                card: 'fa-credit-card text-blue-600',
                                                paypal: 'fa-paypal text-orange-600',
                                                mpesa: 'fa-mobile-alt text-green-600'
                                            };
                                            return `
                                                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onclick="Router.navigate('ticket-detail', {ticketId: '${ticket.id}'})">
                                                    <div class="flex flex-col sm:flex-row">
                                                        <div class="sm:w-48 h-32 sm:h-auto relative">
                                                            <img src="${event.image}" loading="lazy" decoding="async" class="w-full h-full object-cover" alt="${event.title}">
                                                            <div class="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-gray-800">
                                                                ${event.category}
                                                            </div>
                                                        </div>
                                                        <div class="flex-1 p-4">
                                                            <div class="flex justify-between items-start">
                                                                <div>
                                                                    <h3 class="font-semibold text-gray-900 line-clamp-1">${event.title}</h3>
                                                                    <p class="text-sm text-gray-500 mt-1"><i class="far fa-calendar mr-1"></i> ${Utils.formatDate(event.date)}</p>
                                                                    <p class="text-sm text-gray-500"><i class="far fa-clock mr-1"></i> ${Utils.formatTime(event.time)}</p>
                                                                </div>
                                                                <div class="text-right">
                                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        Active
                                                                    </span>
                                                                    <p class="text-sm font-bold text-gray-900 mt-1">x${ticket.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <div class="mt-3 flex items-center justify-between">
                                                                <span class="text-xs text-gray-500">ID: ${ticket.id}</span>
                                                                <div class="flex items-center gap-2">
                                                                    <i class="fas ${paymentIcons[ticket.paymentMethod] || 'fa-credit-card text-gray-400'}"></i>
                                                                    <span class="text-primary-600 font-medium text-sm">View Ticket <i class="fas fa-chevron-right ml-1"></i></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                `}
                            </div>

                            <div>
                                <h2 class="text-xl font-bold text-gray-900 mb-4">Featured Events</h2>
                                <div class="space-y-4">
                                    ${upcomingEvents.map(event => `
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onclick="Router.navigate('event-detail', {eventId: ${event.id}})">
                                            <div class="relative h-32">
                                                <img src="${event.image}" loading="lazy" decoding="async" class="w-full h-full object-cover" alt="${event.title}">
                                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                    <p class="text-white font-semibold text-sm line-clamp-1">${event.title}</p>
                                                </div>
                                            </div>
                                            <div class="p-3">
                                                <div class="flex items-center justify-between text-xs text-gray-500">
                                                    <span><i class="far fa-calendar mr-1"></i> ${Utils.formatDate(event.date)}</span>
                                                    <span class="font-bold text-primary-600">${Utils.formatCurrency(event.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            Events: () => {
                const categories = [...new Set(Store.events.map(e => e.category))];
                return `
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-gray-900">Discover Events</h1>
                            <p class="text-gray-600 mt-1">Find and book amazing experiences near you.</p>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-6">
                            <button onclick="UI.filterEvents('all')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white transition-colors" data-category="all">All Events</button>
                            ${categories.map(cat => `
                                <button onclick="UI.filterEvents('${cat}')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" data-category="${cat}">${cat}</button>
                            `).join('')}
                        </div>

                        <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${Store.events.filter(e => e.status === 'active').map(event => `
                                <div class="event-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group" data-category="${event.category}">
                                    <div class="relative h-48 overflow-hidden">
                                        <img src="${event.image}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="${event.title}">
                                        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700">
                                            ${event.category}
                                        </div>
                                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <p class="text-white font-bold text-lg">${Utils.formatCurrency(event.price)}</p>
                                        </div>
                                    </div>
                                    <div class="p-5">
                                        <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-1">${event.title}</h3>
                                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${event.description}</p>
                                        <div class="space-y-2 mb-4">
                                            <div class="flex items-center text-sm text-gray-500">
                                                <i class="far fa-calendar w-5 text-primary-500"></i>
                                                <span>${Utils.formatDate(event.date)}</span>
                                            </div>
                                            <div class="flex items-center text-sm text-gray-500">
                                                <i class="far fa-clock w-5 text-primary-500"></i>
                                                <span>${Utils.formatTime(event.time)}</span>
                                            </div>
                                            <div class="flex items-center text-sm text-gray-500">
                                                <i class="fas fa-map-marker-alt w-5 text-primary-500"></i>
                                                <span class="line-clamp-1">${event.location}</span>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div class="text-xs text-gray-500">
                                                <span class="font-semibold text-gray-700">${event.capacity - event.booked}</span> spots left
                                            </div>
                                            <button onclick="Router.navigate('event-detail', {eventId: ${event.id}})" class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },

            EventDetail: (eventId) => {
                const event = Utils.getEventById(eventId);
                if (!event) return Router.navigate('events');
                
                const isAdmin = Store.currentUser?.role === 'admin';
                const availableSpots = event.capacity - event.booked;
                
                return `
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <button onclick="Router.navigate('events')" class="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Events
                        </button>
                        
                        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div class="relative h-64 md:h-96">
                                <img src="${event.image}" class="w-full h-full object-cover" alt="${event.title}">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                    <span class="inline-block px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium mb-3">${event.category}</span>
                                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${event.title}</h1>
                                    <div class="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                        <span><i class="far fa-calendar mr-1"></i> ${Utils.formatDate(event.date)}</span>
                                        <span><i class="far fa-clock mr-1"></i> ${Utils.formatTime(event.time)}</span>
                                        <span><i class="fas fa-map-marker-alt mr-1"></i> ${event.location}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="p-6 md:p-10">
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div class="lg:col-span-2">
                                        <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                                        <p class="text-gray-600 leading-relaxed mb-6">${event.description}</p>
                                        
                                        <div class="bg-gray-50 rounded-xl p-6 mb-6">
                                            <h3 class="font-bold text-gray-900 mb-3">Event Details</h3>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                        <i class="fas fa-user-tie text-primary-600"></i>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-gray-500">Organizer</p>
                                                        <p class="font-medium text-gray-900">${event.organizer}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                        <i class="fas fa-users text-primary-600"></i>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-gray-500">Capacity</p>
                                                        <p class="font-medium text-gray-900">${event.capacity.toLocaleString()} people</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                        <i class="fas fa-check-circle text-primary-600"></i>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-gray-500">Booked</p>
                                                        <p class="font-medium text-gray-900">${event.booked.toLocaleString()} tickets</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                        <i class="fas fa-door-open text-primary-600"></i>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-gray-500">Available</p>
                                                        <p class="font-medium ${availableSpots < 100 ? 'text-red-600' : 'text-green-600'}">${availableSpots.toLocaleString()} spots left</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div class="bg-gray-50 rounded-xl p-6 sticky top-24">
                                            <div class="flex items-center justify-between mb-4">
                                                <span class="text-gray-600">Price per ticket</span>
                                                <span class="text-3xl font-bold text-gray-900">${Utils.formatCurrency(event.price)}</span>
                                            </div>
                                            
                                            ${isAdmin ? `
                                                <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p class="text-sm text-blue-800 font-medium"><i class="fas fa-info-circle mr-2"></i>Admin View</p>
                                                </div>
                                                <button onclick="Router.navigate('admin')" class="w-full py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                                                    Manage in Admin Panel
                                                </button>
                                            ` : `
                                                <div class="mb-6">
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                                    <div class="flex items-center gap-3">
                                                        <button onclick="UI.updateQuantity(-1)" class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                            <i class="fas fa-minus text-gray-600"></i>
                                                        </button>
                                                        <input type="number" id="ticket-quantity" value="1" min="1" max="${availableSpots}" readonly class="w-20 text-center py-2 border border-gray-300 rounded-lg font-bold text-lg">
                                                        <button onclick="UI.updateQuantity(1)" class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                            <i class="fas fa-plus text-gray-600"></i>
                                                        </button>
                                                    </div>
                                                    <p class="text-xs text-gray-500 mt-2">Max ${availableSpots} tickets available</p>
                                                </div>
                                                
                                                <div class="border-t border-gray-200 pt-4 mb-6">
                                                    <div class="flex justify-between mb-2">
                                                        <span class="text-gray-600">Subtotal</span>
                                                        <span id="subtotal" class="font-medium">${Utils.formatCurrency(event.price)}</span>
                                                    </div>
                                                    <div class="flex justify-between mb-2">
                                                        <span class="text-gray-600">Service Fee</span>
                                                        <span class="font-medium">${Utils.formatCurrency(event.price * 0.05)}</span>
                                                    </div>
                                                    <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                                        <span>Total</span>
                                                        <span id="total-price">${Utils.formatCurrency(event.price * 1.05)}</span>
                                                    </div>
                                                </div>
                                                
                                                <button onclick="UI.initiateBooking(${event.id})" class="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                                    <i class="fas fa-lock"></i> Proceed to Payment
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            PaymentModal: (eventId, quantity) => {
                const event = Utils.getEventById(eventId);
                const subtotal = event.price * quantity;
                const serviceFee = subtotal * 0.05;
                const total = subtotal + serviceFee;
                
                return `
                    <div id="payment-modal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="UI.closePaymentModal()"></div>
                            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div class="sm:flex sm:items-start">
                                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <i class="fas fa-credit-card text-primary-600"></i>
                                        </div>
                                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Complete Payment</h3>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500 mb-4">You are booking <strong>${quantity}</strong> ticket(s) for <strong>${event.title}</strong></p>
                                                
                                                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                                    <div class="flex justify-between mb-2 text-sm">
                                                        <span class="text-gray-600">Tickets (${quantity} x ${Utils.formatCurrency(event.price)})</span>
                                                        <span class="font-medium">${Utils.formatCurrency(subtotal)}</span>
                                                    </div>
                                                    <div class="flex justify-between mb-2 text-sm">
                                                        <span class="text-gray-600">Service Fee (5%)</span>
                                                        <span class="font-medium">${Utils.formatCurrency(serviceFee)}</span>
                                                    </div>
                                                    <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                                                        <span>Total</span>
                                                        <span id="modal-total">${Utils.formatCurrency(total)}</span>
                                                    </div>
                                                </div>

                                                <!-- Payment Method Selection -->
                                                <div class="mb-4">
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                                                    <div class="grid grid-cols-3 gap-3">
                                                        <button type="button" onclick="UI.selectPaymentMethod('card')" id="method-card" class="payment-method-card active flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl hover:border-primary-300">
                                                            <i class="far fa-credit-card text-2xl mb-2 text-primary-600"></i>
                                                            <span class="text-xs font-medium text-gray-700">Card</span>
                                                        </button>
                                                        <button type="button" onclick="UI.selectPaymentMethod('paypal')" id="method-paypal" class="payment-method-card flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl hover:border-paypal-300">
                                                            <i class="fab fa-paypal text-2xl mb-2 text-paypal-600"></i>
                                                            <span class="text-xs font-medium text-gray-700">PayPal</span>
                                                        </button>
                                                        <button type="button" onclick="UI.selectPaymentMethod('mpesa')" id="method-mpesa" class="payment-method-card flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl hover:border-mpesa-300">
                                                            <i class="fas fa-mobile-alt text-2xl mb-2 text-mpesa-600"></i>
                                                            <span class="text-xs font-medium text-gray-700">M-Pesa</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <form id="payment-form" onsubmit="event.preventDefault(); UI.processPayment(${event.id}, ${quantity}, ${total});">
                                                    
                                                    <!-- Card Payment Form -->
                                                    <div id="form-card" class="space-y-4">
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                                            <div class="relative">
                                                                <input type="text" id="card-number" placeholder="4242 4242 4242 4242" maxlength="19" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" oninput="UI.formatCardNumber(this)">
                                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <i class="far fa-credit-card text-gray-400"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" oninput="UI.formatExpiry(this)">
                                                            </div>
                                                            <div>
                                                                <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                                                <input type="text" id="card-cvc" placeholder="123" maxlength="3" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                                                            <input type="text" id="card-name" placeholder="John Doe" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                                        </div>
                                                    </div>

                                                    <!-- PayPal Form -->
                                                    <div id="form-paypal" class="space-y-4 hidden">
                                                        <div class="bg-paypal-50 border border-paypal-200 rounded-lg p-4 text-center">
                                                            <i class="fab fa-paypal text-4xl text-paypal-600 mb-3"></i>
                                                            <p class="text-sm text-gray-700 mb-2">You will be redirected to PayPal to complete your payment securely.</p>
                                                            <p class="text-xs text-gray-500">Amount to pay: <span class="font-bold text-paypal-700">${Utils.formatCurrency(total)}</span></p>
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                                                            <input type="email" id="paypal-email" placeholder="your@email.com" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-paypal-500 focus:border-paypal-500 sm:text-sm">
                                                        </div>
                                                    </div>

                                                    <!-- M-Pesa Form -->
                                                    <div id="form-mpesa" class="space-y-4 hidden">
                                                        <div class="bg-mpesa-50 border border-mpesa-200 rounded-lg p-4">
                                                            <div class="flex items-center gap-3 mb-3">
                                                                <i class="fas fa-mobile-alt text-2xl text-mpesa-600"></i>
                                                                <div>
                                                                    <p class="text-sm font-bold text-gray-900">M-Pesa Payment</p>
                                                                    <p class="text-xs text-gray-600">Safaricom Kenya</p>
                                                                </div>
                                                            </div>
                                                            <div class="text-xs text-gray-600 space-y-1">
                                                                <p>Paying to: <strong>0769323786</strong></p>
                                                                <p>Account name: <strong>${Store.currentUser ? Store.currentUser.name : 'Account holder'}</strong></p>
                                                                <p>1. Enter your M-Pesa registered phone number</p>
                                                                <p>2. You will receive an STK push on your phone</p>
                                                                <p>3. Enter your M-Pesa PIN to confirm</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                                                            <div class="relative">
                                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span class="text-gray-500 text-sm font-medium">+254</span>
                                                                </div>
                                                                <input type="tel" id="mpesa-phone" placeholder="712345678" maxlength="9" class="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-mpesa-500 focus:border-mpesa-500 sm:text-sm" oninput="this.value = this.value.replace(/\\D/g, '')">
                                                            </div>
                                                            <p class="text-xs text-gray-500 mt-1">Enter number without country code (e.g., 712345678)</p>
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium text-gray-700 mb-1">Account Reference</label>
                                                            <input type="text" id="mpesa-reference" value="EVENT-${eventId}" readonly class="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm">
                                                        </div>
                                                    </div>

                                                    <div class="mt-6 flex gap-3">
                                                        <button type="button" onclick="UI.closePaymentModal()" class="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                                                        <button type="submit" id="pay-button" class="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                                            <span id="pay-button-text">Pay ${Utils.formatCurrency(total)}</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            TicketDetail: (ticketId) => {
                const ticket = Store.tickets.find(t => t.id === ticketId);
                if (!ticket) return Router.navigate('dashboard');
                const event = Utils.getEventById(ticket.eventId);
                
                const paymentMethodLabels = {
                    card: { label: 'Credit/Debit Card', icon: 'fa-credit-card', color: 'text-blue-600', bg: 'bg-blue-50' },
                    paypal: { label: 'PayPal', icon: 'fa-paypal', color: 'text-orange-600', bg: 'bg-orange-50' },
                    mpesa: { label: 'M-Pesa', icon: 'fa-mobile-alt', color: 'text-green-600', bg: 'bg-green-50' }
                };
                const pm = paymentMethodLabels[ticket.paymentMethod] || paymentMethodLabels.card;
                
                return `
                    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <button onclick="Router.navigate('dashboard')" class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Dashboard
                        </button>
                        
                        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div class="bg-primary-600 p-6 text-white">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-primary-100 text-sm font-medium mb-1">TICKET CONFIRMATION</p>
                                        <h1 class="text-2xl font-bold">${event.title}</h1>
                                    </div>
                                    <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                                        <i class="fas fa-check text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="p-6 md:p-8">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                                        <p class="text-gray-900 font-medium">${Utils.formatDate(event.date)}</p>
                                        <p class="text-gray-600">${Utils.formatTime(event.time)}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                                        <p class="text-gray-900 font-medium">${event.location}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ticket Holder</p>
                                        <p class="text-gray-900 font-medium">${Store.currentUser.name}</p>
                                        <p class="text-gray-600 text-sm">${Store.currentUser.email}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantity</p>
                                        <p class="text-gray-900 font-medium">${ticket.quantity} ticket(s)</p>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 ${pm.bg} rounded-lg flex items-center justify-center">
                                            <i class="fas ${pm.icon} ${pm.color}"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs text-gray-500">Payment Method</p>
                                            <p class="text-sm font-medium text-gray-900">${pm.label}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs text-gray-500">Transaction ID</p>
                                        <p class="text-sm font-mono text-gray-900">${ticket.qrCode}</p>
                                    </div>
                                </div>

                                ${ticket.paymentMethod === 'mpesa' ? `
                                    <div class="border border-green-200 bg-green-50 rounded-xl p-4 mb-6">
                                        <p class="text-xs text-green-700 uppercase tracking-wider font-semibold mb-2">M-Pesa Payment Details</p>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Paid to</span>
                                            <span class="font-medium text-gray-900">${ticket.paymentRecipient || '0769323786'}</span>
                                        </div>
                                        <div class="flex justify-between text-sm mt-1">
                                            <span class="text-gray-600">Account name</span>
                                            <span class="font-medium text-gray-900">${ticket.paymentRecipientName || Store.currentUser.name}</span>
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="border-t-2 border-dashed border-gray-200 pt-8 mb-8 ticket-pattern">
                                    <div class="bg-white p-6 rounded-xl border-2 border-gray-100">
                                        <div class="flex items-center justify-between mb-4">
                                            <div>
                                                <p class="text-xs text-gray-500 mb-1">Ticket ID</p>
                                                <p class="text-lg font-bold text-gray-900 font-mono">${ticket.id}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs text-gray-500 mb-1">Total Paid</p>
                                                <p class="text-lg font-bold text-primary-600">${Utils.formatCurrency(ticket.totalPrice)}</p>
                                            </div>
                                        </div>
                                        <div class="barcode rounded mb-2"></div>
                                        <p class="text-center text-xs text-gray-400 font-mono">${ticket.qrCode}</p>
                                    </div>
                                </div>
                                
                                <div class="flex gap-4">
                                    <button onclick="window.print()" class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                        <i class="fas fa-print"></i> Print Ticket
                                    </button>
                                    <button onclick="Utils.showToast('Ticket downloaded!', 'success')" class="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                        <i class="fas fa-download"></i> Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            AdminDashboard: () => {
                const totalEvents = Store.events.length;
                const totalBookings = Store.bookings.length;
                const totalRevenue = Store.tickets.reduce((sum, t) => sum + t.totalPrice, 0);
                const totalUsers = Store.users.filter(u => u.role === 'user').length;
                
                // Payment method breakdown
                const paymentBreakdown = {
                    card: Store.tickets.filter(t => t.paymentMethod === 'card').length,
                    paypal: Store.tickets.filter(t => t.paymentMethod === 'paypal').length,
                    mpesa: Store.tickets.filter(t => t.paymentMethod === 'mpesa').length
                };
                
                return `
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p class="text-gray-600 mt-1">Manage events and monitor bookings.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Total Events</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${totalEvents}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-calendar-alt text-blue-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Total Bookings</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${totalBookings}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-ticket-alt text-green-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Revenue</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${Utils.formatCurrency(totalRevenue)}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-dollar-sign text-purple-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600">Users</p>
                                        <p class="text-3xl font-bold text-gray-900 mt-1">${totalUsers}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-users text-orange-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Methods Breakdown -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                            <h3 class="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <i class="far fa-credit-card text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${paymentBreakdown.card}</p>
                                        <p class="text-sm text-gray-600">Card Payments</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <i class="fab fa-paypal text-orange-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${paymentBreakdown.paypal}</p>
                                        <p class="text-sm text-gray-600">PayPal Payments</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                                    <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <i class="fas fa-mobile-alt text-green-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold text-gray-900">${paymentBreakdown.mpesa}</p>
                                        <p class="text-sm text-gray-600">M-Pesa Payments</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-bold text-gray-900">My Events</h2>
                            <button onclick="Router.navigate('create-event')" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                                <i class="fas fa-plus"></i> Create Event
                            </button>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${Store.events.map(event => {
                                            const bookings = Utils.getEventBookings(event.id);
                                            const percentFilled = (event.booked / event.capacity * 100).toFixed(1);
                                            return `
                                                <tr class="hover:bg-gray-50 transition-colors">
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <img class="h-10 w-10 rounded-lg object-cover" src="${event.image}" loading="lazy" decoding="async" alt="">
                                                            <div class="ml-4">
                                                                <div class="text-sm font-medium text-gray-900">${event.title}</div>
                                                                <div class="text-sm text-gray-500">${event.location}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm text-gray-900">${Utils.formatDate(event.date)}</div>
                                                        <div class="text-sm text-gray-500">${Utils.formatTime(event.time)}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="text-sm font-medium text-gray-900">${Utils.formatCurrency(event.price)}</span>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="text-sm text-gray-900">${event.capacity.toLocaleString()}</span>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                                <div class="bg-primary-600 h-2 rounded-full" style="width: ${Math.min(percentFilled, 100)}%"></div>
                                                            </div>
                                                            <span class="text-sm text-gray-900">${event.booked}</span>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                            ${event.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onclick="UI.viewEventBookings(${event.id})" class="text-primary-600 hover:text-primary-900 mr-3">View Bookings</button>
                                                        <button onclick="UI.deleteEvent(${event.id})" class="text-red-600 hover:text-red-900">Delete</button>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            },

            CreateEvent: () => `
                <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                    <button onclick="Router.navigate('admin')" class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Dashboard
                    </button>
                    
                    <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div class="mb-6">
                            <h1 class="text-2xl font-bold text-gray-900">Create New Event</h1>
                            <p class="text-gray-600 mt-1">Fill in the details to publish your event.</p>
                        </div>

                        <form onsubmit="event.preventDefault(); UI.handleCreateEvent();" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input type="text" id="event-title" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g., Summer Music Festival">
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select id="event-category" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                        <option>Music</option>
                                        <option>Technology</option>
                                        <option>Food & Drink</option>
                                        <option>Sports</option>
                                        <option>Arts</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" id="event-price" required min="0" step="0.01" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="0.00">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" id="event-date" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input type="time" id="event-time" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" id="event-location" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Venue address">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input type="number" id="event-capacity" required min="1" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Maximum attendees">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="event-description" required rows="4" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Describe your event..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="url" id="event-image" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="https://example.com/image.jpg">
                                <p class="text-xs text-gray-500 mt-1">Leave empty for a default image</p>
                            </div>

                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="Router.navigate('admin')" class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" class="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            `,

            EventBookings: (eventId) => {
                const event = Utils.getEventById(eventId);
                const bookings = Utils.getEventBookings(event.id);
                
                return `
                    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
                        <button onclick="Router.navigate('admin')" class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Dashboard
                        </button>
                        
                        <div class="mb-6">
                            <h1 class="text-3xl font-bold text-gray-900">Bookings: ${event.title}</h1>
                            <p class="text-gray-600 mt-1">${Utils.formatDate(event.date)} | ${event.location}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p class="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">${bookings.length}</p>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p class="text-sm font-medium text-gray-600">Tickets Sold</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">${bookings.reduce((sum, b) => sum + b.quantity, 0)}</p>
                            </div>
                            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <p class="text-sm font-medium text-gray-600">Occupancy</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">${((event.booked / event.capacity) * 100).toFixed(1)}%</p>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${bookings.length === 0 ? `
                                            <tr>
                                                <td colspan="5" class="px-6 py-8 text-center text-gray-500">No bookings yet for this event.</td>
                                            </tr>
                                        ` : bookings.map(booking => {
                                            const user = Utils.getUserById(booking.userId);
                                            return `
                                                <tr>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="flex items-center">
                                                            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                ${user.name.charAt(0)}
                                                            </div>
                                                            <div class="ml-3">
                                                                <div class="text-sm font-medium text-gray-900">${user.name}</div>
                                                                <div class="text-sm text-gray-500">${user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.quantity}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.date}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            ${booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            }
        };
