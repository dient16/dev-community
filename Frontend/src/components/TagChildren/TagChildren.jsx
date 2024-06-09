import { useState } from 'react';
import './TagChildren.scss';
import icons from '~/utils/icons';
import { hexToRgba } from '~/utils/helper';

const { LuHash } = icons;

const TagChildren = ({ tagName, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    const tagStyle = {
        border: `1px solid ${hexToRgba(color, 0.7)}`,
        background: isHovered ? hexToRgba(color, 0.12) : hexToRgba(color, 0.03),
        cursor: 'pointer',
        transition: 'opacity 0.3s ease',
    };
    const handleClickTag = (e) => {
        e.stopPropagation();
    };
    return (
        <div
            className="tag-children"
            style={tagStyle}
            onClick={(e) => handleClickTag(e)}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="tag-children__icon">
                <LuHash color={color} />
            </div>
            <span className="tag-children__name">{tagName}</span>
        </div>
    );
};

export default TagChildren;
