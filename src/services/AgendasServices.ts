import { ICreate } from "../interfaces/AgendaInterfaces";
import { getHours, isBefore, startOfHour } from "date-fns";
import { AgendasRepository } from "../repositories/AgendasRepository";

class AgendasServices {
    private agendaRepository: AgendasRepository;
    constructor() {
        this.agendaRepository = new AgendasRepository();
    };

    async create({ name, phone, date, user_id }: ICreate) {
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);
        const hour = getHours(hourStart)+3;

        if (hour <= 9 || hour >= 19) {
            throw new Error('Agendamentos somente entre 9 às 19');
        }

        if (isBefore(hourStart, new Date())) {
            throw new Error('Não é possivel agendar em uma data anterior');
        }

        const checkIsAvaiable = await this.agendaRepository.find(hourStart, user_id);
        if (checkIsAvaiable) {
            throw new Error('Horario não disponível');
        }

        const create = await this.agendaRepository.create({
            name, phone, date: hourStart, user_id,
        });

        return create;
    };

    async index(date: Date) {
        const result = await this.agendaRepository.findAll(date);
        return result;
    };

    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);

        if (isBefore(hourStart, new Date())) {
            throw new Error('Não é possivel agendar em uma data anterior');
        }

        const checkIsAvaiable = await this.agendaRepository.find(hourStart, user_id);

        if (checkIsAvaiable) {
            throw new Error('Horario não disponível');
        }

        const result = await this.agendaRepository.update(id, date);
        return result;
    };
}

export { AgendasServices };