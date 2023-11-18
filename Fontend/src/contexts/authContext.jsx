import { createContext, useEffect, useState } from 'react';
import { apiGetCurrentUser } from '~/apiServices';

export const AuthContext = createContext({
    isLoggedIn: false,
    accessToken: null,
    user: null,
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        accessToken: null,
        user: null,
    });

    useEffect(() => {
        (async () => {
            const accessToken = JSON.parse(
                localStorage.getItem('dev:ACCESS_TOKEN') && localStorage.getItem('dev:ACCESS_TOKEN'),
            );
            if (!accessToken) {
                return setAuth({ isLoggedIn: false, accessToken: null, user: null });
            } else setAuth({ isLoggedIn: true, accessToken: accessToken, user: null });
            try {
                const response = await apiGetCurrentUser();
                if (response.status === 'success') setAuth({ isLoggedIn: true, accessToken, user: response?.userData });
                else setAuth({ isLoggedIn: false, accessToken: null, user: null });
            } catch {
                setAuth({ isLoggedIn: false, accessToken: null, user: null });
            }
        })();
    }, []);

    const signIn = (newAccessToken, user) => {
        localStorage.setItem('dev:ACCESS_TOKEN', JSON.stringify(newAccessToken));
        setAuth({ isLoggedIn: true, accessToken: newAccessToken, user });
    };

    const signOut = () => {
        localStorage.removeItem('dev:ACCESS_TOKEN');
        setAuth({ isLoggedIn: false, accessToken: null, user: null });
    };

    return <AuthContext.Provider value={{ ...auth, signIn, signOut }}>{children}</AuthContext.Provider>;
};
