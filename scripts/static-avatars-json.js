#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const fetch = require('window-fetch');
const sharp = require('sharp');

const SIZE = 192;
const p = path.join(__dirname, '..', 'avatar-models.json');
fs.readFile(p, 'utf8', async (err, s) => {
  if (!err) {
    try {
      const avatarModels = JSON.parse(s);

      for (let i = 0; i < avatarModels.length; i++) {
        const avatar = avatarModels[i];
        const {icon} = avatar;
        
        let b = fs.readFileSync(icon);
        b = await sharp(b)
          .resize(SIZE, SIZE, {
            fit: 'inside',
          })
          .png()
          // .jpeg()
          .toBuffer();
        avatar.icon = 'data:image/png;base64,' + b.toString('base64');
        // avatar.icon = 'data:image/jpeg;base64,' + b.toString('base64');

        await new Promise((accept, reject) => {
          const s = JSON.stringify(avatarModels, null, 2);

          fs.writeFile(p, s, err => {
            if (!err) {
              accept();
            } else {
              reject(err);
            }
          });
        });
      }
    } catch(err) {
      console.warn(err.stack);
    }
  } else {
    console.warn(err.stack);
  }
});
