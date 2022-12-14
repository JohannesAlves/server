import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { isValidCPF } from "../utils/isValidCPF";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface ISignupRequestBody {
    cpf: string;
    password: string;
    fullname: string;
}

export const SignupController = async (request: Request, response: Response) => {
    const { cpf, password, fullname }: ISignupRequestBody = request.body;

    if (!isValidCPF(cpf)) {
        return response.status(401).json({ signup: false, message: "Invalid CPF" });
    }

    if (!cpf || !password || !fullname) {
        return response.status(401).json({ signup: false, message: "U can't send data empty to signup." });
    }

    try {
        const userAlreadyExist = await prisma.user.findUnique({
            where: {
                cpf,
            },
        });

        if (userAlreadyExist) {
            return response.status(401).json({ signup: false, message: "user already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const cpfWithoutMasks = cpf.replace(/[^\d]+/g, "");

        const newUser = await prisma.user.create({
            data: {
                cpf: cpfWithoutMasks,
                fullname,
                password: hashPassword,
            },
        });

        const accountUser = await prisma.account.create({
            data: {
                balance: 0,
                userId: newUser.id,
            },
        });

        return response.status(201).json({ signup: true, message: "Account created sucessful!" });
    } catch (error) {
        return console.log(error);
    }
};
