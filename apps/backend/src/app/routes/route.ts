import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { ApiResponse } from "../controllers/base-controller";

// a type for a route. controllers have routes defined in and they should
// use this type for their defined routes
export type Route = {
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    handler: (req: FastifyRequest, res: FastifyReply) => Promise<ApiResponse<unknown>>,
    auth: boolean,
}