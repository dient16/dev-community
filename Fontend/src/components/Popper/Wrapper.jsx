import React from 'react';

import clsx from 'clsx';

const Wrapper = ({ children, className }) => <div className={clsx('wrapper', className)}>{children}</div>;

export default Wrapper;
