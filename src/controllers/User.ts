import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { isValidCPF } from "../utils/isValidCPF";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type cpf = string;
type password = string;

interface ISignupRequestBody {
    cpf: cpf;
    password: password;
    fullname: string;
}

interface ILoginControllerRequestBody {
    cpf: cpf;
    password: password;
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
        const cpfWithoutMasks = cpf.replace(/[^\d]+/g, "");

        const userExists = await prisma.user.findUnique({
            where: {
                cpf: cpfWithoutMasks,
            },
        });

        if (userExists) {
            return response.status(401).json({ signup: false, message: "user already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                cpf: cpfWithoutMasks,
                fullname,
                password: hashPassword,
            },
        });

        const newAccount = await prisma.account.create({
            data: {
                balance: 0,
                userId: newUser.id,
            },
        });

        return response
            .status(201)
            .json({ signup: true, message: "Account created sucessful!", accountId: newAccount.accountId });
    } catch (error) {
        return console.log(error);
    }
};

export const LoginController = async (request: Request, response: Response) => {
    const { cpf, password }: ILoginControllerRequestBody = request.body;

    if (!cpf || !password) {
        return response.status(401).json({ auth: false, message: "U can't send data empty." });
    }

    if (!isValidCPF(cpf)) {
        return response.status(401).json({ auth: false, message: "Invalid CPF!" });
    }

    try {
        const cpfWithoutMasks = cpf.replace(/[^\d]+/g, "");

        const user = await prisma.user.findFirst({
            where: {
                cpf: cpfWithoutMasks,
            },
        });

        if (!user) {
            return response.status(404).json({ auth: false, message: "incorrect data." });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return response.status(400).json({ auth: false, message: "incorrect data." });
        } else {
            return response.status(200).json({ auth: true, message: "auth sucessful" });
        }
    } catch (error) {
        throw new Error();
    }
};
