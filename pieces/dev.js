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

    }

}

module.exports = Test
