import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';
import { getFullPath } from './routes/root'
import { HTTP_CODES } from './controllers/base-controller';

const testEmail = "test@tes.com";
const testPassword = "123456";
let authorizationHeader = null;

declare module "fastify" {  
  export interface FastifyInstance {
    authenticate: any;
  }
}

describe('GET /', () => {
  let server: FastifyInstance;
  beforeAll(async () => {
    server = Fastify();
    await server.register(app);
    const path = getFullPath("auth/register");
    const response = await server.inject({
      method: 'POST',
      url: path,
      body: {
        email: testEmail,
        password: testPassword,
      }
    });
    const body = JSON.parse(response.body);
    authorizationHeader = {
      authorization: `Bearer ${body.data}`
    }
  });

  it('resources/unprotected should have success response', async () => {
    const path = getFullPath("resources/unprotected");
    const response = await server.inject({
      method: 'GET',
      url: path,
    });
    expect(response.statusCode).toBe(HTTP_CODES.success);
  });

  it('resources/protected without token should have unauthorized response', async () => {
    const path = getFullPath("resources/protected");
    const response = await server.inject({
      method: 'GET',
      url: path,
    });

    expect(response.statusCode).toBe(HTTP_CODES.unauthorized);
  });

  it('resources/protected with token should have ok response', async () => {
    const path = getFullPath("resources/protected");
    const response = await server.inject({
      method: 'GET',
      url: path,
      headers: authorizationHeader
    });

    expect(response.statusCode).toBe(HTTP_CODES.success);
  });

  it('auth/register with an existing email should generate error', async () => {
    const path = getFullPath("auth/register");
    const response = await server.inject({
      method: 'POST',
      url: path,
      body: {
        email: testEmail,
        password: testPassword,
      }
    });

    expect(response.statusCode).toBe(HTTP_CODES.badRequest);
  });

  it('auth/register with a new email should success', async () => {
    const path = getFullPath("auth/register");
    const response = await server.inject({
      method: 'POST',
      url: path,
      body: {
        email: "test2@tes.com",
        password: "123456",
      }
    });

    expect(response.statusCode).toBe(HTTP_CODES.success);
  });

  it('auth/login with an existing set of credentials should success and contain token', async () => {
    const path = getFullPath("auth/login");
    const response = await server.inject({
      method: 'POST',
      url: path,
      body: {
        email: testEmail,
        password: testPassword,
      }
    });

    const body = JSON.parse(response.body);
    expect(body.data).not.toBeNull();
    expect(response.statusCode).toBe(HTTP_CODES.success);
  });

  it('auth/login with a non-existing set of credentials should return unauthorized', async () => {
    const path = getFullPath("auth/login");
    const response = await server.inject({
      method: 'POST',
      url: path,
      body: {
        email: "random@random.com",
        password: "somerandompassword",
      }
    });

    expect(response.statusCode).toBe(HTTP_CODES.unauthorized);
  });

});
