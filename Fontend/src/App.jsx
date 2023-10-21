import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from '~/routers/Router';
import { Loading, Modal } from './components';
const App = () => {
    return (
        <div style={{ position: 'relative' }}>
            <Modal>
                <Loading />
            </Modal>
            <Router />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer />
        </div>
    );
};

export default App;
