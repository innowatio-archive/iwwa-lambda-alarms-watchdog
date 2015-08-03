[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-alarms-watchdog.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-alarms-watchdog)
[![Coverage Status](https://coveralls.io/repos/innowatio/iwwa-lambda-alarms-watchdog/badge.svg?branch=master&service=github)](https://coveralls.io/github/innowatio/iwwa-lambda-alarms-watchdog?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-alarms-watchdog.svg)](https://david-dm.org/innowatio/iwwa-lambda-alarms-watchdog)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-alarms-watchdog/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-alarms-watchdog#info=devDependencies)

# iwwa-lambda-alarms-watchdog

Lambda function to trigger alarms.

## How it works

Kinesis calls the Lambda function with a pod-reading event (e.g.
`/pod-reading/insert`). Alarms are set by pod (for now), so the function
retrieves all alarms of the pod the reading came from. It then checks wether or
not the reading sets off the alarm. In case it does, it triggers the alarm.

## Deployment

### Continuous deployment

Since the project uses TravisCI and
[`lambda-deploy`](https://github.com/innowatio/lambda-deploy/) for continuous
deployment, the following environment variables need to be set:

- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_DEFAULT_REGION`
- `S3_BUCKET`
- `LAMBDA_NAME`
- `LAMBDA_ROLE_ARN`

WARNING: the value of those variables must be kept secret. Do not set them in
the `.travis.yml` config file, only in the Travis project's settings (where they
are kept secret).

### Configuration

The following environment variables are needed to configure the function:

- `ALARMS_DYNAMODB_TABLE_NAME`
- `ALARMS_SNS_TOPIC_ARN`

NOTE: since the project uses `lambda-deploy`, in the build environment (Travis)
we need to define the above variables with their name prefixed by
`__FUNC_CONFIG__`.
