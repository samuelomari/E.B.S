        const Router = {
            currentRoute: 'login',
            params: {},
            
            navigate: (route, params = {}) => {
                Router.currentRoute = route;
                Router.params = params;
                const app = document.getElementById('app');
                
                switch(route) {
                    case 'login':
                        app.innerHTML = Components.Login();
                        break;
                    case 'dashboard':
                        if (!Store.currentUser || Store.currentUser.role !== 'user') {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.UserDashboard();
                        break;
                    case 'events':
                        if (!Store.currentUser) {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.Events();
                        break;
                    case 'event-detail':
                        if (!Store.currentUser) {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.EventDetail(params.eventId);
                        break;
                    case 'ticket-detail':
                        if (!Store.currentUser) {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.TicketDetail(params.ticketId);
                        break;
                    case 'admin':
                        if (!Store.currentUser || Store.currentUser.role !== 'admin') {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.AdminDashboard();
                        break;
                    case 'create-event':
                        if (!Store.currentUser || Store.currentUser.role !== 'admin') {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.CreateEvent();
                        break;
                    case 'event-bookings':
                        if (!Store.currentUser || Store.currentUser.role !== 'admin') {
                            Router.navigate('login');
                            return;
                        }
                        app.innerHTML = Components.EventBookings(params.eventId);
                        break;
                    default:
                        app.innerHTML = Components.Login();
                }
                
                app.classList.remove('route-enter');
                void app.offsetWidth;
                app.classList.add('route-enter');
                window.scrollTo(0, 0);
            }
        };
