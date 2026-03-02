const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb';
const dir = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(path.join(dir, 'porsche.glb'));
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close();
        console.log("Download complete");
    });
}).on('error', function (err) {
    fs.unlink(path.join(dir, 'porsche.glb'));
    console.error("Error downloading file: ", err.message);
});
