import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Spinner from "./Spinner";

function App() {

    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/") {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="">
            <Spinner />

            <Outlet />
        </div>
    );
}

export default App;
