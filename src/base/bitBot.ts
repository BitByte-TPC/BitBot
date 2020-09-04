import path from 'path';
import { Client, Collection, Message, PartialGuildMember, GuildMember } from 'discord.js';
import { Command } from './command';
import { IBitBot, IMemberProfile } from './types';
import responses from '../static/responses';
import Keyv from 'keyv';

export class BitBot extends Client implements IBitBot {
    private _commands: Collection<string, Command>;
    private _aliases: Collection<string, String>;
    private _prefix = '!';

    private _memberDB: Keyv<IMemberProfile>;

    constructor(options: Object) {
        super(options);
        this._commands = new Collection();
        this._aliases = new Collection();
        this._addListeners();
        this._memberDB = new Keyv<IMemberProfile>(process.env.POSTGRESQL_URL, { namespace: 'member' });
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

        this.on('guildMemberAdd', (member: GuildMember | PartialGuildMember) => {
            const welcomeChannel = member.guild.systemChannel;
            if (welcomeChannel && member.user) {
                const random = Math.floor(Math.random() * responses.onJoin.length);
                const msg = responses.onJoin[random].replace('%name%', member.user.toString());
                welcomeChannel.send(msg);
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

    public async setMemberInfo(member: GuildMember, value: IMemberProfile): Promise<void> {
        const key = `${member.guild.id}/${member.user.id}`;
        this._memberDB.set(key, value);
    }

    public async getMemberInfo(member: GuildMember): Promise<IMemberProfile | undefined> {
        const key = `${member.guild.id}/${member.user.id}`;
        return this._memberDB.get(key);
    }

    public async getAllMembers(): Promise<Map<GuildMember, IMemberProfile>> {
        const members = new Map<GuildMember, IMemberProfile>();
        this.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(async mem => {
                const memProf = await this.getMemberInfo(mem);
                if (memProf) {
                    members.set(mem, memProf);
                }
            });
        });
        return members;
    }
}
