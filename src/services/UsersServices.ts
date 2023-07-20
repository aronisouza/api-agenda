import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UserInterfaces";
import { UsersRepository } from "../repositories/UsersRepository";
import { sign, verify } from "jsonwebtoken";
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid";

class UsersServices {
    private usersRepository: UsersRepository;
    constructor() {
        this.usersRepository = new UsersRepository;
    }

    async create({ name, email, password }: ICreate) {
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (findUser) {
            throw new Error('Usuário ja existe');
        }
        const hashPassword = await hash(password, 10);
        const create = await this.usersRepository.create({
            name,
            email,
            password: hashPassword,
        });
        return create;
    }

    async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {
        let password;
        if (oldPassword && newPassword) {
            const findUserById = await this.usersRepository.findUserById(user_id);
            if (!findUserById) {
                throw new Error('Usuário não encontrado');
            }
            const passwordMatch = compare(oldPassword, findUserById.password);
            if (!passwordMatch) {
                throw new Error('Senha Errada');
            }
            password = await hash(newPassword, 10);
            await this.usersRepository.updatePassword(password, user_id);
        }

        if (avatar_url) {
            const uploads3Img = avatar_url?.buffer;
            const uploads3 = await s3.upload({
                Bucket: 'agenda-curso',
                Key: `${uuid()}-${avatar_url?.originalname}`,
                //ACL: 'public-read',
                Body: uploads3Img,
            }).promise();
            await this.usersRepository.update(name, uploads3.Location, user_id);
        }
        return {
            message: 'Usuário atualizado',
        };
    }

    async auth(email: string, password: string) {
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (!findUser) {
            throw new Error('Usuário ou senha Errado Email');
        }

        const passwordMatch = await compare(password, findUser.password);
        if (!passwordMatch) {
            throw new Error('Usuário ou senha Errado Pass');
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no Token Key');
        }

        const token = sign(
            { email }, secretKey, {
            subject: findUser.id,
            expiresIn: '1h',
        });
        const refreshToken = sign(
            { email }, secretKey, {
            subject: findUser.id,
            expiresIn: '7d',
        });

        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
            }
        };
    }

    async refresh(refresh_token: string) {
        if (!refresh_token) {
            throw new Error('Refresh token missing');
        }
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no Token Key');
        }
        const verificaRefreshToken = verify(refresh_token, secretKey);
        const { sub } = verificaRefreshToken;
        const newToken = sign({sub}, secretKey,{
            expiresIn: 60 * 15,
        });
        return newToken;
    }

}

export { UsersServices };
