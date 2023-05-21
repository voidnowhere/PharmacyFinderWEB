import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Container from "react-bootstrap/Container";
import {Button, FloatingLabel, Form, FormControl} from "react-bootstrap";
import {useRef, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {useNavigate} from "react-router-dom";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function Register() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    function submit(event) {
        event.preventDefault();
        axiosInstance.post('api/v1/auth/register', {
            email: emailRef.current.value.trim(),
            firstname: firstNameRef.current.value.trim(),
            lastname: lastNameRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
        }).then(() => {
            passwordRef.current.value = '';
            Notify.success('Registered successfully', {position: "center-bottom"});
            navigate('/login');
        }).catch((error) => {
            passwordRef.current.value = '';
            setError(error.response.data.error);
        });
    }

    return (
        <>
            <Header/>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit}>
                    <FloatingLabel label="Email address">
                        <FormControl ref={emailRef} type="email" placeholder="name@example.com" required/>
                    </FloatingLabel>
                    <FloatingLabel label="First name" className="mt-3">
                        <Form.Control ref={firstNameRef} type="text" placeholder="First name" required/>
                    </FloatingLabel>
                    <FloatingLabel label="Last name" className="mt-3">
                        <Form.Control ref={lastNameRef} type="text" placeholder="Last name" required/>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control ref={passwordRef} type="password" placeholder="Password" required/>
                    </FloatingLabel>
                    <div className="mt-3">
                        <span className="text-danger">{error}</span>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} type="submit">Register</Button>
                    </div>
                </Form>
            </Container>
            <Footer/>
        </>
    );
}

export default Register;