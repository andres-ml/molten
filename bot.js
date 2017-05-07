var Discord     = require('discord.js')
var Dispatcher  = require('./dispatcher.js')

class Bot {

    constructor(config) {
        this.config = config
        this.initialize()
    }

    initialize() {
        this.bot = new Discord.Client()
        this.dispatcher = new Dispatcher(this.bot)

        this.bot.on('message', message => {
            if (message.content.indexOf(this.config.prefix) === 0) {
                let command = message.content.substring(this.config.prefix.length)
                this.run(command, message)
            }
        })

        this.bot.login(this.config.auth)
    }

    run(command, message) {
        try {
            this.dispatcher.run(command, message)
        }
        catch (error) {
            let reply = "I couldn't understand your request (" + error.message + "). Try using the help: " + this.config.prefix + 'help'
            message.channel.send(reply)
        }
    }


}

module.exports = Bot
