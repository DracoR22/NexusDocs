import { User } from "../db/models/user.model";
import { compare, genSalt, hash } from "bcrypt"
import jwt, { Secret } from "jsonwebtoken"
import dotenv from "dotenv"
import { RefreshToken } from "../db/models/refresh-token.model";
import { mailService } from "./mail.service";

dotenv.config()

class UserService {
    //-------------------------------------//GET USER BY EMAIL//-----------------------------------//
    public findUserByEmail = async (email: string): Promise<User | null> => {
       const user = await User.findOne({
         where: {
             email
         },
       })

       return user
    }
    //----------------------------------------//CREATE USER//--------------------------------------//
    public createUser = async (email: string, password: string) => {
       const salt = await genSalt()
       const hashedPassword = await hash(password, salt)

       const verificationToken = jwt.sign({ email }, process.env.VERIFY_SECRET as Secret)

       const user = await User.create({
         email,
         password: hashedPassword,
         verificationToken
       })

       // Call Method To Send Verification Email
       await this.sendVerificationEmail(user)
    }

    //-------------------------------------//VERIFICATION EMAIL//----------------------------------//
    private sendVerificationEmail = async (user: User) => {
      const mail = {
        from: 'monkmonkey56@gmail.com',
        to: user.email,
        subject: `Welcome to Nexus Docs`,
        text: `Click the following link to verify your account : http://localhost:3000/user/verify-email/${user.verificationToken}`
       }

       await mailService.sendMail(mail)
    }

    //-----------------------------------//VERIFICATION PASSWORD//---------------------------------//
    public sendResetPasswordEmail = async (user: User) => {
      const mail = {
        from: 'monkmonkey56@gmail.com',
        to: user.email,
        subject: `Reset your password`,
        text: `Click the following link to change your password : http://localhost:3000/user/reset-password/${user.passwordResetToken}`
       }

       await mailService.sendMail(mail)
    }

    //----------------------------------//CHECK PASSWORD IN LOGIN//--------------------------------//
    public checkPassword = async (user: User, password: string): Promise<boolean> => {
      return await compare(password, user.password)
    }
    //-------------------------------------//CREATE USER OBJECT//----------------------------------//
    public getRequestUser = async (user: User | RequestUser): Promise<RequestUser> => {
      if (user instanceof User) {
        const userWithRoles = await User.scope('withRoles').findByPk(user.id)
        const roles = userWithRoles?.userRoles.map((userRole) => userRole.role.name)

        return {
          id: user.id,
          email: user.email,
          roles: roles
        } as RequestUser

      } else {
        return user
      }
    }
  //---------------------------------------//CREATE JWT TOKEN//------------------------------------//
    public generateAuthResponse = async (user: RequestUser | User): Promise<TokenPair> => {
      const requestUser = await this.getRequestUser(user)

      const accessToken = jwt.sign(requestUser, process.env.ACCESS_TOKEN as Secret, {
        expiresIn: '24h'
      })

      const refreshToken = jwt.sign(requestUser, process.env.REFRESH_SECRET as Secret, {
        expiresIn: '24h'
      })

      await RefreshToken.destroy({
        where: { userId: requestUser.id }
      })

      await RefreshToken.create({ token: refreshToken, userId: requestUser.id })

      return { accessToken, refreshToken }
    }
   //----------------------------------------//REFRESH TOKEN//-------------------------------------//
    public getIsTokenActive = async (token: string): Promise<boolean> => {
      const refreshToken = await RefreshToken.findOne({
        where: {
          token
        }
      })

      return refreshToken != null
    }
   //-----------------------------------------//LOGOUT USER//--------------------------------------//
   public logoutUser = async (userId: number) => {
    await RefreshToken.destroy({
      where: {
        userId
      }
    })
   }

   //---------------------------------------//GET USER BY ID//-------------------------------------//
   public findUserById = async (id: number): Promise<User | null> => {
     const user = await User.findByPk(id)
     return user
   }

  //----------------------------------------//RESET PASSWORD//-------------------------------------//
  public resetPassword = async (user: User) => {
    const passwordResetToken = jwt.sign({ id: user.id, email: user.email }, process.env.PASSWORD_RESET as Secret, { expiresIn: '24h' })
    await user.update({ passwordResetToken })

    //Send Password Reset Email
    await this.sendResetPasswordEmail(user)
  }

  //-------------------------------//FIND USER BY PASSWORD RESET TOKEN//---------------------------//
  public findUserByPasswordResetToken = async (email: string, passwordResetToken: string): Promise<User | null> => {
    const user = await User.findOne({
      where: {
        email,
        passwordResetToken
      }
    })

    return user
  }

  //-------------------------------------//UPDATE USER PASSWORD//----------------------------------//
  public updatePassword = async (user: User, password: string) => {
    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    await user.update({
      password: hashedPassword
    })
  }

  //--------------------------------//FIND USER BY VERIFICATION TOKEN//----------------------------//
  public findUserByVerficationToken = async (email: string, verificationToken: string): Promise<User | null> => {
    const user = await User.findOne({
      where: {
        email,
        verificationToken
      }
    })

    return user
  }
   //-------------------------------------------//VERIFY USER//------------------------------------//
  public updateIsVerified = async (user: User, isVerified: boolean) => {
    await user.update({
      isVerified
    })
  }
}

const userService = new UserService()

export { userService }