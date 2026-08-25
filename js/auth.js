        const Auth = {
            login: (email, password) => {
                const user = Store.users.find(u => u.email === email && u.password === password);
                if (user) {
                    Store.currentUser = { ...user, password: undefined };
                    return { success: true, user: Store.currentUser };
                }
                return { success: false, message: 'Invalid email or password' };
            },
            register: (name, email, password) => {
                if (Store.users.find(u => u.email === email)) {
                    return { success: false, message: 'Email already registered' };
                }
                const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    password,
                    role: 'user',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`
                };
                Store.users.push(newUser);
                Store.currentUser = { ...newUser, password: undefined };
                return { success: true, user: Store.currentUser };
            },
            logout: () => {
                Store.currentUser = null;
                Router.navigate('login');
            }
        };

