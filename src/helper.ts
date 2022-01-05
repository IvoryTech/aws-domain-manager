import { AssumeRoleCommand, STSClient } from "@aws-sdk/client-sts";

const stsClient = new STSClient({});

export const AssumeRoleName = "InfrastructureDeploymentRole";

export const getAssumeRoleCredentials = async (accountId: string, roleName: string) => {
  const stsResponse = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: `arn:aws:iam::${accountId}:role/${roleName}`,
      RoleSessionName: accountId
    })
  );
  return {
    accessKeyId: stsResponse.Credentials!.AccessKeyId!,
    secretAccessKey: stsResponse.Credentials!.SecretAccessKey!,
    expiration: stsResponse.Credentials!.Expiration!,
    sessionToken: stsResponse.Credentials!.SessionToken!
  };
};
