import { App } from "@aws-cdk/core";

import { StandardDevBoxStack, DevInstance } from 'cdk-lib-ec2'

new StandardDevBoxStack(new App(), 'dev-box', {
  sshKeyName: 'ashatch-aws',
  instanceType: DevInstance.T2_MICRO,
  diskSpaceGb: 50
});
