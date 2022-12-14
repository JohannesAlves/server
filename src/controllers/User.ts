import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface ISignupRequestBody {
    cpf: string;
    password: string;
    fullname: string;
}

export const SignupController = async (request: Request, response: Response) => {
    const { cpf, password, fullname }: ISignupRequestBody = request.body;

    if (!cpf || !password || !fullname) {
        return response.status(401).json({ signup: false, message: "U can't send data empty to signup." });
    }

    try {
        const user = await prisma.user.create({
            data: {
                cpf,
                fullname,
                password,
            },
        });

        const accountUser = await prisma.account.create({
            data: {
                balance: 0,
                userId: user.id,
            },
        });

        return response.status(201).json({ signup: true, message: "Account created sucessful!" });
    } catch (error) {
        return console.log(error);
    }
};
