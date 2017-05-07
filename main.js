var Bot     = require('./bot.js')
var config  = require('./config.json')

new Bot(config)

// const Utils = require('./lib/utils.js')
//
// let message = `>time in 1 ">time in 4 \\"after 5 seconds\\""`
// let regex   = /(\w+)|"((?:\\"|[^"])+)"/g
//
// console.log(Utils.matches(message, regex))
