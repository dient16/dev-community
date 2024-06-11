import { useNavigate } from 'react-router-dom';
import './TagSideBar.scss';
import icons from '~/utils/icons';
import { useeWindowSize } from '~/hooks';

const { LuHash } = icons;

const TagSideBar = ({ tagId, tagName, color, postCount = 0, setOpenSideBar }) => {
   const navigate = useNavigate();
   const { width } = useeWindowSize();
   const isMobile = width <= 768;

   const handleClickTag = (e) => {
      e.stopPropagation();
      navigate(`/tags/${tagId}`);
      if (isMobile) {
         setOpenSideBar(false);
      }
   };
   return (
      <div className="tag-sidebar" onClick={(e) => handleClickTag(e)}>
         <div className="tag-sidebar__wrapper">
            <div className="tag-sidebar__icon">
               <LuHash color={color} />
            </div>
            <span className="tag-sidebar__name">{tagName}</span>
         </div>
         <div className="tag-sidebar__post-count">
            <span>{postCount}</span>
            <span>posts</span>
         </div>
      </div>
   );
};

export default TagSideBar;
