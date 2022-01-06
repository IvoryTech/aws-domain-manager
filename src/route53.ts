import {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  ListHostedZonesCommand
} from "@aws-sdk/client-route-53";
import { getAssumeRoleCredentials } from "./assumeRole";

const SYDNEY_ALB_HOSTED_ZONE_ID = "Z1GM3OXH4ZPM65";
const CLOUDFRONT_HOSTED_ZONE_ID = "Z2FDTNDATAQYW2";

export const createDomainRecord = async ({
  domainName,
  dnsName,
  domainAccountId,
  roleName
}: {
  domainName: string;
  dnsName: string;
  domainAccountId?: string;
  roleName?: string;
}) => {
  let aliasHostZoneId = "";
  if (dnsName?.includes("cloudfront.net")) {
    aliasHostZoneId = CLOUDFRONT_HOSTED_ZONE_ID;
  }
  if (dnsName?.includes("elb.amazonaws.com")) {
    aliasHostZoneId = SYDNEY_ALB_HOSTED_ZONE_ID;
  }

  const route53Client = new Route53Client({
    credentials:
      domainAccountId && roleName
        ? await getAssumeRoleCredentials(domainAccountId, roleName)
        : undefined
  });

  const hostedZoneId = (await route53Client.send(new ListHostedZonesCommand({}))).HostedZones?.find(
    (x) => x.Name?.includes(domainName.split(".").slice(1).join("."))
  )?.Id;

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
};
