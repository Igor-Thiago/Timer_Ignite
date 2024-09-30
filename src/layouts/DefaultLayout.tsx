import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function DefaultLayout() {
    return(
        <div>
            <Header/>
            <Outlet/>   
        </div>
    )
}

// <Outlet/> serve para dizer pro react que página será
// mostrada. No caso desse layout o Header será aproveitado
// em todas as pages