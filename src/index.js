import './styles.css'
import { csv } from 'd3'

csv('/public/basic.csv', data => {
  console.log(data)
})
