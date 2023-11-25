import { Outlet, useNavigate } from 'react-router-dom';
import './Home.scss';
import { SideBar, Discuss } from '~/components';
import { path } from '~/utils/constant';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home">
            <div className="home__sidebar">
                <div className="sidebar-container">
                    <SideBar />
                </div>
            </div>
            <div className="home__content">
                <div className="home__navigation">
                    <span onClick={() => navigate(`/${path.FOR_YOU}`)}>For you</span>
                    <span onClick={() => navigate(`/${path.TOP}`)}>Top</span>
                    <span onClick={() => navigate(`/${path.LATEST}`)}>Latest</span>
                </div>
                <Outlet />
            </div>
            <div className="home__outstanding">
                <Discuss />
            </div>
        </div>
    );
};

export default Home;
