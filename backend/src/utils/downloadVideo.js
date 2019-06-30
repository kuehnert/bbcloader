const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const file = require('./file');
const ttml2ass = require('./ttml2ass');

process.on('message', ({ msgTyp, config: { downloadDir, downloadCommand, destinationDir }, video: inputVideo }) => {
  console.log('downloadVideo started');

/*if (msgTyp === '') {
https://github.com/ar-comlog/syncrequest
https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js
http://www.acuriousanimal.com/2018/02/15/express-async-middleware.html
https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
}*/

  const video = JSON.parse(JSON.stringify(inputVideo));

  const url = 'https://www.youtube.com/watch?v=H3t6ZXW63c0';
  const args = [
    '--quiet',
    '--sub-lang',
    'en',
    '--write-sub',
    '--output',
    `${downloadDir}/${video.filename}.mp4`,
    process.env.NODE_ENV === 'production' ? video.url : url,
  ];

  try {
    console.log(`Download started: ${video.url}`);
    execFileSync(downloadCommand, args, (log) => {
      process.send('message', log)
    });
    console.log('Download finished successfully');
    video.downloaded = true;
  } catch (error) {
    console.log(error.status); // Might be 127 in your example.
    console.log(error.message); // Holds the message you typically want.
    console.log(error.stderr); // Holds the stderr output. Use `.toString()`.
    console.log(error.stdout); // Holds the stdout output. Use `.toString()`.
    process.send({ video, error });
  }

  // Move downloads into right folder
  const finalDestination = path.join(destinationDir, video.programme);
  file.moveVideo(downloadDir, finalDestination, video.filename, 'mp4');

  // Convert & move subtitle file
  const subFile = path.join(downloadDir, `${video.filename}.en.ttml`);
  const convertedSubFile = path.join(downloadDir, `${video.filename}.en.ass`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Copying fake subtitle file...');

    fs.copyFileSync(path.join(__dirname, '..', '..', 'data', 'demo.en.ttml'), subFile);
  }

  if (fs.existsSync(subFile)) {
    console.log('Converting TTML 2 ASS');
    const ttml = fs.readFileSync(subFile).toString();
    const ass = ttml2ass(ttml, video.episodeTitle);
    fs.writeFileSync(convertedSubFile, ass);
    file.moveVideo(downloadDir, finalDestination, video.filename, 'en.ttml');
    file.moveVideo(downloadDir, finalDestination, video.filename, 'en.ass');
  }

  const message = `Downloaded ${video.url} -> ${path.join(finalDestination, video.filename)}`;
  console.log(message);

  // console.log(JSON.stringify(video));
  process.send({ video });
});
