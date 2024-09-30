import { HeaderContainer } from "./styles";
import {Timer, Scroll} from 'phosphor-react'
import logoIgnite from '../../assets/Logo-Ignite.svg'
import { NavLink } from "react-router-dom";

export function Header(){
    return (
        <HeaderContainer>
            <img src={logoIgnite} alt="" />
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>


        </HeaderContainer>
    )
}// <NavLink to="">  Serve para definir para qual rota 
 // a página vai após o click