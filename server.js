const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();

const config = {
    "token": process.env.TOKEN,
    "prefix":"-",
    "ownerID" : "get-thepacket"
};

const client = new Discord.Client();
client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap(); // make a map for command => command file path

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

app.listen(process.env.PORT);
client.login(config.token);
