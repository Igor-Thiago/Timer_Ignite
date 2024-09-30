import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout'

export function Router(){
    return (
        <Routes>
            <Route path='/' element={<DefaultLayout/>}>
                <Route  path='/' element={<Home/>}/>             
                <Route  path='/history' element={<History/>}/>
            </Route>
        </Routes>
    )
} 

// Para cofigurar as rotas todas elas devem estar dentro da tag <Route/> e essas tags devem estar dentro da tag <Routes/>

// No caso tem 2 tags <Route/> envoltas por outra tag <Route/>.. isso serve para atribuir um layout às 2 rotas por meio da tag <Outlet/> 
// lá em DefaultLayout/index.tsx



//path => é o caminho da rota
//element é o componete que você quer carregar