import { Message, Collection } from 'discord.js';
import { Command } from './command';

interface ICommand {
    aliases: string[];
    name: string;
    description: string;
    usage: string;

    run(msg: Message, args: string[]): void;
    init(): void;
}

interface IBitBot {
    getCommands(): Collection<string, Command>;
    loadCommand(dir: string, file: string): void;
}

interface ICCUserInfo {
    username: string;
    name: string;
    stars: number;
    rating: number;
    maxRating: number;
    iconURL: string;
    colorCode: string;
    link: string;
}

interface ICFUserInfo {
    handle: string;
    name: string;
    rank: string;
    maxRank: string;
    rating: number;
    maxRating: number;
    iconURL: string;
    colorCode: string;
    link: string;
}

export { ICommand, IBitBot, ICCUserInfo, ICFUserInfo };
