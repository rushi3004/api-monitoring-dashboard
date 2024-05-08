import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface LoginState {
    username: string;
    password: string;
}

interface SignupState {
    email: string;
    fullname: string;
    username: string;
    password: string;
}


const Login: React.FC<{ isUserAuthenticated: (authenticated: boolean) => void }> = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState<LoginState>({ username: '', password: '' });
    const [signup, setSignup] = useState<SignupState>({
        email: '',
        fullname: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [account, setAccount] = useState<'login' | 'signup'>('login');
    const navigate = useNavigate();

    const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogin({ ...login, [name]: value });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignup({ ...signup, [name]: value });
    };

   

    const loginUser = async () => {
        try {
            const response = await axios.post('/login', login);
            if (response.data.isSuccess){
                setError('');
                sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                // setAccounts({ name: response.data.name, username: response.data.username });
                isUserAuthenticated(true);
                setLogin({ username: '', password: '' });
                navigate('/');
               
            } else {
                setError('Username or password is incorrect');
               
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Something went wrong! Please try again later.');
            
        }
    };

    const signupUser = async () => {
        try {
            const response = await axios.post('/signup', login);
            if (response.data.isSuccess) {
                setError('');
                setSignup({
                    email: '',
                    fullname: '',
                    username: '',
                    password: ''
                });
                setAccount('login');
                
            } else {
                setError('Something went wrong! please try again later');
               
            }
        } catch (error) {
            setError('Something went wrong');
           
        }
    };

    const toggleSignup = () => {
        setError('');
        setAccount(account === 'login' ? 'signup' : 'login');
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={4} className="mx-auto">
                    <Image src={imageURL} alt="blog" className="d-block mx-auto mb-4" />
                    <Form>
                        {account === 'login' ? (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Username"
                                        name="username"
                                        value={login.username}
                                        onChange={onValueChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        name="password"
                                        value={login.password}
                                        onChange={onValueChange}
                                    />
                                </Form.Group>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Button variant="primary" onClick={loginUser} className="w-100">Login</Button>
                                <p className="text-center mt-3">
                                    OR{' '}
                                    <Link to="/forgot-password">Forgot Password</Link>
                                </p>
                                <Button variant="light" onClick={toggleSignup} className="w-100">Create an account</Button>
                            </>
                        ) : (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Your Full Name"
                                        name="fullname"
                                        value={signup.fullname}
                                        onChange={onInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Username"
                                        name="username"
                                        value={signup.username}
                                        onChange={onInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        name="email"
                                        value={signup.email}
                                        onChange={onInputChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        name="password"
                                        value={signup.password}
                                        onChange={onInputChange}
                                    />
                                </Form.Group>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Button variant="primary" onClick={signupUser} className="w-100">Signup</Button>
                                <p className="text-center mt-3">
                                    OR{' '}
                                    <Button variant="light" onClick={toggleSignup}>Already have an account</Button>
                                </p>
                            </>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
