// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html

const {
  CreateTableCommand,
  DynamoDBClient,
} = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

const clientDB = new DynamoDBClient({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
})

const client = DynamoDBDocumentClient.from(clientDB)

const table = {
  TableName: 'Tracker',
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' },
    { AttributeName: 'SK', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' },
    { AttributeName: 'GSI1PK', AttributeType: 'S' },
    { AttributeName: 'GSI1SK', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI1',
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        WriteCapacityUnits: 2,
        ReadCapacityUnits: 2,
      },
      KeySchema: [
        { AttributeName: 'GSI1PK', KeyType: 'HASH' },
        { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
      ],
    },
  ],
  ProvisionedThroughput: {
    WriteCapacityUnits: 2,
    ReadCapacityUnits: 2,
  },
}

const cmd = new CreateTableCommand(table)
client
  .send(cmd)
  .then((d) => console.log(d))
  .catch((d) => console.error('error', d))
