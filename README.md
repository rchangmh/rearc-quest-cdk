# Rearc Quest CDK

Quest is deployed using AWS CDK. The following was done to deploy the Quest application:
1. Created a CDK repository and added the application to `/quest`.
2. Added `/quest/Dockerfile`.
3. Built and ran image locally.
    ```bash
    docker build -t quest ./quest
    docker run -p 3000:3000 <image_id>
    ```
4. Used AWS Certificate Manager to generate TLS certificate and imported existing DNS zone to validate.
5. Used the `ApplicationLoadBalancedFargateService` construct to deploy preconfigured load balanced Fargate service.
    * `ContainerImage.fromAsset()` handles building the image from a Dockerfile.
    * AWS Fargate's latest uses platform version (v1.4.0) uses Amazon Linux 2: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
    * With `domainZone`, `domainName`, and `certificate`, the construct creates an A record in Route53 and associates load balancer with ACM cert.
6. Parameterized inputs and moved account info and secrets to `/secrets.json`; added file to `/.gitignore`.
7. To deploy, add `/secrets.json` file with `cdk.Environment` record:
    ```bash
    npm install
    npm run build
    cdk deploy --profile <profile_name>
    ```
