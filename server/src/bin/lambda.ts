import { createServer, proxy } from 'aws-serverless-express';
// Import API gateway event and context types from @types/aws-lambda, for sone
// they can't be imported with full name
// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import app from '..';


const server = createServer(app);

/**
 * Export named lambda handler
 *
 * @param event
 * @param context
 */
// eslint-disable-next-line import/prefer-default-export
export const handler = (event: APIGatewayProxyEvent, context: Context): void => {
  proxy(server, event, context);
};
