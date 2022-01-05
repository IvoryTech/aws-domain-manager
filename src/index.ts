import { createDomain } from "./createDomain.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface IArgs {
    domainName: string,
    dnsName: "CloudFront" | string,
    domainAccountId?: string,
    roleName?: string
}

const argv = (yargs(hideBin(process.argv)).argv) as unknown as IArgs
console.log(argv);

if (!argv.dnsName) {
    throw new Error("Missing dnsName");
}

if (!argv.domainName) {
    throw new Error("Missing domainName");
}

await createDomain(argv);