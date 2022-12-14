import { Router } from "express";
import UserRoutes from "./User.routes";
const routes = Router();

routes.use("/", UserRoutes);

export default routes;
