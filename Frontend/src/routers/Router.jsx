import { Route, Routes } from 'react-router-dom';
import { EditPost, NewPost, ReadingList, EditProfile, Profile } from '~/pages/user';
import {
   Home,
   Login,
   Register,
   Tags,
   About,
   Faqs,
   PostDetail,
   HomeContent,
   TagDetail,
} from '~/pages/public';
import MainLayout from '~/pages/MainLayout/MainLayout';
import { path } from '~/utils/constant';

const Router = () => {
   return (
      <Routes>
         <Route path={path.ROOT} element={<MainLayout />}>
            <Route path={path.HOME} element={<Home />}>
               <Route path={path.FOR_YOU} element={<HomeContent />} />
               <Route path={path.TOP} element={<HomeContent />} />
               <Route path={path.LATEST} element={<HomeContent />} />
            </Route>
            <Route path={path.TAGS} element={<Tags />}></Route>
            <Route path={path.ABOUT} element={<About />}></Route>
            <Route path={path.FAQS} element={<Faqs />}></Route>
            <Route path={path.READING_LIST} element={<ReadingList />}></Route>
            <Route path={path.PROFILE} element={<Profile />}></Route>
            <Route path={path.NEW_POST} element={<NewPost />}></Route>
            <Route path={path.POST} element={<PostDetail />}></Route>
            <Route path={path.EDIT_POST} element={<EditPost />}></Route>
            <Route path={path.EDIT_PROFILE} element={<EditProfile />}></Route>
            <Route path={path.TAG_DETAIL} element={<TagDetail />}></Route>
         </Route>
         <Route path={path.LOGIN} element={<Login />}></Route>
         <Route path={path.REGISTER} element={<Register />}></Route>
         <Route path={path.ALL} element={<div>404</div>}></Route>
      </Routes>
   );
};

export default Router;
