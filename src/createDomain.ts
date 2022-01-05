import {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  ListHostedZonesCommand
} from "@aws-sdk/client-route-53";
import { getAssumeRoleCredentials } from "./helper.js";

export const createDomain = async (
  {domainName, dnsName, domainAccountId, roleName}:
  {domainName: string, dnsName: "CloudFront" | string, domainAccountId?: string,roleName?: string }
) => {
  const route53Client = new Route53Client({
    credentials: domainAccountId && roleName ? await getAssumeRoleCredentials(domainAccountId, roleName) : undefined });

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
                HostedZoneId: "Z2FDTNDATAQYW2",
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
                HostedZoneId: "Z2FDTNDATAQYW2",
                EvaluateTargetHealth: false
              }
            }
          }
        ]
      }
    })
  );
};