/* eslint-disable no-inline-comments */
const { SlashCommandBuilder } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, createAudioResource, generateDependencyReport } = require('@discordjs/voice');
const gTTS = require('gtts');
const path = require('path');
const fs = require('fs');

const { pathToUserData } = require('../config.json');
const pathData = path.join(__dirname, '..', pathToUserData);

let leaveTimer = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('Speaks What you say')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('Here is what to say!')
				.setRequired(true)),
	async execute(interaction) {
		
		// console.log(generateDependencyReport());
		// Chek userData.json file for voice nationality
		const preference = CheckPreference(interaction.member.id);

		// Get voice channel id and check if they are in one
		const voiceChannel = interaction.member.voice.channelId;
		if (!voiceChannel) {
			await interaction.reply('Please join a voice channel.'); 
			return;
		}

		// Create voiceConnection
		const VoiceConnection = joinVoiceChannel({
			channelId: voiceChannel, // the voice channel's id
			guildId: interaction.guildId, // the guild that the channel is in
			adapterCreator: interaction.guild.voiceAdapterCreator, // and setting the voice adapter creator
		});

		// Get Message
		const speech = interaction.options.getString('text');
		// Settup text to speech
		const gtts = new gTTS(speech, preference);


		/* gtts.save(absolutePath, function (err, result){
			if(err) { throw new Error(err); }
			console.log("\""+speech+"\""+" Converted!");
		});*/

		const audioPlayer = createAudioPlayer();
		const resource = createAudioResource(gtts.stream());


		audioPlayer.on(AudioPlayerStatus.Playing, () => {
			console.log('The audio player is playing: ', speech);
				// clear timer before set
				try {
					clearTimeout(leaveTimer);
				}
				catch (e) {
					console.log('Theres no leaveTimer');
				}
		});

		audioPlayer.on(AudioPlayerStatus.Idle, () => {
			leaveTimer = setTimeout(() => {
			interaction.channel.send('Idling too long bye. :wave: ');
			VoiceConnection.disconnect();
			}, 2 * 60 * 1000);
		});

		audioPlayer.on('error', error => {
			console.error('Error:', error.message, 'with track', error.resource.metadata.title);
		});


		VoiceConnection.subscribe(audioPlayer);
		// play the song resource
		audioPlayer.play(resource);

		await interaction.reply(interaction.member.displayName + ': `' + speech + '`');
	},
};

function CheckPreference(id) {
	const rawdata = fs.readFileSync(pathData);
	const userData = JSON.parse(rawdata);
	if (!userData[id]) {

		userData[id] = {
			ttsLanguage: 'en',
		};

		fs.writeFile(pathData, JSON.stringify (userData, null, 4), err => {
			if (err) throw err;
			console.log('Sucesfully updated ', id, 'preference');
		});

		return 'en';
	}
	else {return userData[id].ttsLanguage;}
}
