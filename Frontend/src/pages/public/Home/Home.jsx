import { NavLink, Outlet } from 'react-router-dom';
import './Home.scss';
import { SideBar, Discuss } from '~/components';
import { path } from '~/utils/constant';

const tabs = [
    { id: 'for-you', label: 'For you', to: `/${path.FOR_YOU}` },
    { id: 'top', label: 'Top', to: `/${path.TOP}` },
    { id: 'latest', label: 'Latest', to: `/${path.LATEST}` },
];

const Home = () => {
    return (
        <div className="home">
            <div className="home__sidebar">
                <div className="sidebar-container">
                    <SideBar />
                </div>
            </div>
            <div className="home__content">
                <nav className="home__navigation">
                    {tabs.map(({ id, label, to }) => (
                        <NavLink
                            key={id}
                            to={to}
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? 'home__nav-item home__nav-item--active'
                                    : 'home__nav-item'
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <Outlet />
            </div>
            <div className="home__outstanding">
                <Discuss />
            </div>
        </div>
    );
};

export default Home;
