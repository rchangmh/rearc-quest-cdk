import * as cdk from '@aws-cdk/core'
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns'
import * as ecs from '@aws-cdk/aws-ecs'
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as r53 from '@aws-cdk/aws-route53'

interface RearcQuestStackProps extends cdk.StackProps {
  hostedZoneId: string
  zoneName: string
  subdomainName: string
  dockerPath: string
  dockerPort: number
  secretWord?: string
}

export class RearcQuestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: RearcQuestStackProps) {
    super(scope, id, props)

    const domainZone = r53.HostedZone.fromHostedZoneAttributes(this, 'zone', { 
      hostedZoneId: props.hostedZoneId,
      zoneName: props.zoneName,
    })

    const domainName = `${props.subdomainName}.${props.zoneName}`
    
    const certificate = new acm.Certificate(this, 'certificate', {
      domainName,
      validation: acm.CertificateValidation.fromDns(domainZone)
    })
    
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(props.dockerPath),
        environment: props.secretWord 
          ? { SECRET_WORD: props.secretWord }
          : undefined,
        containerPort: props.dockerPort,
      },
      domainZone,
      domainName,
      certificate,
    })
      
  }
}
