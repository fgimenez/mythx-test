#!/usr/bin/env node

if (!process.env.MYTHX_ETH_ADDRESS || !process.env.MYTHX_PASSWORD) {
  console.log('Please export your MythX credentials as environment variables MYTHX_ETH_ADDRESS and MYTHX_PASSWORD. You can sign up in https://mythx.io.')
  process.exit(1)
}

const armlet = require('armlet')
const fs = require('fs')

const data = {
  sources: { "basecontract.sol": { source: ''}}
}
let send = false
if (process.argv[2]) {
  data.bytecode = process.argv[2]
  send = true
}

if (process.argv[3]) {
  fs.readFile(process.argv[3], 'utf8', (err, contents) => {
    data.sources["basecontract.sol"].source = contents
    request(data)
  })
} else if (send) {
  request(data)
} else {
  console.log('Please provide bytecode or source code')
}

function request(data) {
  console.log('Sending request to MythX...')

  const auth = { ethAddress: process.env.MYTHX_ETH_ADDRESS, password: process.env.MYTHX_PASSWORD }
  const url = process.env.MYTHX_API_URL || 'https://api.mythx.io'

  const client = new armlet.Client(auth, url)

  client.analyze({data, timeout: 300000})
    .then(i => console.log(JSON.stringify(i, null, 4)))
    .catch(e => console.log(e))
}
