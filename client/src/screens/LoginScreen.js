import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { loginAction } from '../reducers/users/loginSlice'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { Link } from 'react-router-dom'
 
export const LoginScreen = ({ history }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin
    const loginHandler = (e) => {
        e.preventDefault()
        console.log(email, password)
        dispatch(loginAction({email,password}))
    }
    useEffect(()=>{
        if(userInfo){
            history.push('/')
        }
    },[history, userInfo])
    return (
        <>
            {loading && <Loader/>}
            {error && <Message variant='danger' message={error} /> }
            <Form onSubmit={loginHandler} className='mx-auto border py-4 px-3 mt-5 rounded formComponent' style={{ width:'30%' }}>
                <h3 className='mt-0 ml-2 mb-2'>Login</h3>
                <Form.Group className='m-2 mt-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control style={{ boxShadow:'none' }} type="email" value={email} onChange={e => setEmail(e.target.value)} inputMode="email" placeholder="Email" required />
                </Form.Group> 
                <Form.Group className='m-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control style={{ boxShadow:'none' }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                </Form.Group>
                <Form.Group className='m-2 mt-4'>
                    <Button variant="primary" style={{ width:'100%' }} type="submit">Login</Button>
                </Form.Group> 
                <Form.Group className='mb-0 ml-2 mt-3'>
                    <Form.Label>
                        New to the platform? 
                        <Link to='/register'>
                            Register here
                        </Link>
                    </Form.Label>
                </Form.Group>
            </Form>
        </>
    )
}
