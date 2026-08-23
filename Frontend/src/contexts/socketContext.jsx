import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '~/hooks';

export const SocketContext = createContext();

function SocketProvider({ children }) {
   const { user: currentUser } = useAuth();
   const [socket, setSocket] = useState(null);
   useEffect(() => {
      const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`, {
         query: {
            userId: currentUser ? currentUser?._id : null,
         },
         //withCredentials: true,
      });
      if (currentUser !== null) {
         newSocket.on('connect', () => {
            newSocket.emit('join', {
               userId: currentUser?._id,
               socketId: newSocket.id,
            });
         });

         setSocket(newSocket);
      } else {
         setSocket(null);
         newSocket.disconnect();
      }

      return () => {
         newSocket.disconnect();
      };
   }, [currentUser]);

   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export default SocketProvider;
