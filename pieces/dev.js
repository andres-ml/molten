var Piece   = require.main.require('./piece.js')

class Test extends Piece {

    key() {
        return ''
    }

    initialize() {

        /**
         * Reloads all of the bots' pieces
         */
        this.addCommand('reload', (data, context) => {
            this.dispatcher.build()
            context.message.channel.send('Reloaded bot pieces')
        })


        let aliases = {}

        /**
         * Aliases commands
         *
         * E.g.
         *  alias sendIn2 "time in 2"
         *
         * Then:
         *  sendIn2 "Hi there"
         *
         * Would have the same effect as:
         *  time in 2 "Hi there"
         *
         * Alias will fail if it already exists. Error message only if
         * it exists as an alias and not a normal command.
         *
         */
        this.addCommand('alias <alias> [parts]*', (data, context) => {
            let command = data.parts.join(' ')

            if (data.alias in aliases) {
                return context.message.channel.send(`Failed to create alias '${data.alias}', it already exists`)
            }

            aliases[data.alias] = command

            this.dispatcher.commander.add(data.alias, (data, context) => {
                // build full command. pass arguments to allow using aliases as partial calls. escape arguments with quotes
                let fullCommand = command + ' ' + data._all.map(part => `"${part}"`).join(' ')
                this.dispatcher.run(fullCommand, context.message)
            })

            context.message.channel.send(`Aliased ${command} to '${data.alias}'`)
        })

    }

}

module.exports = Test
