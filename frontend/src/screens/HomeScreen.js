import React, { useState, useEffect } from 'react'
import { Form, Button, ListGroup } from 'react-bootstrap'
import { Sidebar } from '../components/Sidebar'
import SearchIcon from '@material-ui/icons/Search';
import { Tooltip } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { addNoteAction, updateNoteAction } from '../actions/noteActions'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { showNotesAction } from '../actions/noteActions'
import { Note } from '../components/Note'

export const HomeScreen = ({ history }) => {
    const [search, setSearch] = useState("")
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const [errorAddNote, setErrorAddNote] = useState(false)
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { loading:loadingShow, error:errorShow, notes } = userShowNotes
    const userAddNote = useSelector(state => state.userAddNote)
    const { loading, error, success, note } = userAddNote
    const [update, setUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const userUpdateNote = useSelector(state => state.userUpdateNote)
    const { laoding:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdateNote 
    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        else{
            dispatch(showNotesAction())
        }
        if(success || successUpdate){
            setNoteHeading("")
            setNoteContent("")
            setNoteTags("")
            setTimeout(()=>{
                history.push('/')
            },3000)
        }
    },[userInfo, history, success, dispatch, successUpdate])
    const addNoteHandler = (e) => {
        e.preventDefault()
        if(noteHeading!=="" && noteContent!==""){
            dispatch(addNoteAction(noteHeading, noteContent, noteTags.split(',')))
        }
        else{
            setErrorAddNote(true)
        }
    }
    const updateHandler = (e) => {
        e.preventDefault()
        dispatch(updateNoteAction(updateId, noteHeading, noteContent, noteTags.split(',')))
    }
    const setUpdateHandler = (id, heading, content, tags) => {
        setUpdate(true)
        setUpdateId(id)
        setNoteHeading(heading)
        setNoteContent(content)
        setNoteTags(tags.join(','))
    }
    if(errorAddNote){
        setTimeout(()=>{
            setErrorAddNote(false)
        },3000)
    }
    return (
        <div className='newHome'>
            <Sidebar/>
            <div className='newHomeWrapper'>
                <div className='leftPanel border-right'>
                    <div className='d-flex align-items-center pb-2 searchBar'>
                        <div style={{ width:'80%' }}>
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none' }} type="text" placeholder="Search all notes"/>
                        </div>
                        <div style={{ width:'15%', marginLeft:'10px' }}>
                            <Button style={{ width:'100%' }} className='ml-2 py-1'>
                                <SearchIcon/>
                            </Button>
                        </div>
                    </div>
                    {loadingShow 
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <ListGroup style={{width:'96%' }} className='tableAllNotes rounded-0'>
                        <ListGroup.Item className='py-1 px-3 rounded-0' style={{ display:'flex', justifyContent:'space-between' }}>
                            <div className='h6'>Title</div>
                            <div className='h6'>Updated</div>
                        </ListGroup.Item>
                        {notes && notes.map(note => (
                            <div key={note._id} onClick={e => setUpdateHandler(note._id, note.noteHeading, note.noteContent, note.noteTags)}>
                                <Note heading={note.noteHeading} updated={note.updatedAt.slice(0,10)} />
                            </div>
                        ))}
                    </ListGroup>
                    :
                    !userInfo 
                    ?<Message variant='danger' message="Please login to view you notes" /> 
                    :
                    <div>No notes until now</div>
                    }
                </div>
                <div className='rightPanel'>
                    {(loading || loadingUpdate) && <Loader/>}
                    {(error || errorAddNote || errorUpdate) && <Message message={error || errorUpdate || "Note heading and content cannot be empty"} variant="danger" />}
                    {success && <Message message={note.message} variant="success" />}
                    {successUpdate && <Message message="Updated successfully" variant="success" />}
                    {!userInfo 
                    ?<Message variant='danger' message="Please login to add note" /> 
                    :<Form onSubmit={!update ? addNoteHandler : updateHandler} className='mx-auto'>
                        <Form.Group className='my-2 border-bottom'>
                            <Form.Control className='font-weight-bold' style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none' }} value={noteHeading} placeholder="Add Heading" onChange={e => setNoteHeading(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='d-flex border-bottom pb-2' style={{ justifyContent:'flex-start', width:'100%' }}>
                            <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'>H1</Button>
                            <Button style={{ boxShadow:'none' }} variant='light' className='mx-2'>H2</Button>
                            <Button style={{ boxShadow:'none', fontWeight:'bold' }} variant='light' className='mx-2'>B</Button>
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
                        <Form.Group className='mt-2 pt-2 pl-3'>
                            {!update 
                            ? <Button type='submit' className='buttonNote mx-auto' disabled={update} style={{ boxShadow:'none' }}>Add Note</Button>
                            : <Button type='submit' className='buttonNote mx-auto' style={{ boxShadow:'none' }}>Update Note</Button>}
                        </Form.Group>
                    </Form>}
                </div>   
            </div>
        </div>
    )
}
