import {
  CloudFrontClient,
  CreateInvalidationCommand,
  DistributionSummary,
  GetInvalidationCommand,
  ListDistributionsCommand,
  ListDistributionsCommandOutput
} from "@aws-sdk/client-cloudfront";
import { getAssumeRoleCredentials } from "./assumeRole";
import { sleep } from "./helper";

export const getDistributionDomain = async (dnsName: string) => {
  const client = new CloudFrontClient({
    credentials: await getAssumeRoleCredentials("354779776771", "InfrastructureDeploymentRole")
  });

  let distributions: DistributionSummary[] = [];
  let marker: string | undefined;
  let data: ListDistributionsCommandOutput;
  do {
    data = await client.send(
      new ListDistributionsCommand({
        Marker: marker
      })
    );
    distributions = distributions.concat(
      (data.DistributionList?.Items || []).filter((x) => x.Aliases?.Items?.includes(dnsName))
    );
    marker = data.DistributionList?.NextMarker;
  } while (data.DistributionList?.IsTruncated);

  if (distributions.length === 0) {
    throw new Error(`Distribution matching domain "${dnsName}" was not found.`);
  }

  Promise.all(
    distributions.map(async (distribution) => {
      const invalidation = await client.send(
        new CreateInvalidationCommand({
          DistributionId: distribution.Id,
          InvalidationBatch: {
            Paths: {
              Quantity: 1,
              Items: ["/*"]
            },
            CallerReference: new Date().getTime().toString()
          }
        })
      );
      await verifyInvalidation(distribution.Id!, invalidation.Invalidation!.Id!, client);
      console.info(`Cache invalidation for ${distribution.DomainName} is completed.`);
    })
  );
};

const verifyInvalidation = async (
  distributionId: string,
  invalidationId: string,
  client: CloudFrontClient
) => {
  const res = await client.send(
    new GetInvalidationCommand({
      DistributionId: distributionId,
      Id: invalidationId
    })
  );
  if (res.Invalidation?.Status === "Completed") {
    return;
  }
  await sleep(1000);
  await verifyInvalidation(distributionId, invalidationId, client);
};

getDistributionDomain("dev.ivorytech.com.au");
