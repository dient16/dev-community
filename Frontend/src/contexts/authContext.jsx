import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { createContext, useEffect, useState } from 'react';
import { apiGetCurrentUser } from '~/apiServices';
import HashLoader from 'react-spinners/HashLoader';
export const AuthContext = createContext({
    isLoggedIn: false,
    accessToken: null,
    user: null,
});

export const AuthProvider = ({ children }) => {
    const storedAccessToken = localStorage.getItem('dev:ACCESS_TOKEN')
        ? JSON.parse(localStorage.getItem('dev:ACCESS_TOKEN'))
        : null;

    const [auth, setAuth] = useState({
        isLoggedIn: false,
        accessToken: storedAccessToken,
        user: null,
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: apiGetCurrentUser,
        enabled: !!storedAccessToken,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (data?.status === 'success' && !isError && storedAccessToken) {
            setAuth((prevState) => ({
                ...prevState,
                isLoggedIn: true,
                accessToken: storedAccessToken,
                user: data?.userData,
            }));
        } else {
            setAuth((prevState) => ({
                ...prevState,
                isLoggedIn: false,
                accessToken: null,
                user: null,
            }));
        }
    }, [data, isError, storedAccessToken]);

    const signIn = (newAccessToken, user) => {
        localStorage.setItem('dev:ACCESS_TOKEN', JSON.stringify(newAccessToken));
        setAuth((prevState) => ({ ...prevState, isLoggedIn: true, accessToken: newAccessToken, user }));
    };

    const signOut = () => {
        localStorage.removeItem('dev:ACCESS_TOKEN');
        setAuth((prevState) => ({ ...prevState, isLoggedIn: false, accessToken: null, user: null }));
    };

    return (
        <AuthContext.Provider value={{ ...auth, signIn, signOut }}>
            <Spin spinning={isLoading} indicator={<HashLoader />} fullscreen={isLoading}>
                {children}
            </Spin>
        </AuthContext.Provider>
    );
};
