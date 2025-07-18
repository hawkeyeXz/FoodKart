import express from 'express';
const router = express.Router();

import { creatUser, loginUser, updateUserProfile, getUserDetails} from "../controllers/auth.controller.js"

router.post("/createuser", creatUser)

router.post("/login",loginUser)

router.get("/getuser", getUserDetails)

router.put("/updateprofile", updateUserProfile)

export default router;
