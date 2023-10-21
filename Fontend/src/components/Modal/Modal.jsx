import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '~/store/app/appSlice';
import './Modal.scss';

const Modal = ({ children }) => {
    const dispatch = useDispatch();
    const { isShowModal } = useSelector((state) => state.app);
    const { isLoading } = useSelector((state) => state.app);

    return (isLoading || isShowModal) && <div className="modal">{children}</div>;
};

export default memo(Modal);
