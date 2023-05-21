import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import axiosInstance from "../axiosInstance.js";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userLogin} from "../features/user/userSlice.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    useEffect(() => {
        if (window.location.search.includes('session-expired')) {
            Notify.failure('Your session is expired!', {position: 'center-bottom'});
        }
    }, []);

    function submit(event) {
        event.preventDefault();
        axiosInstance.post('api/v1/auth/authenticate', {
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim()
        }).then((response) => {
            passwordRef.current.value = '';
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_role', response.data.role);
            Notify.success('Successful login', {position: "center-bottom"});
            dispatch(userLogin());
            navigate('/');
        }).catch(() => {
            passwordRef.current.value = '';
            setError("Your email or password is invalid!");
        });
    }

    return (
        <>
            <Header/>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit}>
                    <FloatingLabel label="Email address" className="mb-3">
                        <Form.Control ref={emailRef} required type="email" placeholder="name@example.com"/>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mb-3">
                        <Form.Control ref={passwordRef} required type="password" placeholder="Password"/>
                    </FloatingLabel>
                    <div className="mb-3">
                        <span className="text-danger">{error}</span>
                    </div>
                    <div className="d-flex">
                        <Button type="submit" className="flex-grow-1">Login</Button>
                    </div>
                </Form>
            </Container>
            <Footer/>
        </>
    )
}

export default Login;