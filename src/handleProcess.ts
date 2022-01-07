import { IArgs } from "src/index.js";
import { getDistributionsByDomain, invalidateCache } from "./cloudFront.js";
import { createDnsRecord } from "./route53.js";

export const handleProcess = async (args: IArgs) => {
  const { dnsName, domainName } = args;
  const distributions =
    dnsName === "CloudFront" ? await getDistributionsByDomain(domainName) : undefined;

  if (dnsName) {
    const route53DnsName =
      dnsName === "CloudFront"
        ? distributions?.find((x) => x.Aliases?.Items?.includes(domainName))?.DomainName
        : dnsName;
    if (!route53DnsName) {
      throw new Error(`No CloudFront distribution found for domain ${domainName}`);
    }
    await createDnsRecord({
      ...args,
      dnsName: route53DnsName
    });
  }
  if (args.clearCache) {
    await invalidateCache(distributions!);
  }
};
