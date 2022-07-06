import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import {v4 as uuidv4} from 'uuid'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

export const useMapbox = (puntoInicial) => {

  const mapaDiv = useRef();
  const setRef = useCallback( (node) => {
    mapaDiv.current = node
  },[])

  const mapa = useRef()
  const [coords, setCoords] = useState(puntoInicial)

  //! Referencia a los marcadores
  const marcadores = useRef({})
  
  //! observadores de RxJs
  const movimientoMarcador = useRef( new Subject() );
  const nuevoMarcador = useRef( new Subject() )

  //! agregar marcador
  const agregarMarcador = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev

    const marker = new mapboxgl.Marker()
    marker.id = id ?? uuidv4(); 
    
    marker
    .setLngLat([ lng, lat ])
    .addTo( mapa.current )
    .setDraggable(true)
    
    marcadores.current[ marker.id ] = marker ;
    
    
    if (!id) {
      nuevoMarcador.current.next({
        id: marker.id,
        lng, lat
      })
    }

    //! mover marcador
    marker.on('drag', ({target}) => {
      const {id} = target
      const { lng, lat } = target.getLngLat()
      //! cambios del marcador mediante rxjs
      movimientoMarcador.current.next({ id, lng, lat })
    })

  },[])

  //* actualizar la posición del marcador
  const actualizarPosicion = useCallback( ({ id, lng, lat }) => {
    marcadores.current[id].setLngLat([ lng, lat ]);
  },[])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom
    });
    mapa.current = map
  }, [puntoInicial])

  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
          lng: lng.toFixed(4),
          lat: lat.toFixed(4),
          zoom: mapa.current.getZoom().toFixed(2)
      })
    })
  }, [mapa])

  //! crear marcadores
  useEffect(() => {
    mapa.current?.on('click', agregarMarcador )
  }, [agregarMarcador])



  return {
    agregarMarcador,
    actualizarPosicion,
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
    setRef 
  }
}
