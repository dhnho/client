import { createBrowserRouter } from "react-router";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import App from "../layout/App";
import UserForm from "../../features/account/UserForm";
import Dashboard from "../../features/dashboard/Dashboard";
import MessagesThread from "../../features/chats/MessagesThread";
import ListFriend from "../../features/friends/ListFriend";
import EmailForm from "../../features/account/EmailForm";
import OTPRegister from "../../features/account/OTPRegister";
import Forgetpass from "../../features/account/Forgetpass";
import OTPForgotPassword from "../../features/account/OTPForgotPassword";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'user', element: <UserForm /> },
            { path: 'email', element: <EmailForm /> }, 
            { path: 'otp', element: <OTPRegister /> },
            { path: 'otp-forgot-password', element: <OTPForgotPassword /> },
            { path: 'forgot-password', element: <Forgetpass /> },
            {
                path: 'dashboard', element: <Dashboard />, children: [
                    { path: 'message/:id', element: <MessagesThread /> },
                    { path: 'friends', element: <ListFriend /> }
                ]
            }
        ]
    }
])