const userNotFound: Array<ResponseMessage> = [
    {
        msg: "Your email or password is incorrect"
    }
]

const emailNotVerified: Array<ResponseMessage> = [
    {
        msg: "Please verify your email before logging in"
    }
]

const resetPassword: Array<ResponseMessage> = [
    {
        msg: "You will receive an email with instructions to reset your password"
    }
]

export { userNotFound, emailNotVerified, resetPassword }