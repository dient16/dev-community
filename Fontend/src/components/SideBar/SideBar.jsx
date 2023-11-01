import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebar } from '~/utils/constant';
import './SideBar.scss';
import { MyTags } from '~/components';
const SideBar = () => {
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
                        <span className="sidebar__title">{el.value}</span>
                    </NavLink>
                ))}
            </div>
            <div className="sidebar__my-tags">
                <MyTags />
            </div>
        </div>
    );
};

export default SideBar;
