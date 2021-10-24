import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Sidebar } from '../components/Sidebar'
import { Tooltip } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { addNoteAction } from '../actions/noteActions'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'

export const AddNoteScreen = ({ history }) => {
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()
    const userAddNote = useSelector(state => state.userAddNote)
    const { loading, error, success, note } = userAddNote
    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        if(success){
            setTimeout(()=>{
                history.push('/')
            },3000)
        }
    },[userInfo, history, success])
    const addNoteHandler = (e) => {
        e.preventDefault()
        dispatch(addNoteAction(noteHeading, noteContent, noteTags.split(',')))
    }
    return (
        <>
            <Sidebar/>
            {loading && <Loader/>}
            {error && <Message message={error} variant="danger" />}
            {success && <Message message={note.message} variant="success" />}
            <Form onSubmit={addNoteHandler} style={{ left:'6rem', paddingTop:'1rem', width:'75%', paddingLeft:'2rem' }} className='mx-auto'>
                <Form.Group className='my-2 border-bottom'>
                    <Form.Control className='font-weight-bold' style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none' }} value={noteHeading} placeholder="Add Heading" onChange={e => setNoteHeading(e.target.value)} />
                </Form.Group>
                <Form.Group className='d-flex border-bottom pb-2' style={{ justifyContent:'flex-start', width:'100%' }}>
                    <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'>H1</Button>
                    <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'>H2</Button>
                    <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'>B</Button>
                    <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'><em>I</em></Button>
                    <Button variant='light' className='mx-2' style={{ textDecoration:'underline', boxShadow:'none' }}>U</Button>
                </Form.Group>
                <Form.Group className='my-2 border-bottom'>
                    <Form.Control rows={10} as='textarea' style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} value={noteContent} placeholder="Add Content" onChange={e => setNoteContent(e.target.value)} />
                </Form.Group>
                <Form.Group className='my-2 border-bottom'>
                    <Tooltip placement='top-start' title='comma separated values'>
                        <Form.Control style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} value={noteTags} placeholder="Add Tags" onChange={e => setNoteTags(e.target.value)} />
                    </Tooltip>
                </Form.Group>
                <Form.Group className='mt-2 pt-2'>
                    <Button type='submit' style={{ boxShadow:'none' }}>Add Note</Button>
                </Form.Group>
            </Form>
        </>
    )
}
