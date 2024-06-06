import { Outlet, useNavigate } from 'react-router-dom';
import './Home.scss';
import { SideBar, Discuss } from '~/components';
import { path } from '~/utils/constant';
import { scrollIntoView } from '~/utils/helper';

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
                    <span
                        onClick={() => {
                            navigate(`/${path.FOR_YOU}`);
                            scrollIntoView(500);
                        }}
                    >
                        For you
                    </span>
                    <span
                        onClick={() => {
                            navigate(`/${path.TOP}`);
                            scrollIntoView(500);
                        }}
                    >
                        Top
                    </span>
                    <span
                        onClick={() => {
                            navigate(`/${path.LATEST}`);
                            scrollIntoView(500);
                        }}
                    >
                        Latest
                    </span>
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
