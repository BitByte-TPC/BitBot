import { ICommand } from './types';
import { Message, Guild, Role, GuildMember } from 'discord.js';
import { BitBot } from './bitBot';

export class Command implements ICommand {
    protected _client: BitBot;
    public aliases: string[];
    public name: string;
    public description: string;
    public usage: string;

    constructor(client: BitBot) {
        this._client = client;
        this.aliases = [];
        this.name = '';
        this.description = '';
        this.usage = '';
    }

    public async run(msg: Message, args: string[]): Promise<void> { }
    public init(): void { }

    protected _sendUsages(msg: Message): void {
        msg.reply(this.usage);
    }

    protected async _createRole(guild: Guild, name: string, color: string): Promise<Role> {
        return guild.roles.create({
            data: {
                name: name,
                color: color
            }
        });
    }

    protected async _removeRole(member: GuildMember, roleName: string | RegExp): Promise<void> {
        const role = this._hasRole(member, roleName);
        if (role) {
            member.roles.remove(role);
        }
    }

    protected _hasRole(base: GuildMember | Guild, roleName: string | RegExp): Role | undefined {
        return base.roles.cache.find(r => r.name.search(roleName) >= 0);
    }
}
