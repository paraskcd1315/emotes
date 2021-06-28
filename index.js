const emotesFolder = './emotes/';
const fs = require('fs');
const resizeImg = require('resize-img');
const gifResize = require('@gumlet/gif-resize');
const { name, pathName } = require('./repoData');

let emotesFileData = {
	name: name,
	path: pathName,
	emotes: []
};

fs.readdir(emotesFolder, (err, files) => {
	if (err) console.error(err.message);

	files.forEach(async (file) => {
		let emote = {
			name: file.split('.')[0],
			type: '.' + file.split('.')[1]
		};

		emotesFileData.emotes.push(emote);

		if (file.split('.')[1] === 'png') {
			try {
				const image = await resizeImg(fs.readFileSync(emotesFolder + file), {
					width: 48
				});

				fs.writeFileSync(emotesFolder + file, image);
				console.log(file + ' PNG Image Resized');
			} catch (err) {
				console.error(err.message);
			}
		} else {
			try {
				gifResize({
					width: 48
				})(fs.readFileSync(emotesFolder + file)).then((data) => {
					fs.writeFileSync(emotesFolder + file, data);
					console.log(file + ' GIF Image Resized');
				});
			} catch (error) {
				console.error(err.message);
			}
		}
	});

	fs.writeFile('index.json', JSON.stringify(emotesFileData), 'utf8', (err) => {
		if (err) {
			console.error(err);
		}
		console.log('\nindex.json was made');
	});
});
