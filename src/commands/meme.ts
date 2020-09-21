import fetch from 'node-fetch';
import { Message } from 'discord.js';
import { Command } from '../base/command';
import { BitBot } from '../base/bitBot';

export = class extends Command {
    private _data: string[];

    constructor(client: BitBot) {
        super(client);
        this.name = 'meme';
        this.description = 'Memes form r/programmerHumor :)';
        this.usage = '`!meme`';
        this._data = [];
    }

    public async run(msg: Message, args: string[]): Promise<void> {
        // https://www.reddit.com/r/ProgrammerHumor/hot.json
        const url = await this._getMeme() || '';
        msg.channel.send('', {
            files: [url]
        });
    }

    private async _fetchData(): Promise<void> {
        const base = await fetch('https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=100').then(res => res.json());
        const collection = base.data.children;

        collection.forEach((e: any) => {
            const url: string = e.data.url_overridden_by_dest;
            if (url && url !== '') {
                this._data.push(url);
            }
        });

        setTimeout(()=>{
            this._data = [];
        }, 1000*60*60*24); // 1 day
    }

    private async _getMeme(): Promise<string | undefined> {
        if (this._data.length < 1) {
            await this._fetchData();
        }
        return this._data.shift();
    }
};
