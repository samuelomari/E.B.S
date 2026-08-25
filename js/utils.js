        const Utils = {
            generateId: () => Math.random().toString(36).substr(2, 9),
            generateTicketId: () => 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            generateQR: () => 'QR-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            generateMpesaCode: () => 'L' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            formatDate: (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
            formatCurrency: (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount),
            formatTime: (timeStr) => {
                const [hours, minutes] = timeStr.split(':');
                const date = new Date();
                date.setHours(hours, minutes);
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            },
            showToast: (message, type = 'success') => {
                const container = document.getElementById('toast-container');
                const toast = document.createElement('div');
                const colors = {
                    success: 'bg-green-50 border-green-400 text-green-800',
                    error: 'bg-red-50 border-red-400 text-red-800',
                    info: 'bg-blue-50 border-blue-400 text-blue-800'
                };
                const icons = {
                    success: 'fa-check-circle',
                    error: 'fa-exclamation-circle',
                    info: 'fa-info-circle'
                };
                toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg fade-in ${colors[type]}`;
                toast.innerHTML = `
                    <i class="fas ${icons[type]} text-lg"></i>
                    <span class="font-medium text-sm">${message}</span>
                    <button onclick="this.parentElement.remove()" class="ml-2 hover:opacity-70">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                container.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
            },
            getEventBookings: (eventId) => Store.bookings.filter(b => b.eventId === eventId),
            getUserTickets: (userId) => Store.tickets.filter(t => t.userId === userId),
            getEventById: (id) => Store.events.find(e => e.id === parseInt(id)),
            getUserById: (id) => Store.users.find(u => u.id === id)
        };

