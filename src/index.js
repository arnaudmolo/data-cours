import './styles.css'
import mapboxgl from 'mapbox-gl'
import moment from 'moment'
import { render } from './View'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkbW9sbyIsImEiOiJjaW5zbjgxYXQwMGowdzdrbGQ5a2NlaGpuIn0.JxCzxWoDULTqfKatKDFg9g'
const map = new mapboxgl.Map({
  container: 'content',
  style: 'mapbox://styles/arnaudmolo/cjfk1zs7bejmr2rnypmmdsy4s',
  center: [0.380435, 47.530053],
  zoom: 5.85,
  bearing: 0,
  pitch: 0
})

// Return different version of the data
// depending on the state of the application.
const reducer = (state) => {
  return state
}

const createPopup = properties => `<div>
  <p>${properties.city}</p>
  <p>${moment(properties.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
</div>`

const startup = async () => {
  let data = await (
    await window.fetch('public/geolocs.geojson')
  ).json()

  data = {
    ...data,
    features: data.features.map(d => {
      const createdAt = moment(d.properties.createdAt)
      const month = createdAt.month()
      return {
        ...d,
        properties: {
          ...d.properties,
          createdAt,
          month
        }
      }
    })
  }

  const lines = {
    type: 'FeatureCollection',
    features: data.features.map((d, i) => {
      const next = data.features[i + 1] ? i + 1 : 0
      return {
        ...d,
        type: 'Feature',
        geometry: {
          'type': 'LineString',
          coordinates: [
            [
              data.features[i].geometry.coordinates[0],
              data.features[i].geometry.coordinates[1]
            ],
            [
              data.features[next].geometry.coordinates[0],
              data.features[next].geometry.coordinates[1]
            ]
          ]
        }
      }
    })
  }

  map.on('load', () => {
    map.addSource('facebook', {type: 'geojson', data})
    map.addSource('facebook-lines', {
      'type': 'geojson',
      'data': lines
    })
    map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'facebook-lines',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': 'hsl(154, 44%, 47%)',
        'line-width': 2
      }
    })

    map.addLayer({
      id: 'points',
      type: 'circle',
      source: 'facebook',
      paint: {
        'circle-color': 'red'
      }
    })

    render(map)(data)

    map.on('click', 'points', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice()
      const description = e.features[0].properties

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(createPopup(description))
        .addTo(map)
    })
  })
}

startup()
