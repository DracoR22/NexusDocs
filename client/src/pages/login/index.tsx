import { useContext, useState } from "react"
import TextField from "../../components/atoms/text-field/text-field"
import useWindowSize from "../../hooks/use-window-size"
import validator from "validator"
import AuthService from "../../services/auth-service"
import useAuth from "../../hooks/use-auth"
import { ToastContext } from "../../contexts/toast-context"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {

  const {widthStr, heightStr} = useWindowSize()

  const [email, setEmail] = useState<string>('')
  const [emailErrors, setEmailErrors] = useState<Array<string>>([])
  const [password, setPassword] = useState<string>('')
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useAuth()
  const { addToast, success, error } = useContext(ToastContext)

  const navigate = useNavigate()

  const validate = () => {
    setEmailErrors([])
    setPasswordErrors([])

    let isValid = true

    if (!validator.isEmail(email)) {
        setEmailErrors(['Please enter a valid email'])
        isValid = false
    }

    if (!password.length) {
        setPasswordErrors(['Please enter a password'])
        isValid = false
    }

    return isValid
  }

  const loginUser = async () => {
    if (!validate()) return
    setLoading(true)

    try {
        const response = await AuthService.login({ email, password })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        login(newAccessToken, newRefreshToken)
        success('Logged in!')
        navigate("/document/create");
    } catch (error) {
        addToast({
            title: `Wrong credentials`,
            body: "Your email or password is incorrect",
            color: "danger",
          });
    } finally {
       setLoading(false);
    }
  }

  const handleOnKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") loginUser();
  };

  const handleOnInputEmail = (value: string) => {
    setEmailErrors([])
    setEmail(value)
  }

  const handleOnInputPassword = (value: string) => {
    setPasswordErrors([])
    setPassword(value)
  }

  return (
    // @ts-expect-error
    <div onKeyPress={handleOnKeyPress} className="w-full sm:py-[200px] flex flex-col sm:justify-center items-center p-6 sm:pb-96 bg-gray-100 dark:bg-slate-900 text-primary" style={{ width: widthStr, height: heightStr }}>
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded border-primary shadow-md border dark:border-0 dark:shadow-xl p-6">
          <div className="flex flex-col space-y-4">
            <div className="w-full text-center flex flex-col justify-center items-center">
            {/* <Logo /> */} 
            <h1 className="font-bold text-sky-500 text-3xl">Login</h1>
            <p className="font-medium text-sm mt-2">to continue to Nexus Docs</p>
            </div>
            <TextField value={email} onInput={handleOnInputEmail} label="Email" color="secondary" errors={emailErrors}/>
              <Link to='/register' className="text-sm hover:underline font-semibold text-blue-500 text-left">
                Need an account? 
             </Link>
           <TextField value={password} onInput={handleOnInputPassword} label="Password" type="password" color="secondary"errors={passwordErrors}/>
           <button tabIndex={-1} className="text-sm hover:underline font-semibold text-blue-500 text-left" >
            Forgot Password?
          </button>
          <button onClick={loginUser} disabled={loading} className="bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded hover:bg-blue-500 flex justify-center items-center space-x-1 active:ring-1">
            <span>Login</span>
          </button>
          </div>
        </div>
        <div className="flex justify-center space-x-4 text-sm p-4">
        <button className="hover:underline font-semibold text-blue-500">
          Terms
        </button>
        <button className="hover:underline font-semibold text-blue-500">
          Privacy Policy
        </button>
      </div>
    </div>
  )
}

export default Login