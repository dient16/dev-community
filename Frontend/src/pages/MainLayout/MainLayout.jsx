import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '~/components';
import './MainLayout.scss';
const DefaultLayout = () => {
    return (
        <div className="default-layout">
            <Header />
            <div className="default-layout__container">
                <Outlet />
            </div>
        </div>
    );
};

export default DefaultLayout;
