import expres from "express";
import {getProjects,getSchoolByProject} from "../controller/projectController.js"
import { generatePdf } from "../controller/reportController.js";

const router = expres.Router();


router.get("/api/getproject",getProjects)
router.post("/api/getSchoolByProject",getSchoolByProject)
router.post("/api/generatepdf",generatePdf)

export default router;