const fs = require('fs');
const archiver = require('archiver');

const projectName = '海关项目';
const time = new Date().getTime();

const output = fs.createWriteStream(`${__dirname}/${projectName}web前端-${time}.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

output.on('close', function () {
  console.log(`${archive.pointer()} total bytes`);
  console.log('压缩完毕');
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);
archive.directory(`${__dirname}/dist/`, false);
archive.finalize();
