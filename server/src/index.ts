import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import db from "./db/models"
import router from "./routes"
import cors from "cors"
import errorHandler from "./middleware/error-handler"

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cors({
   origin: "*"
}))

const port = process.env.PORT

//ROUTES
app.use(router)

//ERROR MIDDLEWARE
app.use(errorHandler)

// PUSH TABLES INTO DATABASE
db.sequelize.sync()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Typescript server')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})