const { readdirSync, statSync, existsSync, readFileSync, writeFile } = require('fs')
const { join } = require('path')
const path = __dirname + '/../public/facebook/'
const where = require('node-where')

const getDirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory() && existsSync(join(p, f, '/message.json')))
const mergeMsgs = () => {
  const names = getDirs(path + 'messages/')
  let msgs = []
  for (let n of names) {
    msgs.push(JSON.parse(readFileSync(join(path, 'messages/', n, '/message.json'), 'utf8')))
  }
  writeFile('public/messages.json', JSON.stringify(msgs, null, 4), (err, res) => {
    if (err) {
      throw err
    }
    console.log('success!')
  })
}

const getGeoloc = async () => {
  const geoByIp = async d =>
    new Promise((resolve, reject) =>
      where.is(d.ip_address, (err, result) => {
        if (err) {
          console.log(err)
        }
        return err ? reject(err) : resolve(result)
      })
    )
  
  let res = JSON.parse(readFileSync(join(path, 'security_and_login_information/', 'account_activity.json'), 'utf8'))
  let coords = await Promise.all(res.account_activity.map(async e => {
    const whereIs = await geoByIp(e)
    const latLng = [whereIs.get('lat'), whereIs.get('lng')]
    return {
      ...e,
      latLng,
      city: whereIs.get('city')
    }
  }))

  const json2geo = data => ({
    type: 'FeatureCollection',
    features: data.map(e => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [...e.latLng].reverse()
      },
      properties: e
    }))
  })

  let finalRes = json2geo(coords)

  writeFile(
    'public/geolocs.json',
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

mergeMsgs()
getGeoloc()
