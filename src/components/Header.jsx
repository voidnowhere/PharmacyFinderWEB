import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png'
import {Link, useMatch, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {userLogout} from "../features/user/userSlice.js";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPharmacist = useSelector(state => state.user.isPharmacist);
    const isAdmin = useSelector(state => state.user.isAdmin);

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        dispatch(userLogout())
        Notify.success('Successful logout', {
            position: 'center-bottom',
        });
        navigate('/login');
    }

    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} alt="Logo" width="30" height="30"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" active={Boolean(useMatch('/'))}>Home</Nav.Link>
                            {
                                isAuthenticated && isPharmacist
                                &&
                                <Nav.Link as={Link} to="/my-pharmacy" active={Boolean(useMatch('/my-pharmacy'))}>
                                    My pharmacy</Nav.Link>
                            }
                            {
                                isAuthenticated && isAdmin
                                &&
                                <>
                                    <Nav.Link as={Link} to="/cities" active={Boolean(useMatch('/cities'))}>
                                        Cities</Nav.Link>
                                    <Nav.Link as={Link} to="/zones" active={Boolean(useMatch('/zones'))}>
                                        Zones</Nav.Link>
                                </>
                            }
                            <Nav.Link as={Link} to="/about-us" active={Boolean(useMatch('/about-us'))}>
                                About us</Nav.Link>
                            <Nav.Link as={Link} to="/contact" active={Boolean(useMatch('/contact'))}>Contact</Nav.Link>
                        </Nav>
                        <Nav>
                            {isAuthenticated ?
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                                :
                                (<>
                                    <Nav.Link as={Link} to="/login"
                                              active={Boolean(useMatch('/login'))}>Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register"
                                              active={Boolean(useMatch('/register'))}>Register</Nav.Link>
                                </>)
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}