
import { FastifyReply } from "fastify/types/reply";
import { Route } from "../routes/route";
import { BaseController } from "./base-controller";
import { FastifyRequest } from "fastify/types/request";
import { UserService } from "../services/user-service";

export class AuthController extends BaseController {
    private userService;
    constructor() {
        super();
        this.userService = new UserService();
    }
    // there should be validations for the input but here for the sake of simplicity
    // input validations are not provided
    async register(req: FastifyRequest, res: FastifyReply) {
        const { email, password } = req.body as { email: string, password: string };
        // this is just the bare minimum data to create a token based on it
        // in real scenarios there will be claims to support this section
        const data = {
            email
        }
        if (await this.userService.insertUserIfNotExists(email, password)) {
            const token = await res.jwtSign({ data })
            return this.ok(res, token)
        }
        return this.bad(res, null)
    }

    // there should be validations for the input but here for the sake of simplicity
    // input validations are not provided
    async login(req: FastifyRequest, res: FastifyReply) {
        const { email, password } = req.body as { email: string, password: string };
        if (await this.userService.verifyUser(email, password)) {
            const token = await res.jwtSign({ email })
            return this.ok(res, token)
        }
        return this.unauthorized(res, null)
    }

    // every controllers has routes that can be used by route registerer to 
    // register the routes of a controller
    // auth property defined whether an endpoint needs to be protected
    routes: Route[] = [
        {
            method: "POST",
            path: "auth/register",
            handler: (req, res) => this.register(req, res),
            auth: false,
        },
        {
            method: "POST",
            path: "auth/login",
            handler: async (req, res) => this.login(req, res),
            auth: false,
        }
    ];
}



