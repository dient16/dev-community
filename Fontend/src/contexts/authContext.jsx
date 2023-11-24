import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
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
    const { data, isError, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: apiGetCurrentUser,
        enabled: !!localStorage.getItem('dev:ACCESS_TOKEN'),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data?.status == 'success' && !isError && !!localStorage.getItem('dev:ACCESS_TOKEN')) {
            const token = JSON.parse(localStorage.getItem('dev:ACCESS_TOKEN'));
            setAuth({ isLoggedIn: true, accessToken: token, user: data?.userData });
        } else {
            setAuth({ isLoggedIn: false, accessToken: null, user: null });
        }
    }, [data, isError, auth.accessToken]);
    const signIn = (newAccessToken, user) => {
        localStorage.setItem('dev:ACCESS_TOKEN', JSON.stringify(newAccessToken));
        setAuth({ isLoggedIn: true, accessToken: newAccessToken, user });
    };

    const signOut = () => {
        localStorage.removeItem('dev:ACCESS_TOKEN');
        setAuth({ isLoggedIn: false, accessToken: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, signIn, signOut }}>
            <Spin spinning={isLoading} fullscreen={isLoading}>
                {children}
            </Spin>
        </AuthContext.Provider>
    );
};
