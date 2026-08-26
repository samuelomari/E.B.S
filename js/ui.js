        const UI = {
            currentPaymentMethod: 'card',

            toggleDarkMode: () => {
                const enabled = document.body.classList.toggle('dark-mode');
                localStorage.setItem('eventbooking-theme', enabled ? 'dark' : 'light');
                UI.updateThemeToggle();
            },

            updateThemeToggle: () => {
                const toggle = document.getElementById('theme-toggle');
                if (!toggle) return;
                const darkMode = document.body.classList.contains('dark-mode');
                toggle.innerHTML = `<i class="fas fa-${darkMode ? 'sun' : 'moon'}"></i>`;
                toggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode');
                toggle.title = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
            },

            init: async () => {
                if (localStorage.getItem('eventbooking-theme') === 'dark') document.body.classList.add('dark-mode');
                UI.updateThemeToggle();
                await Auth.restoreSession();
                if (window.firebaseAuthError) {
                    const errorCode = window.firebaseAuthError.code || 'unknown error';
                    Utils.showToast(`Firebase sign-in failed: ${errorCode}`, 'error');
                    window.firebaseAuthError = null;
                }
                if (!Store.currentUser) {
                    document.getElementById('navbar').classList.add('hidden');
                    Router.navigate('login');
                    return;
                }
                document.getElementById('navbar').classList.remove('hidden');
                UI.updateNav();
                Router.navigate('dashboard');
            },

            handleLogin: async () => {
                const result = await Auth.login();
                
                if (result.success) {
                    Utils.showToast('Welcome back, ' + result.user.name + '!', 'success');
                    document.getElementById('navbar').classList.remove('hidden');
                    UI.updateNav();
                    Router.navigate(result.user.role === 'admin' ? 'admin' : 'dashboard');
                } else {
                    Utils.showToast(result.message, 'error');
                }
            },

            updateNav: () => {
                const isAdmin = Store.currentUser?.role === 'admin';
                const navLinks = document.getElementById('nav-links');
                const userInfo = document.getElementById('user-info');
                
                navLinks.innerHTML = isAdmin ? `
                    <button onclick="Router.navigate('admin')" class="nav-link text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</button>
                    <button onclick="Router.navigate('create-event')" class="nav-link text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Create Event</button>
                ` : `
                    <button onclick="Router.navigate('dashboard')" class="nav-link text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</button>
                    <button onclick="Router.navigate('events')" class="nav-link text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Events</button>
                `;
                
                userInfo.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${Store.currentUser.avatar}" class="w-8 h-8 rounded-full border-2 border-gray-200" alt="">
                        <div class="hidden md:block">
                            <p class="text-sm font-medium text-gray-900">${Store.currentUser.name}</p>
                            <p class="text-xs text-gray-500 capitalize">${Store.currentUser.role}</p>
                        </div>
                        <button onclick="Auth.logout()" class="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                `;
            },

            filterEvents: (category) => {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn.dataset.category === category) {
                        btn.className = 'filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all bg-primary-600 text-white';
                    } else {
                        btn.className = 'filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200';
                    }
                });
                
                document.querySelectorAll('.event-card').forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            },

            updateQuantity: (change) => {
                const input = document.getElementById('ticket-quantity');
                const newValue = parseInt(input.value) + change;
                const max = parseInt(input.max);
                if (newValue >= 1 && newValue <= max) {
                    input.value = newValue;
                    UI.updatePrice();
                }
            },

            updatePrice: () => {
                const quantity = parseInt(document.getElementById('ticket-quantity').value);
                const priceText = document.querySelector('.text-3xl.font-bold.text-gray-900').textContent;
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                const subtotal = price * quantity;
                const total = subtotal * 1.05;
                
                document.getElementById('subtotal').textContent = Utils.formatCurrency(subtotal);
                document.getElementById('total-price').textContent = Utils.formatCurrency(total);
            },

            initiateBooking: (eventId) => {
                const quantity = parseInt(document.getElementById('ticket-quantity').value);
                const modal = document.createElement('div');
                modal.innerHTML = Components.PaymentModal(eventId, quantity);
                document.body.appendChild(modal);
                UI.currentPaymentMethod = 'card';
            },

            closePaymentModal: () => {
                const modal = document.getElementById('payment-modal');
                if (modal) modal.remove();
            },

            selectPaymentMethod: (method) => {
                UI.currentPaymentMethod = method;
                
                // Reset all cards
                document.querySelectorAll('.payment-method-card').forEach(card => {
                    card.classList.remove('active', 'mpesa-active', 'paypal-active');
                    card.classList.add('border-gray-200');
                });
                
                // Activate selected
                const selectedBtn = document.getElementById('method-' + method);
                if (method === 'mpesa') {
                    selectedBtn.classList.add('mpesa-active');
                } else if (method === 'paypal') {
                    selectedBtn.classList.add('paypal-active');
                } else {
                    selectedBtn.classList.add('active');
                }
                selectedBtn.classList.remove('border-gray-200');
                
                // Show/hide forms
                document.getElementById('form-card').classList.toggle('hidden', method !== 'card');
                document.getElementById('form-paypal').classList.toggle('hidden', method !== 'paypal');
                document.getElementById('form-mpesa').classList.toggle('hidden', method !== 'mpesa');
                
                // Update button color
                const payBtn = document.getElementById('pay-button');
                const payBtnText = document.getElementById('pay-button-text');
                const total = document.getElementById('modal-total').textContent;
                
                if (method === 'mpesa') {
                    payBtn.className = 'flex-1 py-2 px-4 bg-mpesa-600 text-white rounded-lg text-sm font-medium hover:bg-mpesa-700 transition-colors flex items-center justify-center gap-2';
                    payBtnText.textContent = 'Pay with M-Pesa ' + total;
                } else if (method === 'paypal') {
                    payBtn.className = 'flex-1 py-2 px-4 bg-paypal-600 text-white rounded-lg text-sm font-medium hover:bg-paypal-700 transition-colors flex items-center justify-center gap-2';
                    payBtnText.textContent = 'Pay with PayPal ' + total;
                } else {
                    payBtn.className = 'flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2';
                    payBtnText.textContent = 'Pay ' + total;
                }
            },

            formatCardNumber: (input) => {
                let value = input.value.replace(/\\D/g, '');
                value = value.replace(/(\\d{4})(?=\\d)/g, '$1 ');
                input.value = value;
            },

            formatExpiry: (input) => {
                let value = input.value.replace(/\\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                input.value = value;
            },

            processPayment: async (eventId, quantity, total) => {
                const method = UI.currentPaymentMethod;
                const btn = document.getElementById('pay-button');
                const originalText = document.getElementById('pay-button-text').textContent;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                btn.disabled = true;
                
                let details = {};
                
                // Gather payment details based on method
                if (method === 'card') {
                    details = {
                        cardNumber: document.getElementById('card-number').value,
                        expiry: document.getElementById('card-expiry').value,
                        cvc: document.getElementById('card-cvc').value,
                        name: document.getElementById('card-name').value
                    };
                    if (!details.cardNumber || !details.expiry || !details.cvc || !details.name) {
                        Utils.showToast('Please fill in all card details', 'error');
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        return;
                    }
                } else if (method === 'paypal') {
                    details = {
                        email: document.getElementById('paypal-email').value
                    };
                    if (!details.email) {
                        Utils.showToast('Please enter your PayPal email', 'error');
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        return;
                    }
                } else if (method === 'mpesa') {
                    details = {
                        phone: document.getElementById('mpesa-phone').value,
                        recipientNumber: Payment.mpesaRecipientNumber,
                        recipientName: Store.currentUser ? Store.currentUser.name : 'Account holder'
                    };
                    if (!details.phone || details.phone.length < 9) {
                        Utils.showToast('Please enter a valid M-Pesa phone number', 'error');
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        return;
                    }
                }
                
                const result = await Payment.process(method, total, details);
                
                if (result.success) {
                    const event = Utils.getEventById(eventId);
                    const ticketId = Utils.generateTicketId();
                    const qrCode = result.transactionId;
                    
                    // Update event bookings
                    event.booked += quantity;
                    
                    // Create ticket
                    Store.tickets.push({
                        id: ticketId,
                        userId: Store.currentUser.id,
                        eventId: eventId,
                        quantity: quantity,
                        totalPrice: total,
                        purchaseDate: new Date().toISOString().split('T')[0],
                        status: 'active',
                        qrCode: qrCode,
                        paymentMethod: method,
                        paymentRecipient: method === 'mpesa' ? result.recipientNumber : null,
                        paymentRecipientName: method === 'mpesa' ? result.recipientName : null
                    });
                    
                    // Create booking record
                    Store.bookings.push({
                        id: Store.bookings.length + 1,
                        userId: Store.currentUser.id,
                        eventId: eventId,
                        quantity: quantity,
                        date: new Date().toISOString().split('T')[0],
                        status: 'confirmed'
                    });

                    if (window.firebaseSendPurchaseEmail) {
                        try {
                            await window.firebaseSendPurchaseEmail({
                                eventTitle: event.title,
                                ticketId,
                                quantity,
                                total,
                                paymentMethod: method,
                                purchaseDate: new Date().toISOString().split('T')[0]
                            });
                        } catch (emailError) {
                            console.error('Purchase confirmation email failed:', emailError);
                        }
                    }
                    
                    UI.closePaymentModal();
                    
                    let successMsg = 'Payment successful! ';
                    if (method === 'mpesa') {
                        successMsg += 'Check your phone for M-Pesa confirmation.';
                    } else if (method === 'paypal') {
                        successMsg += 'PayPal payment confirmed.';
                    } else {
                        successMsg += 'Your tickets are ready.';
                    }
                    
                    Utils.showToast(successMsg, 'success');
                    setTimeout(() => Router.navigate('ticket-detail', { ticketId }), 800);
                } else {
                    Utils.showToast(result.message, 'error');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            },

            handleCreateEvent: () => {
                const title = document.getElementById('event-title').value;
                const category = document.getElementById('event-category').value;
                const price = parseFloat(document.getElementById('event-price').value);
                const date = document.getElementById('event-date').value;
                const time = document.getElementById('event-time').value;
                const location = document.getElementById('event-location').value;
                const capacity = parseInt(document.getElementById('event-capacity').value);
                const description = document.getElementById('event-description').value;
                const image = document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60';
                
                const newEvent = {
                    id: Store.events.length + 1,
                    title,
                    description,
                    date,
                    time,
                    location,
                    price,
                    category,
                    image,
                    capacity,
                    booked: 0,
                    organizer: Store.currentUser.name,
                    status: 'active'
                };
                
                Store.events.push(newEvent);
                Utils.showToast('Event created successfully!', 'success');
                Router.navigate('admin');
            },

            viewEventBookings: (eventId) => {
                Router.navigate('event-bookings', { eventId });
            },

            deleteEvent: (eventId) => {
                if (confirm('Are you sure you want to delete this event?')) {
                    Store.events = Store.events.filter(e => e.id !== eventId);
                    Utils.showToast('Event deleted successfully', 'info');
                    Router.navigate('admin');
                }
            }
        };
