const emotesFolder = './emotes/';
const fs = require('fs');
const { name, pathName } = require('./repoData');

let emotesFileData = {
	name: name,
	path: pathName,
	emotes: []
};

fs.readdir(emotesFolder, (err, files) => {
	if (err) console.error(err.message);
	files.forEach((file) => {
		let emote = {
			name: file.split('.')[0],
			type: '.' + file.split('.')[1]
		};
		emotesFileData.emotes.push(emote);
	});
	fs.writeFile('index.json', JSON.stringify(emotesFileData), 'utf8', (err) => {
		if (err) {
			console.error(err);
		}
		console.log('index.json was made');
	});
});
