import { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useMapbox } from '../hooks/useMapbox'


const puntoInicial = {
  lng: -78.1179,
  lat: 0.3501,
  zoom: 15,
}

export const MapaPage = () => {

  const { coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial)
  const {socket} = useContext(SocketContext)

  //* escuchar marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      for( const key of Object.keys(marcadores) ){
        agregarMarcador(marcadores[key], key)
      }
    })
  }, [socket,agregarMarcador])

  //* nuevo marcador reactivo
  useEffect(() => {
    nuevoMarcador$.subscribe( marcador => {
      socket.emit('marcador-nuevo', marcador)
    })
  }, [nuevoMarcador$,socket])

  //* movimiento de marcador
  useEffect(() => {
    movimientoMarcador$.subscribe( marcador => {
      socket.emit('marcador-actualizado', marcador)
    })
  }, [movimientoMarcador$,socket])

  //* mover marcador mediante sockets
  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador)
    })
  }, [socket, actualizarPosicion])

  //! escuchar nuevos marcadores
  useEffect(() => {
    socket.on('marcador-nuevo',(marcador) => {
      agregarMarcador(marcador, marcador.id)
    })
  }, [socket, agregarMarcador])

  return (
    <>
      <div className='info'>
        Lon: { coords?.lng } | Lat: { coords?.lat } | Zoom: { coords?.zoom }
      </div>
      <div
      ref={setRef}
        className='map-container'
      ></div>
      <div></div>
    </>
  )
}
