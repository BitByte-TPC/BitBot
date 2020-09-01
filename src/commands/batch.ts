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
        if (args.length !== 1 || isNaN(parseInt(args[0]))) {
            this._sendUsges(msg);
            return;
        }

        const roles = msg.member?.roles.cache;
        const batchRoleReg = new RegExp(/Batch [0-9]{4}/);
        if (roles?.find(r => batchRoleReg.test(r.name))) {
            msg.channel.send(`You can't get multiple Batch roles.`);
            return;
        }

        const year = args[0];
        const batchRole = 'Batch ' + year;
        let role = roles?.find(r => r.name === batchRole);

        if (!role) {
            await msg.guild?.roles.create({
                data: {
                    name: batchRole,
                    color: 'GREEN'
                }
            }).catch(console.error);
            role = roles?.find(r => r.name === batchRole);
        }

        msg.member?.roles.add(batchRole);
        msg.react('✅');
    }

};
