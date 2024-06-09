import './TagSideBar.scss';
import icons from '~/utils/icons';

const { LuHash } = icons;

const TagSideBar = ({ tagName, color, postCount = 1110 }) => {
    const handleClickTag = (e) => {
        e.stopPropagation();
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
