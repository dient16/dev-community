import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { EditPost, NewPost, Profile, ReadingList } from '~/pages/user';
import { Home, Login, Register, Tags, About, Faqs, Post } from '~/pages/public';
import MainLayout from '~/pages/MainLayout/MainLayout';
import path from '~/utils/path';

const Router = () => {
    return (
        <Routes>
            <Route path={path.ROOT} element={<MainLayout />}>
                <Route path={path.HOME} element={<Home />}></Route>
                <Route path={path.TAGS} element={<Tags />}></Route>
                <Route path={path.ABOUT} element={<About />}></Route>
                <Route path={path.FAQS} element={<Faqs />}></Route>
                <Route path={path.READING_LIST} element={<ReadingList />}></Route>
                <Route path={path.PROFILE} element={<Profile />}></Route>
                <Route path={path.NEW_POST} element={<NewPost />}></Route>
                <Route path={path.POST} element={<Post />}></Route>
                <Route path={path.EDIT_POST} element={<EditPost />}></Route>
            </Route>
            <Route path={path.LOGIN} element={<Login />}></Route>
            <Route path={path.REGISTER} element={<Register />}></Route>
        </Routes>
    );
};

export default Router;
