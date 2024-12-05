import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth-controller';
import { Route } from './route';
import { ResourcesController } from '../controllers/resources-controller';

const basePath = "/api/v1"

const authController = new AuthController();
const resourcesController = new ResourcesController();

export default async function (fastify: FastifyInstance) {
  registerRoutes(fastify, authController.routes);
  registerRoutes(fastify, resourcesController.routes);
}

// function to attach the base path to a url
// for instance if the url is auth/register this
// function transforms it into api/v1/auth/register
export const getFullPath = (path: string) => `${basePath}/${path}`


// a function to automatically registers all routes declared by each controller
// if the auth property of a route is true then it registers it as a guarded path
// that needs a jwt token then
const registerRoutes = (fastify: FastifyInstance, routes: Route[]) => {
  routes.forEach(e => {
    switch (e.method) {
      case 'GET':
        // this can be written in more compact way, e.g. ternary operator ?:
        if (e.auth) {
          fastify.get(getFullPath(e.path), {
            onRequest: [fastify.authenticate]
          }, async (req, res) => e.handler(req, res))
        } else {
          fastify.get(getFullPath(e.path), async (req, res) => e.handler(req, res));
        }
        break;
      case 'POST':
        if (e.auth) {
          fastify.post(getFullPath(e.path), {
            onRequest: [fastify.authenticate]
          }, async (req, res) => e.handler(req, res));
        } else {
          fastify.post(getFullPath(e.path), async (req, res) => e.handler(req, res));
        }
        break;
      case 'PUT':
        if (e.auth) {
          fastify.put(getFullPath(e.path), {
            onRequest: [fastify.authenticate]
          }, async (req, res) => e.handler(req, res));
        } else {
          fastify.put(getFullPath(e.path), async (req, res) => e.handler(req, res));
        }
        break;
      case 'DELETE':
        if (e.auth) {
          fastify.delete(getFullPath(e.path), {
            onRequest: [fastify.authenticate]
          }, async (req, res) => e.handler(req, res));
        } else {
          fastify.delete(getFullPath(e.path), async (req, res) => e.handler(req, res));
        }
        break;
      default:
        break;
    }
  });
}