import React from 'react';
import { Flex } from 'antd';
import './MenuAccount.scss';
import { Button } from '..';
import { saveToLocalStorage } from '~/utils/helper';
import path from '~/utils/path';

const MenuAccount = ({ user, setOpenMenu }) => {
    const handleSignOut = () => {
        saveToLocalStorage('dev-community', { isLoggedIn: false, token: null, currentUser: null });
    };
    return (
        <div className="menu-account">
            <Flex vertical gap={5}>
                <Button
                    to={`/${user?.username}`}
                    onClick={() => {
                        setOpenMenu(false);
                    }}
                    outline
                    className="menu-account__btn menu-account__user"
                >
                    <div>{`${user.firstname} ${user.lastname}`}</div>
                    <div>{`@${user?.username}`}</div>
                </Button>
                <hr />
                <Button
                    outline
                    className="menu-account__btn"
                    to={`/${path.NEW_POST}`}
                    onClick={() => {
                        setOpenMenu(false);
                    }}
                >
                    Create post
                </Button>
                <Button
                    outline
                    className="menu-account__btn"
                    to={`/${path.READING_LIST}`}
                    onClick={() => {
                        setOpenMenu(false);
                    }}
                >
                    Reading list
                </Button>
                <Button
                    outline
                    className="menu-account__btn"
                    to={`/setting/${user?._id}`}
                    onClick={() => {
                        setOpenMenu(false);
                    }}
                >
                    Setting
                </Button>
                <Button
                    outline
                    className="menu-account__btn"
                    onClick={() => {
                        handleSignOut();
                        setOpenMenu(false);
                    }}
                >
                    Sign out
                </Button>
            </Flex>
        </div>
    );
};

export default MenuAccount;