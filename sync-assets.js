const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const path = require("path");
const request = require("request");

const urlExists = (url) =>
  new Promise((resolve, reject) =>
    request
      .head(url)
      .on("response", (res) => resolve(res.statusCode.toString()[0] === "2"))
  );

console.log("Downloading assets");
const assets = [
  "https://dih.bosc.lv/statistical-predictions/assets/vidzeme.json",
  "https://dih.bosc.lv/statistical-predictions/assets/administrativas_teritorijas_2021_2.json",
  "https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4326/20M/nutsrg_2.json",
  "https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4326/20M/nutsrg_3.json"
];

var dir = __dirname + '/assets';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}
(async () => {
  for (let a of assets) {
    const fileName = path.basename(a);
    const targetFilePath = `assets/${fileName}`;
    if (fs.existsSync(targetFilePath)){
        console.log(`${targetFilePath} exists. Skipping..`)
        continue;
    }
    if ((await urlExists(a))) {
      const file = fs.createWriteStream(targetFilePath);
      https.get(a, function (response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Download ${a} Completed`);
        });
      });
    } else {
      console.log(`${a} doesn't exist`);
    }
  }
})();
