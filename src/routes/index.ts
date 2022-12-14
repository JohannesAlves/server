import { Router } from "express";
import UserRoutes from "./User.routes";
const routes = Router();

routes("/", UserRoutes);

export default routes;
