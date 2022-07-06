import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket';


export const SocketContext = createContext();


export const SocketProvider = ({ children }) => {

  // const {socket, online} = useSocket('http://localhost:8080')
  const {socket, online} = useSocket('https://qmapas.herokuapp.com/')

  return (
    <SocketContext.Provider
      value={{socket,online}}
    >
      {children}
    </SocketContext.Provider>
  )
}