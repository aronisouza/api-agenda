import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/AgendaInterfaces";

class AgendasRepository {
    async create({name, phone, date, user_id}: ICreate){
        const result = await prisma.agenda.create({
            data:{
                name,
                phone,
                date,
                user_id,
            }
        });
        return result;
    }

    async update(id: string, date: Date){
        const result = await prisma.agenda.update({
            where: {
                id,
            },
            data:{
                date,
            }
        })
        return result;
    }

    async find(date: Date, user_id:string){
        const result =  await prisma.agenda.findFirst({
            where:{
                date,
                user_id
            },
        });
        return result;
    }

    
    async findAll(date: Date){
        const result =  await prisma.agenda.findMany({
            where:{
                date:{
                    gte: startOfDay(date),
                    lt: endOfDay(date)
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return result;
    }
}
export { AgendasRepository };
