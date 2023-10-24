import React, { memo } from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
    return <ClipLoader color="#000" size={60} cssOverride={{ borderWidth: '5px' }} />;
};

export default memo(Loading);
