import { ICommand } from './types';
import { Message } from 'discord.js';
import { BitBot } from './bitBot';

export class Command implements ICommand {
    protected _client: BitBot;
    public aliases: string[];
    public name: string;
    public description: string;
    public usage: string;

    constructor(client: BitBot) {
        this._client = client;
        this.aliases = [];
        this.name = '';
        this.description = '';
        this.usage = '';
    }

    public async run(msg: Message, args: string[]): Promise<void> { }
    public init(): void { }

    protected _sendUsges(msg: Message): void {
        msg.reply(this.usage);
    }
}
