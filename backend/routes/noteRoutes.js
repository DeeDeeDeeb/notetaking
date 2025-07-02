import express from "express";
import { getAllNotes, createNote, deleteNote, updateNote, getNoteById, createUser, loginUser, getAllUsers } from "../controllers/noteController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router(); 

router.use(authenticateToken)
router.get("/", getAllNotes)
router.get("/:id", getNoteById)
router.post("/", createNote)
router.put("/:id", updateNote)
router.delete("/:id", deleteNote)

export default router