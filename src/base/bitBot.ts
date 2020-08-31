import path from 'path';
import { Client, Collection, Message } from 'discord.js';
import { Command } from './command';
import { IBitBot } from './types';

export class BitBot extends Client implements IBitBot {
    private _commands: Collection<string, Command>;
    private _aliases: Collection<string, String>;
    private _prefix = '!';

    constructor(options: Object) {
        super(options);
        this._commands = new Collection();
        this._aliases = new Collection();
        this._addListeners();
    }

    private _addListeners(): void {
        this.on('message', (msg: Message) => {
            if (msg.author.bot || !msg.guild) return;

            const prefixMention = new RegExp(`^<@!?${this.user?.id}> ?$`);
            if (msg.content.match(prefixMention)) {
                const emote = msg.guild.emojis.cache.random();
                msg.react(emote);
            }

            if (!msg.content.startsWith(this._prefix)) return;
            const args = msg.content.slice(this._prefix.length).trim().split(/ +/g);
            const commandName = args.shift()?.toLowerCase() || '';
            const command = this._commands.get(commandName);
            if (!command) return;

            try {
                command.run(msg, args);
            } catch (e) {
                console.error(e);
            }
        });

        this.on('ready', () => console.log('I am ready!'));
    }

    public loadCommand(commandPath: string, commandName: string): void {
        try {
            const propsModule = require(path.join(commandPath, commandName));
            const props: Command = new propsModule(this);
            props.init();
            this._commands.set(props.name, props);
            props.aliases.forEach(alias => {
                this._aliases.set(alias, props.name);
            });
        } catch (e) {
            console.error(`Unable to load command ${commandName}: ${e}`);
        }
    }

    public getCommands(): Collection<string, Command> {
        return this._commands.clone();
    }
}
