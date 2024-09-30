import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";
import { LayoutContainer } from "./styles";

export function DefaultLayout() {
    return(
        <LayoutContainer>
            <Header/>
            <Outlet/>   
        </LayoutContainer>
    )
}

// <Outlet/> serve para dizer pro react que página será
// mostrada. No caso desse layout o Header será aproveitado
// em todas as pages