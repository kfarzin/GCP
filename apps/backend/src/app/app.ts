import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors'
import jwt, { JWT } from '@fastify/jwt'


declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

const jwtSecret = "twertw-twertw34523452345"

/* eslint-disable-next-line */
export interface AppOptions { }


export async function app(fastify: FastifyInstance, opts: AppOptions) {
  await init(fastify);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}

const init = async (fastify: FastifyInstance) => {
  // to enable cors for the development purpose
  // it could be enabled/disabled by env variables
  // but in this exercise it is always true
  await fastify.register(cors, {
    origin: true,
  })  

  // this decoration helps to customize the route guards conditionally
  // so routes can be guarded or not according the relevant logic
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // to register the jwt token generation strategy using the provided secret 
  // this secret could come as env variables or config but in this case for the 
  // sake of simplicity it is defined here in this file
  fastify.register(jwt, {
    secret: jwtSecret
  })
}
