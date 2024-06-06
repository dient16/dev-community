import icons from './icons';
const { RiHome4Fill, LuClipboardList, BsTag, BsLightbulb, BsInfoCircle } = icons;
export const path = {
    ROOT: '',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    REGISTER: 'register',
    TAGS: 'tags',
    FAQS: 'faqs',
    ABOUT: 'about',
    FOR_YOU: '',
    TOP: 'top',
    LATEST: 'latest',

    ///User
    READING_LIST: 'readinglist',
    POST: 'post/:username/:slug',
    EDIT_POST: 'post/:username/:slug/edit',
    NEW_POST: 'post/new-post',
    SEARCH_POST: 'search-post',
    PROFILE: ':username',
    EDIT_PROFILE: 'setting',
};

export const sidebar = [
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
