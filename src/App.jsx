import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./components/Home.jsx";
import Contact from "./components/Contact.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import MyPharmacy from "./components/Pharmacist/MyPharmacy.jsx";
import {useSelector} from "react-redux";
import Cities from "./components/Admin/Cities/Cities.jsx";
import Zones from "./components/Admin/Zones/Zones.jsx";
import {Analytics} from '@vercel/analytics/react';

function App() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPharmacist = useSelector(state => state.user.isPharmacist);
    const isAdmin = useSelector(state => state.user.isAdmin);

    const router = createBrowserRouter([
        {path: "/", element: <Home/>},
        {
            path: "/my-pharmacy",
            element: (!isAuthenticated) ? <Navigate to="/login"/> : (isPharmacist) ? <MyPharmacy/> : <Navigate to="/"/>
        },
        {
            path: "/cities",
            element: (!isAuthenticated) ? <Navigate to="/login"/> : (isAdmin) ? <Cities/> : <Navigate to="/"/>
        },
        {
            path: "/zones",
            element: (!isAuthenticated) ? <Navigate to="/login"/> : (isAdmin) ? <Zones/> : <Navigate to="/"/>
        },
        {path: "/about-us", element: <AboutUs/>},
        {path: "/contact", element: <Contact/>},
        {path: "/login", element: (isAuthenticated) ? <Navigate to="/"/> : <Login/>},
        {path: "/register", element: (isAuthenticated) ? <Navigate to="/"/> : <Register/>},
    ]);

    return (
        <>
            <RouterProvider router={router}/>
            <Analytics/>
        </>
    )
}

export default App
