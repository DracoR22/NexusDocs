import { createTransport } from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: 'monkmonkey56@gmail.com',
        pass: process.env.SMTP_PASSWORD
    },
    secure: true
})

export default transporter