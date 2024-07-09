const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

if (process.argv.slice(2).length < 1) {
	console.log('Please specify a guilds as arguments');
	console.log('eg. node .\\deploy-commands.js 947111111184613100 992070000004817900');
	return;
}

const guilds = process.argv.slice(2);
console.log('Deploying commands in ' + guilds.length + ' guild(s)');

guilds.forEach(guildId => {
	rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
});
