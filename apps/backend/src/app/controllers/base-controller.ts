import { FastifyReply } from "fastify/types/reply";

// this base controller has a set of helper methods
// that can be used by derived controllers to produce
// common responses
export class BaseController {
    ok = <T>(res: FastifyReply, model: T): ApiResponse<T> =>  {
        res.code(HTTP_CODES.success)
        return {
            data: model,
            code: HTTP_CODES.success,
        } as ApiResponse<T>
    }

    bad = <T>(res: FastifyReply, model: T): ApiResponse<T> =>  {
        res.code(HTTP_CODES.badRequest)
        return {
            data: model,
            code: HTTP_CODES.badRequest,
        }
    }

    unauthorized = <T>(res: FastifyReply, model: T): ApiResponse<T> =>  {
        res.code(HTTP_CODES.unauthorized)
        return {
            data: model,
            code: HTTP_CODES.unauthorized,
        }
    }

    // more common helper methods can be declared
    // but for this exercise only a few as needed
}

// generic response that all endpoints respect to
export type ApiResponse<T> = {
    data: T,
    code: number,
}

// a set of http code constants to use across the app
export const HTTP_CODES = {
    success: 200,
    badRequest: 400,
    unauthorized: 401,
}