import { Command } from '../base/command';
import { Client, Message } from 'discord.js';
import { BitBot } from '../base/bitBot';


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

        if (args.length !== 1 || isNaN(parseInt(args[0]))) {
            this._sendUsages(msg);
            return;
        }

        if (this._hasRole(msg.member, /Batch [0-9]{4}/)) {
            msg.channel.send(`You can't get multiple Batch roles.`);
            return;
        }

        const year = args[0];

        let batchRole = this._hasRole(msg.guild, `Batch ${year}`);

        if (!batchRole) {
            batchRole = await this._createRole(msg.guild, `Batch ${year}`, 'GREEN');
        }

        msg.member.roles.add(batchRole);
        msg.react('✅');
    }

};
