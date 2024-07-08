# CDK Lambda APIGW RDS

This is a demo showing how to deploy a TypeScript Lambda with CRUD functionality behind an API Gateway (HTTP API), backed by an RDS database instance (accessed with RDS Proxy). DB credentials are managed by Secrets Manager and accessed via "AWS Parameters and Secrets Lambda Extension"

## Prerequisites

- Docker
- Node 18+
- awscli


## Installation

1. Clone this repository

2. Install NPM dependencies

`npm install`


## Deploy

1. Deploy Network Stack

`cdk deploy NetworkStack`

2. Deploy DB Stack

`cdk deploy DbStack`

2. Deploy API Stack

`cdk deploy ApiStack`
