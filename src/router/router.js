import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../views/Login/Login';
import Eventos from '../views/Eventos/Eventos';
import Home from '../views/Home/Home';
import Classes from '../views/Classes/Classes';
import Pdv from '../views/PDV/Pdv';
import Diarios from '../views/Diários/Diarios';
import Site from '../views/Site/Site';
import Sangria from '../views/Sangria/Sangria';
import Detalhados from '../views/Detalhados/Detalhados';
import Numerados from '../views/Numerados/Numerados';
import { TokenProvider } from '../model/tokenContext';
import { LoginProvider } from '../model/loginContext';
import Cancelados from '../views/Cancelados/Cancelados';

function Router() {
    return (
        <LoginProvider>
        <TokenProvider>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />}/>
                <Route path='/eventos' element={<Eventos />}/>
                <Route path='/home' element={<Home />}/>
                <Route path='/classes' element={<Classes />}/>
                <Route path='/pdv' element={<Pdv />}/>
                <Route path='/diarios' element={<Diarios />}/>
                <Route path='/site' element={<Site />}/>
                <Route path='/sangria' element={<Sangria />}/>
                <Route path='/detalhados' element={<Detalhados />}/>
                <Route path='/numerados' element={<Numerados />}/>
                <Route path='/cancelados' element={<Cancelados />}/>
            </Routes>
        </BrowserRouter>
        </TokenProvider>
        </LoginProvider>
    )
}

export default Router;