import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { registerAction } from '../reducers/users/registerSlice'
import { Link } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'

export const RegisterScreen = ({ history }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo:userInfoRegister } = userRegister 
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    useEffect(()=>{
        if(userInfoRegister || userInfo){
            history.push('/')
        }
    },[history, userInfoRegister, userInfo])
    const registerHandler = (e) => {
        e.preventDefault()
        dispatch(registerAction({name, email, password}))
    }
    return (
        <>
            {loading && <Loader/>}
            {error && <Message variant='error' message={error} /> }
            <Form onSubmit={registerHandler} className='mx-auto border py-4 px-3 mt-5 rounded formComponent' style={{ width:'30%' }}>
                <h3 className='mt-0 ml-2 mb-2'>Register</h3>
                <Form.Group className='m-2 mt-3'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control style={{ boxShadow:'none' }} value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" required />
                </Form.Group> 
                <Form.Group className='m-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control style={{ boxShadow:'none' }} value={email} onChange={e => setEmail(e.target.value)} type="email" inputmode="email" placeholder="Email" required />
                </Form.Group> 
                <Form.Group className='m-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control style={{ boxShadow:'none' }} value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
                </Form.Group>
                <Form.Group className='m-2 mt-4'>
                    <Button variant="primary" style={{ width:'100%' }} type="submit">Register</Button>
                </Form.Group> 
                <Form.Group className='mb-0 ml-2 mt-3'>
                    <Form.Label>
                        Already a member? 
                        <Link to='/login'>
                            Login here
                        </Link>
                    </Form.Label>
                </Form.Group>
            </Form>
        </>
    )
}
