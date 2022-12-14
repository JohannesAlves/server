import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface ISignupRequestBody {
    cpf: string;
    password: string;
    fullname: string;
}

const SignupController = async (request: Request, response: Response) => {
    const { cpf, password, fullname }: ISignupRequestBody = request.body;

    if (!cpf || !password || !fullname) {
        return response.status(401).json({ signup: false, message: "U can't send data empty to signup." });
    }

    try {
        const createUser = await prisma.user.create({
            data: {
                cpf,
                fullname,
                password,
            },
        });
    } catch (error) {
        return console.log(error);
    }
};
