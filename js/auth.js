        const Auth = {
            login: async () => {
                if (!window.firebaseSignInWithGoogle) {
                    return { success: false, message: 'Firebase Authentication is still loading. Please try again.' };
                }

                try {
                    const result = await window.firebaseSignInWithGoogle();
                    const firebaseUser = result.user;
                    const email = (firebaseUser.email || '').toLowerCase();

                    if (firebaseUser.emailVerified === false || !email.endsWith('@gmail.com')) {
                        await window.firebaseSignOut();
                        return { success: false, message: 'Only verified Gmail accounts can access this application.' };
                    }

                    Store.currentUser = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || email.split('@')[0],
                        email,
                        role: email === 'samuelomari3941@gmail.com' ? 'admin' : 'user',
                        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || email)}`
                    };
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
                        return { success: false, message: 'Sign-in was cancelled.' };
                    }
                    if (error.code === 'auth/unauthorized-domain') {
                        return { success: false, message: `Add ${window.location.hostname} to Firebase Authorized domains before signing in.` };
                    }
                    return { success: false, message: `Google sign-in failed (${error.code || 'unknown error'}).` };
                }
            },
            restoreSession: async () => {
                const firebaseUser = await window.firebaseAuthReady;
                if (!firebaseUser) return null;

                const email = (firebaseUser.email || '').toLowerCase();
                if (firebaseUser.emailVerified === false || !email.endsWith('@gmail.com')) {
                    await window.firebaseSignOut();
                    return null;
                }

                Store.currentUser = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || email.split('@')[0],
                    email,
                    role: email === 'samuelomari3941@gmail.com' ? 'admin' : 'user',
                    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || email)}`
                };
                return Store.currentUser;
            },
            logout: async () => {
                await window.firebaseSignOut();
                Store.currentUser = null;
                Router.navigate('login');
            }
        };

