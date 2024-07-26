import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import UserRepository from '../repository/user-repository';

export default class UserController {

  private readonly userRepository: UserRepository;

  private readonly headers: Record<string, string>;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;

    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  public async index(event: APIGatewayProxyEventV2) {
    console.log('[UserController#index]');

    const body = await this.userRepository.findAll();

    const response: APIGatewayProxyResultV2 = {
      statusCode: 200,
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return response;
  }

  public async create(event: APIGatewayProxyEventV2) {
    console.log('[UserController#create]');

    const eventBody = event.body;

    if (!eventBody) throw new Error('Body not present');

    console.log(`[UserController#create] body: ${eventBody}`);

    const requestJson = JSON.parse(eventBody);

    const body = this.userRepository.create(requestJson);

    const response = {
      statusCode: 201,
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return response;
  }

  public async show(event: APIGatewayProxyEventV2) {
    console.log('[UserController#show]');

    const eventId = event.pathParameters?.id;

    if (!eventId) throw new Error('ID not present');

    console.log(`[UserController#show] ${eventId}`);

    const body = await this.userRepository.findById(Number.parseInt(eventId));

    const response = {
      statusCode: 200,
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return response;
  }

  public async update(event: APIGatewayProxyEventV2) {
    console.log('[UserController#update]');

    const eventBody = event.body;
    const eventId = event.pathParameters?.id;

    if (!eventId) throw new Error('ID not present');
    if (!eventBody) throw new Error('Body not present');

    console.log(`[UserController#update] id:${eventId}`);
    console.log(`[UserController#update] body:${eventBody}`);

    const requestJson = JSON.parse(eventBody);

    requestJson.id = eventId;

    const body = await this.userRepository.update(requestJson);

    const response = {
      statusCode: 200,
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return response;
  }

  public async destroy(event: APIGatewayProxyEventV2) {
    console.log('[UserController#destroy]');

    const eventId = event.pathParameters?.id;

    if (!eventId) throw new Error('ID not present');

    console.log(`[UserController#destroy] ${eventId}`);

    await this.userRepository.destroy(Number.parseInt(eventId));

    const response = {
      statusCode: 200,
      headers: this.headers,
      body: JSON.stringify({
        message: `ID: ${eventId} deleted successfully`
      }),
    };

    return response;
  }
}
