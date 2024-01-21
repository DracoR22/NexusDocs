import express, { Express, Request, Response } from "express"
import db from "./db/models"
import router from "./routes"
import cors from "cors"
import errorHandler from "./middleware/error-handler"

const app: Express = express()

app.use(express.json())
app.use(cors({
   origin: "*"
}))

//ROUTES
app.use(router)

//ERROR MIDDLEWARE
app.use(errorHandler)

// PUSH TABLES INTO DATABASE
db.sequelize.sync()

export default app