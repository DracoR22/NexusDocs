import { Sequelize } from "sequelize-typescript"
import dotenv from "dotenv"

dotenv.config()

const sequelize = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? new Sequelize(process.env.DATABASE!, process.env.USER!, process.env.PASSWORD!, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
}) : new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

export default sequelize