#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleProcess } from "./handleProcess";

export interface IArgs {
  domainName: string;
  dnsName?: "CloudFront" | string;
  domainAccountId?: string;
  roleName?: string;
  clearCache?: "true";
}

const argv = yargs(hideBin(process.argv)).argv as unknown as IArgs;

if (!argv.domainName) {
  throw new Error("Missing domainName");
}

if (!argv.dnsName && !argv.clearCache) {
  throw new Error("No action defined. Either dnsName or clearCache needs to be defined.");
}

if (argv.clearCache && argv.clearCache !== "true") {
  throw new Error("Wrong input for cleanCache, only input true if you want to take the action.");
}

if ((argv.roleName && !argv.domainAccountId) || (!argv.roleName && argv.domainAccountId)) {
  throw new Error("Args roleName needs to be used together with domainAccountId.");
}

(async () => {
  try {
    await handleProcess(argv);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
