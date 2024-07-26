// Runtime: Node.js 18.x

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda';
import UserControllerFactory from './factory/user-controller-factory';

const userControllerFactory = new UserControllerFactory();

export const handler: Handler =
  async ( event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {

  const userController = await userControllerFactory.create();

  console.log(`ROUTE: ${event.routeKey}`);

  let response: APIGatewayProxyResultV2;
  switch (event.routeKey) {
    case 'GET /users':
      response = await userController.index(event);
      break;

    case 'POST /users':
      response = await userController.create(event);
      break;

    case 'GET /users/{id}':
      response = await userController.show(event);
      break;

    case 'PUT /users/{id}':
      response = await userController.update(event);
      break;

    case 'DELETE /users/{id}':
      response = await userController.destroy(event);
      break;

    default:
      throw new Error(`Unsupported route: "${event.routeKey}"`);
  }

  console.log(response);
  return response;
}
