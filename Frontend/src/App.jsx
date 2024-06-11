import Router from '~/routers/Router';
import { AuthProvider, SocketProvider } from './contexts';
const App = () => {
   return (
      <AuthProvider>
         <SocketProvider>
            <Router />
         </SocketProvider>
      </AuthProvider>
   );
};

export default App;
