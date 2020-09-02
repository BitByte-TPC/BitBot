import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';
import Codechef from '../service/codechef';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'cc';
        this.description = 'This is a prefix command for all codechef related commands.';
        this.usage = '`!cc <command> ...`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        const command = args.shift();

        switch (command) {
            // case 'connect':
            //     this._connect(msg, args);
            case 'sub':
                this._sub(msg, args);
                break;
            case 'user':
                this._user(msg, args);
                break;
            case 'prob':
                this._problem(msg, args);
                break;
            default:
                this._help(msg);
        }
    }

    private async _connect(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc connect <username>`');
            return;
        }

        const username = args[0];
        const [probCode, probLink] = await Codechef.fetchRandomProblem();
        msg.reply(`You have 5 min!, submit a code to the below question. It doesn't have to be correct just submit.\n${probLink}`);

        setTimeout(async () => {
            const submissionTime = await Codechef.getLatestSubmissionDate(username, probCode);
            const timeDiff = new Date().getTime() - submissionTime.getTime();

            if (timeDiff <= 6 * 60 * 1000) {
                msg.reply(`You are now verified for Codechef user: ${username}!\nYour role will be added soon.`);

                if (msg.member) {
                    this._setRole(msg.member, username);
                }
            } else {
                msg.reply('Failed to verify your codechef account. You can try again.');
            }
        }, 5 * 60 * 1000);
    }

    private async _problem(msg: Message, args: string[]): Promise<void> {

        const argValues = ['school', 'easy', 'medium', 'hard', 'challenge'];
        const difficulty = args[0];

        if (args.length !== 1 || !argValues.includes(difficulty)) {
            msg.reply('Usages: `!cc prob [school|easy|medium|hard|challenge]`');
            return;
        }

        const [, probLink] = await Codechef.fetchRandomProblem(difficulty);
        msg.channel.send(probLink);
    }

    private async _sub(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc sub <submission_id>`');
            return;
        }
        const id = args[0];
        const code = await Codechef.getSubmission(id);

        // Try detecting a language
        let lang = '';
        if (code.includes('#include')) {
            lang = 'c++';
        } else if (code.includes('input()')) {
            lang = 'python';
        } else if (code.includes('import java')) {
            lang = 'java';
        }

        msg.channel.send(`\`\`\`${lang}\n ${code} \n\`\`\``);
    }

    private async _user(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc user <username>`');
            return;
        }

        const username = args[0];
        const user = await Codechef.getUserInfo(username);

        const embed = new MessageEmbed()
            .addField(user.name, user.username)
            .addField('Stars', user.stars, true)
            .addField('Rating', user.rating, true)
            .addField('Highest Rating', user.maxRating, true)
            .setColor(user.colorCode)
            .setTitle('Codechef Profile')
            .setDescription(user.link)
            .setThumbnail(user.iconURL);

        msg.channel.send(embed);
    }

    private _help(msg: Message): void {
        const embed = new MessageEmbed()
            // .addField('`!cc connect <username>`', 'Gives you codechef star role.')
            .addField('`!cc prob [school|easy|medium|hard|challenge]`', 'Fetches random problem based on given difficulty.')
            .addField('`!cc sub <submission_id>`', 'Fetches source code of submission.')
            .addField('`!cc user <username>`', 'Prints user information.')
            .setTitle('Help!');
        msg.channel.send(embed);
    }

    private async _setRole(member: GuildMember, id: string): Promise<void> {
        const user = await Codechef.getUserInfo(id);
        const newRole = 'Codechef ' + user.stars + '★';

        const roles = member.roles;
        const oldRole = roles.cache.find(r => r.name.startsWith('Codechef'));

        if (oldRole) {
            member.roles.remove(oldRole);
        }

        const role = member.guild.roles.cache.find(r => r.name === newRole);
        if (role) {
            member.roles.add(role);
        }
    }
};
