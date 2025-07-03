import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import noteRoutes from "./routes/noteRoutes.js"
import userRoutes from "./routes/userRoutes.js"



dotenv.config()
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);



const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/users",userRoutes)
app.use("/api/notes",noteRoutes)


app.listen(PORT, () => {
    console.log("Server started on port:", PORT)
})


