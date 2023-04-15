import {createBrowserRouter, RouterProvider} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./components/Home.jsx";
import Pharmacies from "./components/Pharmacies.jsx";
import Contact from "./components/Contact.jsx";
import AboutUs from "./components/AboutUs.jsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/pharmacies",
            element: <Pharmacies/>,
        },
        {
            path: "/pharmacies",
            element: <Pharmacies/>,
        },
        {
            path: "/about-us",
            element: <AboutUs/>,
        },
        {
            path: "/contact",
            element: <Contact/>,
        },
    ]);

    return (
        <RouterProvider router={router}/>
    )
}

export default App
