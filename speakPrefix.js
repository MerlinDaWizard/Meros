/* eslint-disable no-inline-comments */
// eslint-disable-next-line no-unused-vars
const { createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, createAudioResource, generateDependencyReport } = require('@discordjs/voice');
const gTTS = require('gtts');
const path = require('path');
const fs = require('fs');

const { pathToUserData } = require('./config.json');
const pathData = path.join(__dirname, pathToUserData);

let leaveTimer = null;

// eslint-disable-next-line no-unused-vars
module.exports = {
	func: function speakPrefix(message, speech) {
		// console.log(generateDependencyReport());
		// Chek userData.json file for voice nationality
		const preference = CheckPreference(message.member.id);

		// Get voice channel id and check if they are in one
		const voiceChannel = message.member.voice.channelId;
		if (!voiceChannel) return;
        if (isEmptyOrSpaces(speech)) return;

		// Create voiceConnection
		const VoiceConnection = joinVoiceChannel({
			channelId: voiceChannel, // the voice channel's id
			guildId: message.guildId, // the guild that the channel is in
			adapterCreator: message.guild.voiceAdapterCreator, // and setting the voice adapter creator
		});
		// Settup text to speech
		const gtts = new gTTS(speech, preference);

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
			message.channel.send('Idling too long bye. :wave: ');
			VoiceConnection.disconnect();
			}, 10 * 60 * 1000);
		});

		audioPlayer.on('error', error => {
			console.error('Error:', error.message, 'with track', error.resource.metadata.title);
		});


		VoiceConnection.subscribe(audioPlayer);
		// play the song resource
		audioPlayer.play(resource);
	}
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

function isEmptyOrSpaces(str){
    return Boolean(str.trim());
}