import React from 'react';
import Router from '~/routers/Router';
import { AuthProvider } from './contexts';
const App = () => {
    return (
        <div>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </div>
    );
};

export default App;
