import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } /* Esse * significa que o estilo dentro dessa classe sera aplicado a todos os objetos da página */

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${props => props.theme['green-500']};
  }

  body {
    background: ${props => props.theme['gray-900']};
    color: ${props => props.theme['gray-300']};
  }

  body, input, textarea, button {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }




`