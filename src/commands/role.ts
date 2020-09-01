import { Command } from '../base/command';
import { Message } from 'discord.js';
import { BitBot } from '../base/bitBot';

const allowedSelfRoles = ['Competitive Programmer', 'Developer', 'Gamer', 'Linux', 'Windows'];

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'role';
        this.description = 'Get a role. Allowed roles are ' + allowedSelfRoles.toString() + '.';
        this.usage = '`!role <which>`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            this._sendUsges(msg);
            return;
        }
        if (!allowedSelfRoles.includes(args[0])) {
            msg.reply('Select one of these: ' + allowedSelfRoles.toString() + '.');
            return;
        }

        const role = msg.guild?.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());

        if (!role) {
            throw `Can not find role ${args[0]}`;
        }

        if (msg.member?.roles.cache.has(role.id)) {
            msg.member.roles.remove(role);
        } else {
            msg.member?.roles.add(role);
        }
    }
};
