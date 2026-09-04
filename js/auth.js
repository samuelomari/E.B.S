        const Auth = {
            login: async () => {
                if (!window.firebaseSignInWithGoogle) {
                    return { success: false, message: 'Firebase Authentication is not available. Try Demo Login below.' };
                }

                try {
                    const result = await window.firebaseSignInWithGoogle();
                    const firebaseUser = result ? result.user : null;
                    if (!firebaseUser) {
                        return { success: false, message: 'No user returned from Google sign-in.' };
                    }

                    const email = (firebaseUser.email || '').toLowerCase();
                    if (firebaseUser.emailVerified === false) {
                        if (window.firebaseSignOut) await window.firebaseSignOut();
                        return { success: false, message: 'Your Google account email must be verified.' };
                    }

                    Store.currentUser = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || email.split('@')[0],
                        email,
                        role: email === 'samuelomari3941@gmail.com' ? 'admin' : 'user',
                        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || email)}`
                    };
                    sessionStorage.setItem('eventbooking_user', JSON.stringify(Store.currentUser));

                    if (!localStorage.getItem(`welcome-email-sent-${firebaseUser.uid}`) && window.firebaseSendWelcomeEmail) {
                        try {
                            await window.firebaseSendWelcomeEmail(Store.currentUser.name);
                            localStorage.setItem(`welcome-email-sent-${firebaseUser.uid}`, 'true');
                        } catch (emailError) {
                            console.error('Welcome email failed:', emailError);
                        }
                    }
                    return { success: true, user: Store.currentUser };
                } catch (error) {
                    if (error.code === 'auth/popup-closed-by-user') {
                        return { success: false, message: 'Sign-in popup was closed.' };
                    }
                    if (error.code === 'auth/unauthorized-domain') {
                        return { success: false, message: `Domain '${window.location.hostname}' is not authorized in Firebase Console. You can also use Demo Login below.` };
                    }
                    if (error.code === 'auth/operation-not-allowed') {
                        return { success: false, message: 'Google Sign-In is not enabled in Firebase Console. You can use Demo Login below.' };
                    }
                    return { success: false, message: `Google sign-in failed: ${error.message || error.code || 'unknown error'}` };
                }
            },
            demoLogin: (role = 'user') => {
                const user = Store.users.find(u => u.role === role) || Store.users[0];
                Store.currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                };
                sessionStorage.setItem('eventbooking_user', JSON.stringify(Store.currentUser));
                return { success: true, user: Store.currentUser };
            },
            restoreSession: async () => {
                const savedSession = sessionStorage.getItem('eventbooking_user');
                if (savedSession) {
                    try {
                        Store.currentUser = JSON.parse(savedSession);
                        return Store.currentUser;
                    } catch (e) {
                        sessionStorage.removeItem('eventbooking_user');
                    }
                }

                if (window.firebaseAuthReady) {
                    try {
                        const firebaseUser = await window.firebaseAuthReady;
                        if (!firebaseUser) return null;

                        const email = (firebaseUser.email || '').toLowerCase();
                        if (firebaseUser.emailVerified === false) {
                            if (window.firebaseSignOut) await window.firebaseSignOut();
                            return null;
                        }

                        Store.currentUser = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || email.split('@')[0],
                            email,
                            role: email === 'samuelomari3941@gmail.com' ? 'admin' : 'user',
                            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || email)}`
                        };
                        sessionStorage.setItem('eventbooking_user', JSON.stringify(Store.currentUser));
                        return Store.currentUser;
                    } catch (err) {
                        console.warn('Session restore error:', err);
                        return null;
                    }
                }
                return null;
            },
            logout: async () => {
                if (window.firebaseSignOut) {
                    try {
                        await window.firebaseSignOut();
                    } catch (e) {}
                }
                sessionStorage.removeItem('eventbooking_user');
                Store.currentUser = null;
                Router.navigate('login');
            }
        };

