import React from 'react';
import './Home.scss';
import { SideBar } from '~/components';
const Home = () => {
    return (
        <div className="home">
            <div className="home__sidebar">
                <SideBar />
            </div>
            <div className="home__content"></div>
            <div className="home__outstanding"></div>
        </div>
    );
};

export default Home;
