import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { History } from './pages/History'

export function Router(){
    return (
        <Routes>
            <Route  path='/' element={<Home/>}/>             
            <Route  path='/history' element={<History/>}/>
        </Routes>
    )
} 

// Para cofigurar as rotas todas elas devem estar dentro da tag <Route/> e essas tags devem estar dentro da tag <Routes/>

//path => é o caminho da rota
//element é o componete que você quer carregar