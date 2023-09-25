import React from 'react';
import { NavLink } from 'react-router-dom';
import sidebar from '~/utils/constant';
import './SideBar.scss';
const SideBar = () => {
    return (
        <div className="sidebar">
            {sidebar.map((el) => (
                <NavLink
                    key={el.id}
                    to={el.path}
                    className={({ isActive }) => (isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item')}
                >
                    <span className="sidebar__icon">{el.icon}</span>
                    <span className="sidebar__title">{el.value}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default SideBar;
