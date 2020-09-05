import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'serverinfo';
        this.description = 'Shows server information';
        this.usage = '`!serverinfo`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {

        if (!msg.guild) {
            return;
        }

        const iconURL = msg.guild.iconURL() || undefined;

        const embed = new MessageEmbed()
            .addField('Name', msg.guild.name, true)
            .addField('ID', msg.guild.id, true)
            .addField('Owner', `${msg.guild.owner?.user.username}#${msg.guild.owner?.user.discriminator}`, true)
            .addField('Members', `${msg.guild.members.cache.filter(member => !member.user.bot).size} Coders`, true)
            .addField('Channels', msg.guild.channels.cache.size, true)
            .addField('Roles', msg.guild.roles.cache.size, true)
            .addField('Creation Date', `${msg.guild.createdAt.toUTCString().substr(0, 16)} (${this._checkDays(msg.guild.createdAt)})`, true)
            .setAuthor(msg.guild.name || '', iconURL);
        if (iconURL) {
            embed.setThumbnail(iconURL);
        }

        msg.channel.send(embed);
    }

    private _checkDays(date: Date | undefined): string {
        if (date === undefined) {
            return '';
        }
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);
        return days + (days === 1 ? ' day' : ' days') + ' ago';
    }
};
