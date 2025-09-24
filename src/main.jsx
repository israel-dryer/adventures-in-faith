import './index.css'

import "@fontsource-variable/montserrat"; // variable 100–900
import "@fontsource/montserrat-alternates/400.css";
import "@fontsource/montserrat-alternates/500.css";
import "@fontsource/montserrat-alternates/700.css";

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import BioPage from "./pages/BioPage.jsx";
import {Provider} from "./components/ui/provider.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import AppLayout from "./components/AppLayout.jsx";
import JerusalemBookPage from "./pages/JerusalemBookPage.jsx";
import ThailandBookPage from "./pages/ThailandBookPage.jsx";

// optional explicit registration
import {registerSW} from 'virtual:pwa-register'

registerSW({immediate: true})


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout/>}>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/bio" element={<BioPage/>}/>
                        <Route path="/books" element={<BooksPage/>}/>
                        <Route path="/books/jerusalem-adventure" element={<JerusalemBookPage/>}/>
                        <Route path="/books/thailand-adventure" element={<ThailandBookPage/>}/>
                    </Route>

                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
