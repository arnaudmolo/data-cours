const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

const scrap = () => {
  request('http://localhost:8080/public/index.html', (err, response, html) => {
    if (!err) {
      $ = cheerio.load(html)
      console.log('okokkkkk')
    }
  })
}

scrap()

console.log('Magic happens on port 8081')
