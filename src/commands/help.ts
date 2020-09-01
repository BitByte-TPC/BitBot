import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';
import { Message, MessageEmbed } from 'discord.js';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'help';
        this.description = 'Displays all the available commands.';
        this.usage = '`!help [command]`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        const commands = this._client.getCommands();
        const embed = new MessageEmbed();

        switch (args.length) {
            case 1:
                const name = args[0].trim();
                if (commands.has(name)) {
                    const c = commands.get(name);
                    embed.addField(c?.name, `${c?.description}\nusages: ${c?.usage}`);
                    msg.channel.send(embed);
                } else {
                    msg.channel.send(`Command ${name} not found.`);
                }
                break;
            case 0:
                commands.forEach(c => {
                    embed.addField(c.name, `${c.description}\nusages: ${c.usage}`);
                });
                msg.channel.send(embed);
                break;
            default:
                this._sendUsges(msg);
        }
    }
};
