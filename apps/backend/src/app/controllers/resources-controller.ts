
import { FastifyReply } from "fastify/types/reply";
import { Route } from "../routes/route";
import { BaseController } from "./base-controller";
import { FastifyRequest } from "fastify/types/request";


export class ResourcesController extends BaseController {
    async getUnprotectedResource(req: FastifyRequest, res: FastifyReply) {
        // sample date to return as unprotected date
        const resource = {
            login: "guest",
            password: "1234",
            date: new Date().toISOString(),
        };
        return this.ok(res, resource)
    }

    // needs token
    async getProtectedResource(req: FastifyRequest, res: FastifyReply) {
        //sample date to return as protected date
        const resource = {
            login: "admin",
            password: "--12admin34--",
            date: new Date().toISOString(),
        }
        return this.ok(res, resource)
    }

    // every controllers has routes that can be used by route registerer to 
    // register the routes of a controller
    // auth property defined whether an endpoint needs to be protected
    routes: Route[] = [
        {
            method: "GET",
            path: "resources/unprotected",
            handler: (req, res) => this.getUnprotectedResource(req, res),
            auth: false,
        },
        {
            method: "GET",
            path: "resources/protected",
            handler: (req, res) => this.getProtectedResource(req, res),
            auth: true,
        }
    ];
}

