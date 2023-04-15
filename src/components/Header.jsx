import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png'
import {Link, useMatch} from "react-router-dom";

export default function Header() {
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
                            <Nav.Link as={Link} to="/pharmacies"
                                      active={Boolean(useMatch('/pharmacies'))}>Pharmacies</Nav.Link>
                            <Nav.Link as={Link} to="/about-us" active={Boolean(useMatch('/about-us'))}>About
                                us</Nav.Link>
                            <Nav.Link as={Link} to="/contact" active={Boolean(useMatch('/contact'))}>Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}