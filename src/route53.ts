import {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  ListHostedZonesCommand
} from "@aws-sdk/client-route-53";
import { getAssumeRoleCredentials } from "./assumeRole.js";
import type { IArgs } from "./index.js";

const SYDNEY_ALB_HOSTED_ZONE_ID = "Z1GM3OXH4ZPM65";
const CLOUDFRONT_HOSTED_ZONE_ID = "Z2FDTNDATAQYW2";

export const createDnsRecord = async ({
  domainName,
  dnsName,
  domainAccountId,
  roleName,
  isPrivate,
  isPublic
}: IArgs) => {
  console.info("Creating DNS record...");
  let aliasHostZoneId = "";
  if (dnsName?.includes("cloudfront.net")) {
    aliasHostZoneId = CLOUDFRONT_HOSTED_ZONE_ID;
  }
  if (dnsName?.includes("elb.amazonaws.com")) {
    aliasHostZoneId = SYDNEY_ALB_HOSTED_ZONE_ID;
  }

  const route53Client = new Route53Client({
    credentials:
      // fromIni({ profile: "default" })
      domainAccountId && roleName
        ? await getAssumeRoleCredentials(domainAccountId, roleName)
        : undefined
  });

  const hostedZoneIds = (await route53Client.send(new ListHostedZonesCommand({}))).HostedZones?.map(
    (x) => {
      if (x.Name?.includes(domainName.split(".").slice(1).join("."))) {
        if (
          (x.Config?.PrivateZone === true && isPrivate === "true") ||
          (x.Config?.PrivateZone === false && isPublic === "true")
        ) {
          return x.Id;
        }
      }
    }
  );

  if (!hostedZoneIds) {
    throw new Error("No DNS found");
  }

  for await (const hostedZoneId of hostedZoneIds) {
    const response = await route53Client.send(
      new ChangeResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: "UPSERT",
              ResourceRecordSet: {
                Name: domainName,
                Type: "A",
                AliasTarget: {
                  DNSName: dnsName,
                  HostedZoneId: aliasHostZoneId,
                  EvaluateTargetHealth: false
                }
              }
            },
            {
              Action: "UPSERT",
              ResourceRecordSet: {
                Name: domainName,
                Type: "AAAA",
                AliasTarget: {
                  DNSName: dnsName,
                  HostedZoneId: aliasHostZoneId,
                  EvaluateTargetHealth: false
                }
              }
            }
          ]
        }
      })
    );
  }
  console.info("Create DNS record completed.");
};
