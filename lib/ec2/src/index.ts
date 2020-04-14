import { Stack, StackProps, Construct, CfnOutput } from "@aws-cdk/core";
import ec2 = require('@aws-cdk/aws-ec2');
import { InstanceType, Vpc, MachineImage } from "@aws-cdk/aws-ec2";

export enum DevInstance {
  T2_MICRO = 't2.micro'
}

export interface StandardDevBoxParams extends StackProps {
  diskSpaceGb: number,
  sshKeyName: string,
  instanceType: DevInstance
}

export class StandardDevBoxStack extends Stack {
  public constructor(scope: Construct, id: string, params: StandardDevBoxParams) {
    super(scope, id, params);

    const vpc = new ec2.Vpc(this, 'DevBox-VPC', {
      maxAzs: 1,
      subnetConfiguration: [{
        name: 'SSH Ingress',
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });

    const devBoxInstance = new ec2.Instance(this, 'Instance', {
      instanceType: new InstanceType(params.instanceType),
      vpc: vpc,
      machineImage: MachineImage.latestAmazonLinux(),
      keyName: params.sshKeyName,
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(params.diskSpaceGb),
        }
      ]
    });

    
    const devBoxSecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true
    });

    devBoxSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(22),
      'allow ssh access from the world'
    );
    
    devBoxInstance.addSecurityGroup(devBoxSecurityGroup);

    new CfnOutput(this, 'hostname', {
      value: devBoxInstance.instancePublicDnsName,
    });
  }
}
