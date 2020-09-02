import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';
import Codeforces from '../service/codeforces';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'cf';
        this.description = 'This is a prefix command for all codeforces related commands.';
        this.usage = '`!cf <command> ...`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        const command = args.shift();

        switch (command) {
            // case 'connect':
            //     this._connect(msg, args);
            //     break;
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
        const [contestId, index, probLink] = await Codeforces.getRandomProblem();
        msg.reply(`You have 5 min!, submit a code to the below question. It doesn't have to be correct just submit.\n${probLink}`);

        setTimeout(async () => {
            const submissionTime = await Codeforces.getLatestSubmissionDate(username, contestId, index);
            const timeDiff = new Date().getTime() - submissionTime.getTime();
            if (timeDiff <= 6 * 60 * 1000) {
                msg.reply(`You are now verified for Codeforces user: ${username}!\nYour role will be added soon.`);

                if (msg.member) {
                    this._setRole(msg.member, username);
                }
            } else {
                msg.reply('Failed to verify your Codeforces account. You can try again.');
            }
        }, 5 * 60 * 1000);
    }

    private async _problem(msg: Message, args: string[]): Promise<void> {

        if (args.length < 1) {
            msg.reply('Usages: `!cf prob <tag>`. Checkout cf for tags!');
            return;
        }

        const tag = args.join(' ');
        try {
            const [, , probLink] = await Codeforces.getRandomProblem(tag);
            msg.channel.send(probLink);
        } catch (e) {
            msg.channel.send(e.message);
        }
    }

    private async _user(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            msg.reply('Usages: `!cf user <username>`');
            return;
        }

        const handle = args[0];

        try {
            const user = await Codeforces.getUserInfo(handle);

            const embed = new MessageEmbed()
                .addField(user.name, user.handle)
                .addField('Rank', user.rank, true)
                .addField('HighestRank', user.maxRank, true)
                .addField('Rating', user.rating, true)
                .addField('Highest Rating', user.maxRating, true)
                .setColor(user.colorCode)
                .setTitle('Codeforces Profile')
                .setDescription(user.link)
                .setThumbnail(user.iconURL);

            msg.channel.send(embed);
        } catch (e) {
            msg.channel.send(e.message);
        }
    }

    private _help(msg: Message): void {
        const embed = new MessageEmbed()
            // .addField('`!cf connect <username>`', 'Gives you codechef star role.')
            .addField('`!cf prob <tag>`', 'Fetches random problem from tag.')
            .addField('`!cf user <handle>`', 'Prints user information.')
            .setTitle('Help!');
        msg.channel.send(embed);
    }

    // TODO
    private async _setRole(member: GuildMember, id: string): Promise<void> {
    }
};
