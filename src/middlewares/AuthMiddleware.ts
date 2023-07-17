import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IPayload } from "../interfaces/UserInterfaces";


class AuthMiddleware {
    auth(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token missing'
            });
        }
        
        const [, token] = authHeader.split(' ');
        
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) throw new Error('There is no Token Key');
        
        try {
            const { sub } = verify(token, secretKey) as IPayload;
            request.user_id = sub;
            return next();
        } catch (error) {
            return response.status(401).json({
                code: 'token.missing 2',
                message: 'Token missing 2'
            });
        }
    }
}

export { AuthMiddleware };
