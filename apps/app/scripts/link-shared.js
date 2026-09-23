const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", "..", "..", "packages", "shared");
const link = path.join(__dirname, "..", "node_modules", "@preparea", "shared");

function makeJunction() {
  fs.mkdirSync(path.dirname(link), { recursive: true });
  fs.symlinkSync(target, link, "junction");
  console.log("Linked @preparea/shared -> " + target);
}

if (!fs.existsSync(link)) {
  try {
    makeJunction();
  } catch (err) {
    if (!["EPERM", "EEXIST"].includes(err.code)) throw err;
  }
} else if (fs.existsSync(path.join(link, "package.json"))) {
  console.log("@preparea/shared already linked at " + link);
} else {
  fs.rmSync(link, { recursive: true, force: true });
  makeJunction();
}