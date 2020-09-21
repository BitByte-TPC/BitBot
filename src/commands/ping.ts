import { Message } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';

class Ping extends Command{
    constructor(client: BitBot){
        super(client);
        this.name = 'ping';
        this.description = 'Hello world command';
        this.usage = '`!ping`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        msg.reply('Pong!');
    }
}

export = Ping;
