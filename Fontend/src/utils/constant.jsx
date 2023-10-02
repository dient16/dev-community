import icons from './icons';
import path from './path';
const { RiHome4Fill, LuClipboardList, BsTag, BsLightbulb, BsInfoCircle } = icons;

const sidebar = [
    {
        id: 1,
        value: 'Home',
        path: path.HOME,
        icon: <RiHome4Fill />,
    },
    {
        id: 2,
        value: 'Reading list',
        path: path.READING_LIST,
        icon: <LuClipboardList />,
    },
    {
        id: 3,
        value: 'Tags',
        path: path.TAGS,
        icon: <BsTag />,
    },
    {
        id: 4,
        value: 'Faqs',
        path: path.FAQS,
        icon: <BsLightbulb />,
    },
    {
        id: 5,
        value: 'About',
        path: path.ABOUT,
        icon: <BsInfoCircle />,
    },
];

export default sidebar;
