const fs = require('fs');
const resizeImg = require('resize-img');
const gifResize = require('@gumlet/gif-resize');
const { name, icon, pathName, fullURL } = require('./repoData');
const emotesFolder = `./${pathName}/`;

let emotesFileData = {}

emotesFileData = {
	name: name,
	icon: icon,
	path: pathName,
	fullURL: fullURL,
	emotes: []
};

// check if repoData.js has author defined
let data = require('./repoData.js');
if (data['author'] !== null && data['author'] !== undefined && 'author' in data) {
	emotesFileData.author = data.author;
}

if (data['description'] !== null && data['description'] !== undefined && 'description' in data) {
	emotesFileData.description = data.description;
}

if (data['keywords'] !== null && data['keywords'] !== undefined && 'keywords' in data) {
	emotesFileData.keywords = data.keywords;
}

const pngToIco = require('png-to-ico');

pngToIco(icon).then(buf => {
    fs.writeFileSync('favicon.ico', buf);
}).catch(console.error);

fs.readdir(emotesFolder, (err, files) => {
	if (err) console.error(err.message);

	files.forEach(async (file) => {
		let emote = {
			name: file.split('.')[0],
			type: file.split('.')[1]
		};

		if(file.split('.')[1] === 'jpg' || file.split('.')[1] === 'png' || file.split('.')[1] === 'gif') {
			emotesFileData.emotes.push(emote);
		}

		try {
			if(file.split('.')[1] === 'jpg') {
				const image = await resizeImg(fs.readFileSync(emotesFolder + file), {
					width: 48
				});

				fs.writeFileSync(emotesFolder + file, image);
				console.log(file + ' JPG Image Resized');
			}
			if (file.split('.')[1] === 'png') {
				const image = await resizeImg(fs.readFileSync(emotesFolder + file), {
					width: 48
				});

				fs.writeFileSync(emotesFolder + file, image);
				console.log(file + ' PNG Image Resized');
			} else {
				const gifImage = await gifResize({ width: 48 })(
					fs.readFileSync(emotesFolder + file)
				);

				fs.writeFileSync(emotesFolder + file, gifImage);
				console.log(file + ' GIF Image Resized');
			}
		} catch (error) {
			console.error(error.message);
		}
	});

	fs.writeFile('index.json', JSON.stringify(emotesFileData), 'utf8', (err) => {
		if (err) {
			console.error(err);
		}
		console.log('\nindex.json was made');
	});
});