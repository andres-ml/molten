var Commander = require('./lib/commander.js')

class Dispatcher {

    constructor(bot) {
        this.bot = bot
        this.build()
    }

    run(command, message) {
        // uncomment to automatically reload before each command (useful while developing)
        // this.build()
        this.commander.run(command, {message: message})
    }

    build() {
        this.clearEvents()
        this.commander = new Commander()
        this.pieces = this.loadPieces('./pieces')
        this.pieces.forEach(piece => this.loadCommands(piece))
    }

    loadPieces(directory) {
        let parts = []
        try {
            parts = this.loadDirectory(directory)
        } catch (error) {
            // console.log(error.message)
        }
        return parts
    }

    loadDirectory(directory) {
        let parts = []

        require('fs')
            .readdirSync(directory)
            .filter(fileName => fileName.match(/\.js$/))
            .forEach(fileName => {
                let part = this.loadPiece(directory, fileName)
                parts.push( part )
            })

        return parts
    }

    loadPiece(directory, fileName) {
        let piecePath = directory + '/' + fileName
        delete require.cache[require.resolve(piecePath)]

        let Piece = require(piecePath)
        let piece = new Piece(this)

        let pieceName = fileName.replace('.js', '')
        let pieceParts = this.loadPieces(directory + '/' + pieceName)
        return {
            piece: piece,
            parts: pieceParts
        }
    }

    loadCommands(piece, prefix = []) {
        prefix.push(piece.piece.key())

        piece.piece.getCommands().forEach(command => {
            let commandString = prefix
                .concat([command.command])  // add current
                .filter(key => key)         // filter out empty keys
                .join(' ')                  // to string

            console.log(`Adding command '${commandString}'`)
            this.commander.add(commandString, command.callback)
        })

        piece.parts.forEach(part => {
            this.loadCommands(part, prefix)
        })
    }

    clearEvents() {
        for (let eventName in this.events) {
            this.events[eventName].forEach(callback => {
                this.bot.removeListener(eventName, callback)
            })
        }
        this.events = {}
    }

    addListener(eventName, callback) {
        if (!(eventName in this.events)) {
            this.events[eventName] = []
        }

        this.events[eventName].push(callback)
        this.bot.on(eventName, callback)
    }

}

module.exports = Dispatcher
