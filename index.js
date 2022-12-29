const fs = require('fs');
const resizeImg = require('resize-img');
const gifResize = require('@gumlet/gif-resize');
const { name, icon, pathName } = require('./repoData');
const emotesFolder = `./${pathName}/`;
let stickerFolder = undefined;
const webp = require('webp-converter');

webp.grant_permission();

let emotesFileData = {}
let whatsAppStickersData = {}

emotesFileData = {
	name: name,
	icon: icon,
	path: pathName,
	emotes: [],
	stickers: []
};

whatsAppStickersData = {
	identifier: "com.llsc12.Nitroless",
	name: name,
	tray_image: fs.readFileSync(`./${icon}`, {encoding: 'base64'}),
	stickers: []
};

// check if repoData.js has author defined
let data = require('./repoData.js');
if (data['author'] !== null && data['author'] !== undefined && 'author' in data) {
	emotesFileData.author = data.author;
	whatsAppStickersData.publisher = data.author;
}

if (data['description'] !== null && data['description'] !== undefined && 'description' in data) {
	emotesFileData.description = data.description;
}

if (data['keywords'] !== null && data['keywords'] !== undefined && 'keywords' in data) {
	emotesFileData.keywords = data.keywords;
}

if (data['stickerPath'] !== null && data['stickerPath'] !== undefined && 'stickerPath' in data) {
	stickerFolder = `./${data.stickerPath}/`;
	emotesFileData.stickerPath = data.stickerPath;
}

const pngToIco = require('png-to-ico');

pngToIco(icon).then(buf => {
    fs.writeFileSync('favicon.ico', buf);
}).catch(console.error);

if (stickerFolder !== undefined) {
	fs.readdir(stickerFolder, (err, files) => {
		if (err) console.error(err.message);

		console.log(files);

		files.forEach(async (file) => {
			let sticker = {
				name: file.split('.')[0],
				type: file.split('.')[1]
			};

			if (sticker.type != 'webp') {
				try {
					if(file.split('.')[1] === 'jpg') {
						const image = await resizeImg(fs.readFileSync(stickerFolder + file), {
							width: 512
						});
		
						fs.writeFileSync(stickerFolder + file, image);
						console.log(file + ' JPG Image Resized');
					}
					if (file.split('.')[1] === 'png') {
						const image = await resizeImg(fs.readFileSync(stickerFolder + file), {
							width: 512
						});
		
						fs.writeFileSync(stickerFolder + file, image);
						console.log(file + ' PNG Image Resized');
					} 
					if(file.split('.')[1] === 'gif') {
						const gifImage = await gifResize({ width: 512 })(
							fs.readFileSync(stickerFolder + file)
						);
		
						fs.writeFileSync(stickerFolder + file, gifImage);
						console.log(file + ' GIF Image Resized');
					}
				} catch (error) {
					console.error(error.message);
				}
				
				let result;
				if (sticker.type == 'gif') {
					result = webp.gwebp(`${stickerFolder}${sticker.name}.${sticker.type}`, `${stickerFolder}${sticker.name}.webp`, "-q 80",logging="-v");
				} else {
					result = webp.cwebp(`${stickerFolder}${sticker.name}.${sticker.type}`, `${stickerFolder}${sticker.name}.webp`, "-q 80", logging="-v");
				}
				result.then((response) => {
					console.log("response",response);
				});
			}
			if(sticker.name.length > 0) {
				emotesFileData.stickers.push({name: sticker.name, type: 'webp'});
				let stickerData = fs.readFileSync(stickerFolder + file, {encoding: 'base64'})
				whatsAppStickersData.stickers.push({
					image_data: stickerData,
					emojis: []
				})
			}
		})
	})
}

fs.readdir(emotesFolder, (err, files) => {
	if (err) console.error(err.message);

	files.forEach(async (file) => {
		let emote = {
			name: file.split('.')[0],
			type: file.split('.')[1]
		};

		if(file.split('.')[0] === icon.split('.')[0]) {
			return;
		}

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
			} 
			if(file.split('.')[1] === 'gif') {
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

	fs.writeFile('whatsapp.json', JSON.stringify(whatsAppStickersData), 'utf8', (err) => {
		if (err) {
			console.error(err);
		}
		console.log('\whatsapp.json was made');
	});
});