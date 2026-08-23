import { NavLink } from 'react-router-dom';
import { sidebar } from '~/utils/constant';
import './SideBar.scss';
import { MyTags } from '~/components';
import icons from '~/utils/icons';
import { Flex } from 'antd';
import { useAuth } from '~/hooks';
const SideBar = ({ setOpenSideBar }) => {
   const { FaTwitter, BsFacebook, FaGithub, RiInstagramFill, FaYoutube } = icons;
   const { isLoggedIn, user } = useAuth();

   const socials = [
      { id: 'twitter', label: 'Twitter', href: 'https://twitter.com', icon: <FaTwitter size={19} /> },
      { id: 'facebook', label: 'Facebook', href: 'https://facebook.com', icon: <BsFacebook size={19} /> },
      { id: 'github', label: 'GitHub', href: 'https://github.com', icon: <FaGithub size={19} /> },
      {
         id: 'instagram',
         label: 'Instagram',
         href: 'https://instagram.com',
         icon: <RiInstagramFill size={19} />,
      },
      { id: 'youtube', label: 'YouTube', href: 'https://youtube.com', icon: <FaYoutube size={19} /> },
   ];
   return (
      <div className="sidebar">
         <div className="sidebar__top">
            <div className="sidebar__list">
               {sidebar.map((el) => {
                  if ((isLoggedIn && el.id === 2) || el.id !== 2) {
                     return (
                        <NavLink
                           key={el.id}
                           to={el.path}
                           className={({ isActive }) =>
                              isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
                           }
                           onClick={() => setOpenSideBar && setOpenSideBar(false)}
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
                     );
                  }
               })}
            </div>
            <div className="sidebar__social-network">
               <Flex align="center" gap={4} wrap="wrap">
                  {socials.map(({ id, label, href, icon }) => (
                     <a
                        key={id}
                        className="icon"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                     >
                        {icon}
                     </a>
                  ))}
               </Flex>
            </div>
         </div>
         <div className="sidebar__my-tags">
            <MyTags setOpenSideBar={setOpenSideBar} />
         </div>
      </div>
   );
};

export default SideBar;
