import { createTransport } from "nodemailer";

const transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: 'monkmonkey56@gmail.com',
        pass: 'uxpsboolqdovavzq'
    },
    secure: true
})

export default transporter