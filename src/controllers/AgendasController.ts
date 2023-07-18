import { NextFunction, Request, Response } from "express";
import { AgendasServices } from "../services/AgendasServices";
import { parseISO } from "date-fns";

class AgendasController {
    private agendasService: AgendasServices;
    constructor() {
        this.agendasService = new AgendasServices();
    }
    async store(request: Request, response: Response, next: NextFunction) {
        const { name, phone, date } = request.body;
        const { user_id } = request;
        try {
            const result = await this.agendasService.create({ name, phone, date, user_id });
            console.log('date:',date);
            return response.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        const { date } = request.query;
        const parseDate = date ? parseISO(date.toString()) : new Date();

        try {
            const result = await this.agendasService.index(parseDate);
            return response.json(result);
        } catch (error) {
            next(error);
        }
    }
    async update(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        const { date } = request.body;
        const { user_id } = request;
        try {
            const result = await this.agendasService.update(id, date, user_id);
            return response.json(result);
        } catch (error) {
            next(error);
        }
    }
    delete(request: Request, response: Response, next: NextFunction) {

    }

}
export { AgendasController };