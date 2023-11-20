import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebar } from '~/utils/constant';
import './SideBar.scss';
import { MyTags } from '~/components';
import icons from '~/utils/icons';
import { Flex } from 'antd';
import { useAuth } from '~/hooks';
const SideBar = () => {
    const { FaTwitter, BsFacebook, FaGithub, RiInstagramFill, FaYoutube } = icons;
    const { user } = useAuth();
    return (
        <div className="sidebar">
            <div className="sidebar__top">
                {sidebar.map((el) => (
                    <NavLink
                        key={el.id}
                        to={el.path}
                        className={({ isActive }) =>
                            isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
                        }
                    >
                        <span className="sidebar__icon">{el.icon}</span>
                        <span className="sidebar__title">
                            {el.id === 2
                                ? user?.bookmarked?.length > 0
                                    ? `${el.value}  (${user?.bookmarked.length})`
                                    : el.value
                                : el.value}
                        </span>
                    </NavLink>
                ))}
            </div>
            <div className="sidebar__social-network">
                <Flex align="center" gap={10}>
                    <span className="icon">
                        <FaTwitter size={20} />
                    </span>
                    <span className="icon">
                        <BsFacebook size={20} />
                    </span>
                    <span className="icon">
                        <FaGithub size={20} />
                    </span>
                    <span className="icon">
                        <RiInstagramFill size={20} />
                    </span>
                    <span className="icon">
                        <FaYoutube size={22} />
                    </span>
                </Flex>
            </div>
            <div className="sidebar__my-tags">
                <MyTags />
            </div>
        </div>
    );
};

export default SideBar;
