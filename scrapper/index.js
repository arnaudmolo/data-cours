const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const chrono = require('chrono-node')
const he = require('he') // he for decoding html entities
const where = require('node-where')
console.clear()

const decodeLinbreaks = element => {
  const html = element.html().replace(/<(?:.|\n)*?>/gm, '\n') // remove all html tags
  return he.decode(html).split('\n')
}

const sessionToArray = el => {
  return el.map((index, element) => {
    return [decodeLinbreaks(jQuery(element))]
  }).get()
}

const filtersMap = {
  'Sessions actives': el => {
    const elements = sessionToArray(el.find('.meta'))
    return elements.map(array => {
      return {
        createdAt: chrono.parseDate(array[0].replace('Créé : ', '')),
        ip: array[2].replace('Adresse IP : ', ''),
        navigator: array[3].replace('Navigateur : ', '')
      }
    })
  },
  'Activité du compte': el => {
    const elements = sessionToArray(el.find('.meta'))
    return elements.map(array => ({
      createdAt: chrono.parseDate(array[0]),
      ip: array[1].replace('Adresse IP : ', ''),
      navigator: array[2].replace('Navigateur : ', '')
    }))
  },
  'Machines reconnues': el => {
    const elements = sessionToArray(el.find('li'))
    return elements.map(array => ({
      app: array[0],
      createdAt: chrono.parseDate(array[2].replace('Mis à jour : ', '')),
      ip: array[3].replace('Adresse IP : ', ''),
      navigator: array[4].replace('Navigateur : ', '')
    }))
  },
  'Données de protection des connexions': el => {
    const elements = sessionToArray(el.find('li'))
    return elements.map(array => {
      const ipRegexp = new RegExp('^Adresse IP', 'i')
      array = array.filter(e => e)
      if (ipRegexp.test(array[0])) {
        return {
          createdAt: chrono.parseDate(array[1]),
          ip: array[array.length - 1].replace('Adresse IP : ', '')
        }
      }
      const geoRegexp = new RegExp('^Emplacement estimé déduit à partir de l’adresse IP', 'i')
      if (geoRegexp.test(array[0])) {
        const createdRegex = new RegExp('^Créé : ')
        return {
          latLng: array[0].replace('Emplacement estimé déduit à partir de l’adresse IP ', '').split(',').map(e => +e),
          createdAt: chrono.parseDate(array[1])
        }
      }
    }).filter(e => e)
  }
}

const geoloc = async e =>
  new Promise((resolve, reject) =>
    where.is(e.ip, (err, result) => {
      if (err) {
        console.log(err)
      }
      return err ? reject(err) : resolve([result.get('lat'), result.get('lng')])
    })
  )

const scrap = async () => {
  request('http://localhost:8080/public/fb-data/html/security.htm', async (err, response, html) => {
    if (!err) {
      jQuery = cheerio.load(html)
      const res = jQuery('.contents ul').map((index, element) => {
        const el = jQuery(element)
        const title = el.prev().text()
        if (filtersMap[title]) {
          return {
            title: title,
            content: filtersMap[title](el)
          }
        }
      }).get()

      const finalRes = await Promise.all(res.reduce((previous, {content}) => {
        return previous.concat(content.map(async e => {
          if (e.ip) {
            try {
              const latLng = await geoloc(e)
              return {
                ...e,
                latLng
              }
            } catch (e) {
              throw e
            }
          }
          return e
        }))
      }, []))

      fs.writeFile(
        '../public/geolocs.json',
        JSON.stringify(
          finalRes,
          null,
          4
        ), (err, res) => {
        if (err) {
          throw err
        }
        console.log('success!')
      })
    }
  })
}

scrap()
