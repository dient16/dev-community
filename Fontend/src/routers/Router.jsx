import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ReadingList } from '~/pages/private';
import { DefaultLayout, Home, Login, Register, Tags } from '~/pages/public';
import path from '~/utils/path';

const Router = () => {
    return (
        <Routes>
            <Route path={path.PUBLIC} element={<DefaultLayout />}>
                <Route path={path.HOME} element={<Home />}></Route>
                <Route path={path.LOGIN} element={<Login />}></Route>
                <Route path={path.REGISTER} element={<Register />}></Route>
                <Route path={path.TAGS} element={<Tags />}></Route>
                <Route path={path.READING_LIST} element={<ReadingList />}></Route>
            </Route>
        </Routes>
    );
};

export default Router;
