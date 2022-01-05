const { createDomain } = require("src/createDomain");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const argv = (yargs(hideBin(process.argv)).argv)
console.log(argv);

if (!argv.dnsName) {
    throw new Error("Missing dnsName");
}

if (!argv.domainName) {
    throw new Error("Missing domainName");
}

(async() => {
   await createDomain(argv);
})()
