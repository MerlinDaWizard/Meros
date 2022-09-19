const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { pathToUserData } = require('../config.json');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changevoice')
		.setDescription('Changes the /speak commands language for user')
		.addStringOption(option =>
			option.setName('language')
				.setDescription('Different languges')
				.setRequired(true)
				.addChoices(
					{ name: 'Afrikaans', value: 'af' },
					{ name: 'Albanian', value: 'sq' },
					{ name: 'Chinese', value: 'zh' },
					{ name: 'Danish', value: 'da' },
					{ name: 'English', value: 'en' },
					{ name: 'English (Australia)', value: 'en-au' },
					{ name: 'English (United Kingdom)', value: 'en-uk' },
					{ name: 'English (United States)', value: 'en-us' },
					{ name: 'French', value: 'fr' },
					{ name: 'Latvian', value: 'lv' },
				)),
	async execute(interaction) {
		const pathToFile = path.join(__dirname, '..', pathToUserData);
		const rawdata = fs.readFileSync(pathToFile);
		const dataJson = JSON.parse(rawdata);
		
		const memberID = interaction.member.id;
		const memberPreference = interaction.options.getString('language');

		dataJson[memberID] = {
			ttsLanguage: memberPreference,
		};

		fs.writeFile(pathToFile, JSON.stringify (dataJson, null, 4), err => {
			if (err) throw err;
			console.log('Sucesfully updated ', memberID);
		});
		await interaction.reply('Added `' + memberPreference + '` prefernce to ' + interaction.member.displayName);
	},
};