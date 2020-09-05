import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';
import Codeforces from '../service/codeforces';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'cf';
        this.description = 'This is a prefix command for all codeforces related commands.';
        this.usage = '`!cf <command> [...args]`';
    }

    public init(): void {
        const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
        setInterval(async () => {
            const members = await this._client.getAllMembers();
            members.forEach((profile, mem) => {
                this._updateRole(mem, profile.cfHandle);
            });
        }, FIVE_DAYS);
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        const command = args.shift();

        switch (command) {
            case 'connect':
                this._connect(msg, args);
                break;
            case 'user':
                this._user(msg, args);
                break;
            case 'prob':
                this._problem(msg, args);
                break;
            case 'update':
                this._update(msg);
                break;
            default:
                this._help(msg);
        }
    }

    private async _connect(msg: Message, args: string[]): Promise<void> {
        if (args.length !== 1) {
            msg.reply('Usages: `!cf connect <handle>`');
            return;
        }

        const handle = args[0];
        // TODO: Check if handle is correct or not
        const [contestId, index, probLink] = await Codeforces.getRandomProblem();
        msg.reply(`You have 1 minutes! Submit a code to the below question. It doesn't have to be correct just submit.\n${probLink}`);

        setTimeout(async () => {
            try {
                const submissionTime = await Codeforces.getLatestSubmissionDate(handle, contestId, index);
                const timeDiff = new Date().getTime() - submissionTime.getTime();
                if (timeDiff <= 6 * 60 * 1000) {
                    msg.reply(`You are now verified for Codeforces user: ${handle}!\nYour role will be added soon.`);

                    if (msg.member) {
                        this._setMemberHandle(msg.member, handle);
                        this._updateRole(msg.member, handle);
                    }
                } else {
                    msg.reply('Failed to verify your Codeforces account. You can try again.');
                }
            } catch (e) {
            }
        }, 60 * 1000);
    }

    private async _update(msg: Message): Promise<void> {
        if (msg.member) {
            const profile = await this._client.getMemberInfo(msg.member);
            if (profile) {
                this._updateRole(msg.member, profile.cfHandle);
                msg.react('✅');
            } else {
                msg.reply('You are not registered yet, register yourself with `!batch <year>`');
            }
        }
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
            .addField('`!cf connect <username>`', 'Gives you codechef star role.')
            .addField('`!cf prob <tag>`', 'Fetches random problem from tag.')
            .addField('`!cf user <handle>`', 'Prints user information.')
            .addField('`!cf update`', `Manually update your Codeforces role.`)
            .setTitle('Help!')
            .setDescription(this.description);
        msg.channel.send(embed);
    }

    private async _setMemberHandle(member: GuildMember, handle: string): Promise<void> {
        const profile = await this._client.getMemberInfo(member);
        if (profile) {
            profile.cfHandle = handle;
            this._client.setMemberInfo(member, profile);
        }
    }

    private async _updateRole(member: GuildMember, handle: string): Promise<void> {
        const cfProfile = await Codeforces.getUserInfo(handle);
        const roleName = cfProfile.rank;
        if (this._hasRole(member, roleName)) {
            return;
        }

        const reg = new RegExp(/(Newbie|Pupil|Specialist|Expert|Candidate Master|Master|International Master|Grandmaster|International Grandmaster)/);
        const oldRole = this._hasRole(member, reg);
        if (oldRole) {
            member.roles.remove(oldRole);
        }

        let role = this._hasRole(member.guild, roleName);
        if (!role) {
            role = await this._createRole(member.guild, roleName, cfProfile.colorCode);
        }

        member.roles.add(role);
    }
};
