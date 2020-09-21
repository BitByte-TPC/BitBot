import fetch from 'node-fetch';
import { Message } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';

export = class extends Command {
    constructor(client: BitBot) {
        super(client);
        this.name = 'xkcd';
        this.description = 'Fetches random image from xkcd comics.';
        this.usage = '`!xkcd`';
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        // See https://xkcd.com/json.html

        const base = await fetch('https://xkcd.com/info.0.json').then(res => res.json());
        const latestComicNo: number = base.num || 2000;
        const randomComicNo = Math.round(Math.random() * latestComicNo);
        const comic = await fetch(`https://xkcd.com/${randomComicNo}/info.0.json`).then(res => res.json());
        msg.channel.send(comic.alt, {
            files: [comic.img]
        });
    }
};
