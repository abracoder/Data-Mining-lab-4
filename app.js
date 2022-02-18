const express = require('express');
const formidable = require('formidable');
const app = express();
const fs = require('fs')
const cp = require('child_process');
// sendMailWithAttachments - smwatt
const smwatt = require('./mail.js');

app.get('/', (req, res) => {
  res.send(`
    <h2>Data Mining Lab Assignment 4</h2>
    <form action="/submit-files" enctype="multipart/form-data" method="post">
      <div>Your email: <input type="text" name="email" /></div>
      <div>CSV Files: <input type="file" name="csvfiles" multiple="multiple" accept=".csv" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post('/submit-files', (req, res) => {
  const form = formidable({ multiples: true, uploadDir: `${__dirname}/tmp`});
  form.parse(req, async (err, fields, files) => {
    const email = fields.email;
    const tmpdir = `${__dirname}/${fields.email}`;
    if(err) {
      return res.sendStatus(500);
    }
    fs.rmSync(tmpdir, { recursive: true, force: true });
    fs.mkdirSync(tmpdir, { recursive: true });

    let csvfiles = files.csvfiles;
    let tmpfiles = [];
    // convert from object to array
    if(!Array.isArray(csvfiles)){
      tmpfiles.push(csvfiles);
      csvfiles = tmpfiles;
    }

    let spaceSeperatedCSVFilenames = '';
    csvfiles.forEach((file) => {
        fs.renameSync(file.filepath, `${tmpdir}/${file.originalFilename}`);
        spaceSeperatedCSVFilenames += ' ' + file.originalFilename;
    })

    try{
      cp.execSync('python ../extractFeatures.py ' + spaceSeperatedCSVFilenames, {cwd: tmpdir});
      let info = await smwatt(email, res)
      console.log(info);
      res.send(`Successfully sent files to ${email}`);
    }catch(err){
      res.sendStatus(500);
      console.log(err)
    }
    fs.rmSync(`${tmpdir}`, { recursive: true, force: true });
  })
})

app.listen(3000, () => {
  console.log(`server started listening on port 3000`);
})
