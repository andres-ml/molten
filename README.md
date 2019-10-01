# molten

discord.js-based modular Discord bot

Molten is a self-hosted bot that you can easily extend by defining *pieces*. Pieces allow fast definition of commands or add functionalities by listening to events. Pieces can be nested one within another to automatically group commands under a common prefix.

Molten comes packed with some default pieces, which offer functionalities like:
* Polls
* Rolling
* Timing commands
* Auto help generation
* Command aliasing

## Installation

1. This bot runs in Node.js; download the source code and run `npm install` to install the
required dependencies.
2. Rename `config.example.json` to `config.json` and edit it with your own parameters.
3. Run the bot with `nodejs main.js`

---

## Creating pieces

Creating and adding a piece to the bot is as simple as adding a new file to `pieces`.
All `.js` files under the `pieces` directory will be loaded upon bot start or reload.

Pieces have the following structure:
```js
var Piece = require.main.require('./piece.js')

class MyPiece extends Piece {

    key() {
        return ''
    }

    initialize() {

    }

}

module.exports = MyPiece
```
### Adding commands

Adding commands is done through the `addCommand` function, usually in `initialize`.
For example, let's add a 'say' command to our piece:
```js
initialize() {

    this.addCommand('say [words]*', (data, context) => {
        let sentence = data.words.join(' ')
        context.message.channel.send(sentence)
    })

}
```

The `addCommand` function takes 2 arguments; the first is a command string, the second a callback that will be called when a message that matches the command string is sent.

#### Command formatting

Commands are defined with strings. Those strings have the following structure; in this order:
1. One or more words: `say`, `say this`, `add number`, `play song`, `play`, etc.
2. Zero or more required arguments: `<word>`, `<a> <b>`, etc.
3. Zero or more optional arguments: `[number]`, `[a] [b]`, etc.
4. Zero or one star argument: `[words]*`. This attempts to match as many remaining arguments as possible.

So, for example, some valid commands would be:
* `sum2 <a> <b>`
* `roll <from> [to]`
* `say <sentence> [delay]`
* `roll [options]*`

But the following wouldn't be valid:
* `say [words]* [delay]`
* `say [delay] <sentence>`
* `[a] [b]`

Also, aliasing commands is possible with the `|` character:
```js
// this
this.addCommand('say [words]*', fn)
this.addCommand('echo [words]*', fn)

// can be summarized as this
this.addCommand('say|echo [words]*', fn)

```

#### Command callbacks

The callback function takes two arguments: `data` and `context`. `data` is an object containing the arguments of the command, and `context` another object containing information about the context of our command, in this case a discord.js Message.

For example, if we have the command `sum <foo> [bar] [baz]*`:
* `sum 1` would make `data` be `{ foo: '1', bar: null, baz: [] }`
* `sum 1 2 3 4 5` would make `data` be `{ foo: '1', bar: '2', baz: ['3', '4', '5'] }`
* `sum` would give an error (since it's missing a required argument)

`data` also holds a special `_all` key that holds all the arguments as an array.

#### Command options

* `description` command description used to display bot help
* `auth` command permissions/auth options. It can contain an array of role names `roles`, which will be checked against the user who runs the command. If he has at least any of the specified roles, the command will be executed properly; otherwise it will fail.

For example:
```js
this.addCommand('ban <user>', callback, {
    description: 'Bans user <user>',
    auth: {
        roles: ['admin']
    }
})
```

### Prefixing

Defining a non-empty `key()` automatically prepends that key to all of the pieces' (and subpieces') commands.

For example, if we have a command `say <sentence>` that we can call by writing `say "this is a sentence"`, defining the piece key as `foo` would make the previous message stop working, and we'd have to write `foo say "this is a sentence"`
```js
key() {
    return ''
}
```
> say "I am a bot!"
```js
key() {
    return 'foo'
}
```
> ~~say~~ foo say "I am a bot!"

#### Nesting

When loading a piece `piece-name.js`, molten will attempt to load all pieces under directory `piece-name/`, if it exists under the same directory as `piece-name.js`.

For example, the following structure:
```
pieces/
├── misc.js
├── misc/
│   ├── funny.js
│   ├── stuff.js
└── polls.js
```

Would load `misc.js`, `funny.js`, `stuff.js` and `polls.js`.

Nesting allows grouping functionalities under a specific prefix. For example, if `misc.js` defines its key as `foo`, all of its commands and its subpieces' commands will require the `foo` prefix.

Nesting can also be used without defining a key, and will work as if all the pieces were siblings.

---

## Q/A
>Q: Yet another discord.js bot? Aren't there better ones already out there?

A: I wanted to make one myself.
>Q: Where does the name *molten* come from?

A: Inside joke in one of my discord servers.
