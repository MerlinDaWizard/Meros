const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { pathToGuildData } = require('../config.json');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prefix')
		.setDescription('Changes gTTS text to speech prefix for guild')
		.addStringOption(option =>
			option.setName('prefix')
				.setDescription('What should the message start with.')
				.setRequired(true)),
	async execute(interaction) {
		const pathToFile = path.join(__dirname, '..', pathToGuildData);
		const rawdata = fs.readFileSync(pathToFile);
		const dataJson = JSON.parse(rawdata);
		
		const guildID = interaction.guild.id;
		const guildPrefix = interaction.options.getString('prefix');

		dataJson[guildID] = {
			prefix: guildPrefix,
		};

		fs.writeFile(pathToFile, JSON.stringify (dataJson, null, 4), err => {
			if (err) throw err;
			console.log('Sucesfully updated ', guildID);
		});
		await interaction.reply('Added `' + guildPrefix + '` prefix to ' + interaction.guild.name);
	},
};