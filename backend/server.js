import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import {connectDB} from "../backend/config/db.js"
import noteRoutes from "../backend/routes/noteRoutes.js"


dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/notes",noteRoutes)


app.listen(PORT, () => {
    console.log("Server started on port:", PORT)
})


