import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'
import moment from 'moment'

import { startup } from './map'
import { startChart } from './msg'
import { startActivityChart } from './activity'
import { startEventsChart } from './events'

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})

// data.forEach(d => console.log)

startChart()
startActivityChart()
startEventsChart()
startup()