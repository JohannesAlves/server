import { Router } from "express";
import { SignupController } from "../controllers/User";

const UserRoutes = Router();

UserRoutes.post("/signup", SignupController);

export default UserRoutes;
