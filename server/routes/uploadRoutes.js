import express from "express";
import { getUploadAuth } from "../controllers/uploadController.js";
import anyAuth from "../middlewares/anyAuth.js";

const uploadRouter = express.Router();

uploadRouter.get("/auth", anyAuth, getUploadAuth);

export default uploadRouter;
