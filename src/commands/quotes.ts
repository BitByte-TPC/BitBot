import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';
import quotes from '../static/quotes';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'quote';
        this.description = 'Sends random programming quote.';
        this.usage = '`!quote`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {

        const random = Math.floor(Math.random() * quotes.length);
        const quote = quotes[random];
        console.log({random, quote, length: quotes.length});
        const embed = new MessageEmbed()
            .setTitle('Quote')
            .setDescription(`${quote.en} ― ${quote.author}`)
            .setFooter(`id: ${quote.id}`)
            .setColor('#0099ff');
        msg.channel.send({ embed });
    }
};
