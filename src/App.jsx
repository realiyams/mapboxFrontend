import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import axios from 'axios'

import data from './assets/data.js'
// import place from './assets/place.js'

import Sidenav from './components/Sidenav'
import Compass from './components/Compass'
import OptionBox from './components/OptionBox'

mapboxgl.accessToken = import.meta.env.VITE_ACCESS_TOKEN

function App() {
  // INITIATE STATE
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(107.5918)
  const [lat, setLat] = useState(-6.8611)
  const [zoom, setZoom] = useState(15.75)
  const [rotate, setRotate] = useState(0)

  // STATE DATA
  const [buildings, setBuildings] = useState([])
  const [imagesBuilding, setImagesBuilding] = useState([])
  const [viewData, setViewData] = useState([])
  const [lineString, setLineString] = useState([])

  // STATE EVENT
  const [eventMove, setEventMove] = useState(false)
  const [eventLoad, setEventLoad] = useState(false)
  const [eventRotate, setEventRotate] = useState(false)
  const [dataIsFetched, setDataIsFetched] = useState(false)
  const [drawMarker, setDrawMarker] = useState(false)

  const maxBounds = [
      [107.58064975647994, -6.867965135735062],
      [107.6022821108603, -6.854738443240976]
    ]

  const coordinates = data.features[0].geometry.coordinates
  
  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: maxBounds,
      pitchWithRotate: false
    })
  }, [])

  useEffect(() => {
    if (!map.current) return // wait for map to initialize

    if (!eventMove)
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })

    setEventMove(true)
  }, [])

  useEffect(() => {
    if (!map.current) return

    if (!eventLoad)
    map.current.on('load', () => {
      let source

      try {
        map.current.addSource('Universitas Pendidikan Indonesia', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              "coordinates": coordinates
            }
          }
        })
      } catch (error) {
        source = map.current.getSource('Universitas Pendidikan Indonesia')
      }
      
      if (source) {
        const polygon = turf.polygon(coordinates)

        const invertedPolygon = turf.difference(turf.bboxPolygon([-180, -90, 180, 90]), polygon)
        const invertedPolygonGeoJSON = invertedPolygon.geometry

        map.current.addLayer({
          'id': 'inverted-polygon',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': invertedPolygonGeoJSON
          },
          'paint': {
            'fill-color': 'white',
            'fill-opacity': 0.7
          }
        })

        map.current.addLayer({
          'id': 'polygon',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': data
          },
          'paint': {
            'line-color': '#088',
            'line-width': 2
          }
        })
      }
    })

    setEventLoad(true)
  }, [])

  useEffect(() => {
    if (!map.current) return

    if (!eventRotate) {
      map.current.on('rotate', () => {
        setRotate(map.current.getBearing())
      })
      setEventRotate(true)
    }
  }, [])

  async function fetchData() {
    const response = await axios.get(import.meta.env.VITE_BACKEND + '/api/buildings')
    setBuildings(response.data)
  }

  useEffect(() => {
    if (!dataIsFetched) {
      fetchData()
      setDataIsFetched(true)
    }
  }, [dataIsFetched])

  async function fetchImage(name) {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/${name}/images`)
    setImagesBuilding(response.data)
  }

  useEffect(() => {
    if (!map.current) return

    if (buildings.length !== 0 && !drawMarker)
      buildings.map(place => {
        const {name, description, coordinate} = place
          
        let marker = new mapboxgl.Marker()
          .setLngLat([place.coordinate[0], place.coordinate[1]])
          .addTo(map.current)

        let popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<h3>${name}</h3>`)

        marker.setPopup(popup)
        marker.getElement().addEventListener('mouseenter', () => {popup.addTo(map.current)})
        marker.getElement().addEventListener('mouseleave', () => {popup.remove()})
        marker.getElement().addEventListener('click', () => {
          fetchImage(name)
          setViewData({
            name: name,
            description: description,
            coordinate: coordinate
          })
        })
        setDrawMarker(true)
      })
  }, [buildings])

  const handleCompassClick = () => {
    map.current.easeTo({
      bearing: 0,
      duration: 1000
    })
  }

  const handleLineString = (lineString) => {
    setLineString(lineString)
  }

  useEffect(() => {
    if (!map.current) return

    if (lineString.length !== 0){
      if (map.current.getLayer('start-point')) map.current.removeLayer('start-point')
      if (map.current.getLayer('end-point')) map.current.removeLayer('end-point')
      if (map.current.getSource('starting-point')) map.current.removeSource('starting-point')
      if (map.current.getSource('end-point')) map.current.removeSource('end-point')
      if (map.current.getLayer('route')) map.current.removeLayer('route')
      if (map.current.getSource('route')) map.current.removeSource('route')
      
      const bounds = lineString.reduce(function(bounds, coord) {
        return bounds.extend(coord)
      }, new mapboxgl.LngLatBounds(lineString[0], lineString[0]))

      map.current.fitBounds(bounds, {
        padding: {top: 150, bottom: 100, left: 50, right: 50}
      })
      
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: lineString
          }
        }
      })

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#0074D9',
          'line-width': 8
        }
      })

      map.current.addSource('starting-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: lineString[0]
          }
        }
      })

      map.current.addLayer({
        id: 'start-point',
        type: 'circle',
        source: 'starting-point',
        paint: {
          'circle-radius': 8,
          'circle-color': 'green'
        }
      })
      
      map.current.addSource('end-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: lineString[lineString.length - 1]
          }
        }
      })

      map.current.addLayer({
        id: 'end-point',
        type: 'circle',
        source: 'end-point',
        paint: {
          'circle-radius': 8,
          'circle-color': 'red'
        }
      })
    }

  }, [lineString])

  return (
    <div>
      <Sidenav 
        viewData={viewData}
        images={imagesBuilding}
      />
      <Compass 
        rotate={rotate} 
        onCompassClick={handleCompassClick} 
      />
      <OptionBox 
        Data={buildings} 
        onGetLineString={handleLineString}
      />
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App
