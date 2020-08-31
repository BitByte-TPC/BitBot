import path from 'path';
import fs from 'fs';
import { BitBot } from './base/bitBot';

const client = new BitBot({});

const init = (): void => {
    const commandsDir = path.join(__dirname, 'commands');

    fs.readdirSync(commandsDir).forEach(file => {
        if (!file.endsWith('.js')) return;
        client.loadCommand(commandsDir, file);
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
};

init();
