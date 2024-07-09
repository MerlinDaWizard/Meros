const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const pathUserData = path.join(process.env.DATA_DIRECTORY, 'userData.json');

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
            		{ name: 'Armenian', value: 'ca' },
            		{ name: 'Catalan', value: 'zh' },
					{ name: 'Chinese', value: 'zh' },
            		{ name: 'Dutch', value: 'cs' },
					{ name: 'Danish', value: 'da' },
            		{ name: 'German', value: 'de' },
					{ name: 'English', value: 'en' },
					{ name: 'English (Australia)', value: 'en-au' },
					{ name: 'English (United Kingdom)', value: 'en-uk' },
					{ name: 'English (United States)', value: 'en-us' },
					{ name: 'French', value: 'fr' },
					{ name: 'Latvian', value: 'lv' },
                    { name: 'Icelandic', value: 'is' },
                    { name: 'Indonesian', value: 'id' },
                    { name: 'Italian', value: 'it' },
                    { name: 'Latin', value: 'la' },
                    { name: 'Polish', value: 'pl' },
                    { name: 'Portuguese', value: 'pt' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Spanish', value: 'es' },
                    { name: 'Turkish', value: 'tr' },
                    { name: 'Welsh', value: 'cy' },
				)),
	async execute(interaction) {
		const rawdata = fs.readFileSync(pathUserData);
		const dataJson = JSON.parse(rawdata);
		
		const memberID = interaction.member.id;
		const memberPreference = interaction.options.getString('language');

		dataJson[memberID] = {
			ttsLanguage: memberPreference,
		};

		fs.writeFile(pathUserData, JSON.stringify (dataJson, null, 4), err => {
			if (err) throw err;
			console.log('Sucesfully updated ', memberID);
		});
		await interaction.reply('Added `' + memberPreference + '` prefernce to ' + interaction.member.displayName);
	},
};