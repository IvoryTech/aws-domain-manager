const { AssumeRoleCommand, STSClient } = require("@aws-sdk/client-sts");

const stsClient = new STSClient({});

const AssumeRoleName = "InfrastructureDeploymentRole";

const getAssumeRoleCredentials = async (accountId, roleName) => {
  const stsResponse = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: `arn:aws:iam::${accountId}:role/${roleName}`,
      RoleSessionName: accountId
    })
  );
  return {
    accessKeyId: stsResponse.Credentials.AccessKeyId,
    secretAccessKey: stsResponse.Credentials.SecretAccessKey,
    expiration: stsResponse.Credentials.Expiration,
    sessionToken: stsResponse.Credentials.SessionToken
  };
};

module.exports = { getAssumeRoleCredentials, AssumeRoleName };