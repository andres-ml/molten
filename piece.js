class Piece {

    key() {
        return ''
    }

    constructor(dispatcher) {
        this.dispatcher = dispatcher
        this.commands = []
        this.initialize()
    }

    initialize() {

    }

    addCommand(command, callback) {
        this.commands.push({
            command: command,
            callback: callback
        })
    }

    addListener(eventName, callback) {
        this.dispatcher.addListener(eventName, callback)
    }

    getCommands() {
        return this.commands
    }

}

module.exports = Piece
