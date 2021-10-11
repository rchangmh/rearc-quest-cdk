#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { RearcQuestStack } from '../lib/rearc-quest-cdk-stack'
import * as secrets from '../secrets.json'

const app = new cdk.App()

new RearcQuestStack(app, 'RearcQuestCdkStack', { 
  env: secrets.personalEnv,
  hostedZoneId: 'Z03304211EX845FJI16N9',
  zoneName: 'cdk.link',
  subdomainName: 'rearc',
  dockerPath: './quest',
  dockerPort: 3000,
  secretWord: secrets.secretWord,
})
