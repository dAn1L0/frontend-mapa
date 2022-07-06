import { SocketProvider } from './context/SocketContext'
import { MapaPage } from './pages/MapaPage'


export const MapApp = () => {
  return (
    <SocketProvider>
      <MapaPage />  
    </SocketProvider>
  )
}
