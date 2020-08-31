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

export { ICommand, IBitBot };
