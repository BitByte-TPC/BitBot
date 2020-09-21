import { Command } from '../base/command';
import { Message, GuildMember } from 'discord.js';
import { BitBot } from '../base/bitBot';
import { IMemberProfile } from '../base/types';


export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'batch';
        this.description = 'This will add your batch role. Batch role is required.';
        this.usage = '`!batch <year>`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {

        if (!msg.member || !msg.guild) {
            return;
        }

        if (args.length !== 1 || args[0].length !== 4 || /20[0-9]{2}/.test(args[0])) {
            this._sendUsages(msg);
            return;
        }

        if (this._hasRole(msg.member, /Batch [0-9]{4}/)) {
            msg.channel.send(`You already have a batch role. You can't get multiple Batch roles.`);
            return;
        }

        const year = args[0];

        const batchRole = this._hasRole(msg.guild, `Batch ${year}`);
        if (!batchRole) {
            msg.reply('The batch role is not available yet');
            return;
        }

        msg.member.roles.add(batchRole);
        msg.react('✅');

        this._registerMember(msg.member);
    }

    private async _registerMember(member: GuildMember): Promise<void> {
        const profile: IMemberProfile = {
            id: member.user.id,
            guildId: member.guild.id,
            ccUsername: '',
            cfHandle: '',
            score: 0
        };

        const isAlreadyRegistered = await this._client.getMemberInfo(member) !== undefined;
        if (!isAlreadyRegistered) {
            this._client.setMemberInfo(member, profile);
        }
    }
};
