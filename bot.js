var Discord         = require('discord.js')
var Commander       = require('./lib/commander.js')

class Bot {

    constructor(config) {
        this.config = config
        this.initialize()
    }

    initialize() {
        this.commander  = new Commander()
        this.bot        = new Discord.Client()

        this.commander.add('test', (data) => {
            return JSON.stringify(data)
        })

        this.bot.on('message', (message) => {
            if (message.content.indexOf(this.config.prefix) === 0) {
                let commandString = message.content.substring(this.config.prefix.length)
                let reply = this.run(commandString, message)
                message.channel.sendMessage(reply)
                console.log(message)
            }
        })

        this.bot.login(this.config.auth)
    }

    run(commandString, message) {
        let reply = this.commander.run(commandString)
        reply += '\n' + message.member

        return reply
    }

}

module.exports = Bot
