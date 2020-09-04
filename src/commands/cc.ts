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
            case 'sub':
                this._sub(msg, args);
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
            msg.reply('Usages: `!cc connect <username>`');
            return;
        }

        const username = args[0];
        const [probCode, probLink] = await Codechef.fetchRandomProblem();
        msg.reply(`You have 1 minutes! Submit a code to the below question. It doesn't have to be correct just submit.\n${probLink}`);

        setTimeout(async () => {
            try {
                const submissionTime = await Codechef.getLatestSubmissionDate(username, probCode);
                const timeDiff = new Date().getTime() - submissionTime.getTime();


                if (timeDiff <= 6 * 60 * 1000) {
                    msg.reply(`You are now verified for Codechef user: ${username}!\nYour role will be added soon.`);

                    if (msg.member) {
                        this._setMemberHandle(msg.member, username);
                        this._updateRole(msg.member, username);
                    }
                } else {
                    msg.reply('Failed to verify your codechef account. You can try again.');
                }
            } catch (e) {
                msg.reply('Something went wrong please try again. :)');
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
            .addField('`!cc connect <username>`', 'Gives you codechef star role.')
            .addField('`!cc prob [school|easy|medium|hard|challenge]`', 'Fetches random problem based on given difficulty.')
            .addField('`!cc sub <submission_id>`', 'Fetches source code of submission.')
            .addField('`!cc user <username>`', 'Prints user information.')
            .setTitle('Help!');
        msg.channel.send(embed);
    }

    private async _setMemberHandle(member: GuildMember, username: string): Promise<void> {
        const profile = await this._client.getMemberInfo(member);
        if (profile) {
            profile.ccUsername = username;
            this._client.setMemberInfo(member, profile);
        }
    }

    private async _updateRole(member: GuildMember, username: string): Promise<void> {
        const cfProfile = await Codechef.getUserInfo(username);
        const roleName = `Codechef ${cfProfile.stars}★`;
        if (this._hasRole(member, roleName)) {
            return;
        }

        const reg = new RegExp(/Codechef/);
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
