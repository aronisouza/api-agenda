import express, { Application, Request, Response, NextFunction } from 'express';
import { UsersRoutes } from './routes/users.routes';
import { AgendasRouters } from './routes/agendas.routes';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoutes = new UsersRoutes().getRoutes();
const agendasRoutes = new AgendasRouters().getRoutes();

app.use('/users', usersRoutes);
app.use('/agendas', agendasRoutes);


app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof Error) {
            return response.status(400).json({
                message: err.message,
            });
        }
        return response.status(500).json({
            message: 'Erro interno do servidor',
        });
    })
app.listen(3000, () => console.log('Server ON'));
