import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiCorsLambdaCrudDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "items", {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      tableName: "items",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      depsLockFilePath: join(__dirname, "lambdas", "package-lock.json"),
      environment: {
        PRIMARY_KEY: "itemId",
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: Runtime.NODEJS_14_X,
    };

    const getOneLambda = new NodejsFunction(this, 'getOneItemFunction', {
      entry: join("../lambdas/get-one.ts"),
      ...nodeJsFunctionProps,
    })

    // dynamoTable.grantReadWriteData(getOneLambda);

    // const getOneIntegration = new LambdaIntegration(getOneLambda);
    // const api = new RestApi(this, 'itemsApi', {
    //   restApiName: 'Items Service'
    // });

    // const items = api.root.addResource('items');

    // const singleItem = items.addResource('{id}');
    // singleItem.addMethod('GET', getOneIntegration);
  }
}
