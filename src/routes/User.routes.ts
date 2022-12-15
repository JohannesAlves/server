import { Router } from "express";
import { LoginController, SignupController } from "../controllers/User";

const UserRoutes = Router();

UserRoutes.post("/signup", SignupController);
UserRoutes.post("/login", LoginController);

export default UserRoutes;
