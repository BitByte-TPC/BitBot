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

        if (!msg.guild || !msg.member) {
            return;
        }

        if (args.length === 2) {
            args[0] = args.join(' ');
            args.pop();
        }

        if (args.length !== 1) {
            this._sendUsages(msg);
            return;
        }

        const roleName = args[0].toLowerCase();
        const reg = new RegExp(roleName, 'i');

        if (allowedSelfRoles.findIndex(s => reg.test(s)) < 0) {
            msg.reply('Select one of these: ' + allowedSelfRoles.toString() + '.');
            return;
        }

        const role = this._hasRole(msg.guild, reg);
        if (!role) {
            throw `Could not not find role ${roleName}`;
        }

        if (msg.member.roles.cache.has(role.id)) {
            msg.member.roles.remove(role);
        } else {
            msg.member.roles.add(role);
            msg.react('✅');
        }
    }
};
