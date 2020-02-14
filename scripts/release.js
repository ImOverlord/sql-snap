const execSync = require("child_process").execSync;
const path = require("path");
let package;

/** Searches for package.json */
if (process.argv.length >= 3) {
    try {
        package = require(process.argv[2]);
    } catch (e) {
        package = require(path.join(process.cwd(), process.argv[2]));
    }
} else {
    package = require(path.join(process.cwd(), "package.json"));
}

const version = package.version;
const name    = package.name;

/** Publishes Package */
console.log(`Publishing ${name}@${version}`);
console.log(`Adding latest tag`);
execSync(`npm dist-tag add ${name}@${version} latest`);
console.log(`Removing beta tag`);
execSync(`npm dist-tag rm ${name}@${version} beta`);
console.log(`${name}@${version} was published`);