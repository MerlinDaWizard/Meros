const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const pathToGuildData = path.join(process.env.DATA_DIRECTORY, 'guildData.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prefix')
		.setDescription('Changes gTTS text to speech prefix for guild')
		.addStringOption(option =>
			option.setName('prefix')
				.setDescription('What should the message start with.')
				.setRequired(true)),
	async execute(interaction) {
		const rawdata = fs.readFileSync(pathToGuildData);
		const dataJson = JSON.parse(rawdata);
		
		const guildID = interaction.guild.id;
		const guildPrefix = interaction.options.getString('prefix');

		dataJson[guildID] = {
			prefix: guildPrefix,
		};

		fs.writeFile(pathToGuildData, JSON.stringify (dataJson, null, 4), err => {
			if (err) throw err;
			console.log('Sucesfully updated ', guildID);
		});
		await interaction.reply('Added `' + guildPrefix + '` prefix to ' + interaction.guild.name);
	},
};