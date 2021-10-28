import React, { useState, useEffect } from 'react'
import { Form, Button, Table, Navbar, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addNoteAction, updateNoteAction, deleteNoteAction } from '../actions/noteActions'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { showNotesAction } from '../actions/noteActions'
import { userLogoutAction } from '../actions/authActions'
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip'
import SearchIcon from '@material-ui/icons/Search';
import LinkIcon from '@material-ui/icons/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import EditIcon from '@material-ui/icons/Edit';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export const HomeScreen = ({ history }) => {

    const [search, setSearch] = useState("")
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const [update, setUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const [errorAddNote, setErrorAddNote] = useState(false)
    const [noteUpdatedAt, setNoteUpdatedAt] = useState("")
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { loading:loadingShow, error:errorShow, notes } = userShowNotes
    
    const userAddNote = useSelector(state => state.userAddNote)
    const { loading, error, success, note } = userAddNote
    
    
    const userUpdateNote = useSelector(state => state.userUpdateNote)
    const { laoding:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdateNote 
    
    const userDeleteNote = useSelector(state => state.userDeleteNote)
    const { loading:loadingDelete, error:errorDelete, success:successDelete } = userDeleteNote 

    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        else{
            dispatch(showNotesAction())
        }
        if(success || successUpdate || successDelete){
            setNoteHeading("")
            setNoteContent("")
            setNoteTags("")
            setTimeout(()=>{
                history.push('/')
            },3000)
        }
    },[userInfo, history, success, dispatch, successUpdate, successDelete])
    
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
    
    const setUpdateHandler = (id, heading, content, tags, date) => {
        setUpdate(true)
        setUpdateId(id)
        setNoteUpdatedAt(getDate(date))
        setNoteHeading(heading)
        setNoteContent(content)
        setNoteTags(tags.join(','))
    }

    const logoutHandler = () => {
        dispatch(userLogoutAction())
    }
    
    if(errorAddNote){
        setTimeout(()=>{
            setErrorAddNote(false)
        },3000)
    }

    const date = new Date()

    const getDate = (date) => {
        return `${date.slice(8)} ${months[parseInt(date.slice(5,7))-1]}  ${date.slice(2,4)}`
    }

    const printHandler = (divName) => {
        let printContents = document.getElementById(divName).children[1].innerHTML
        let originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
    }

    const deleteNoteHandler = (e, id) => {
        e.preventDefault()
        dispatch(deleteNoteAction(id))
    }

    return (
        <div className='newHome'>
            <div style={{ backgroundColor:'black', width:'max-content', color:'white', height:'100vh !important', alignItems:'center', display:'flex', flexDirection:'column', padding:'0.8rem 0.5rem' }}>
                <Link to='/' style={{ color:'white', textDecoration:'none' }}>
                    <div style={{ cursor:'pointer' }} className='my-2 h4'>Nt</div>
                </Link>
                <div style={{ cursor:'pointer' }} className='my-2'><CreateIcon /></div>
                <div style={{ cursor:'pointer' }} className='my-2'><SearchIcon /></div>
                <div style={{ cursor:'pointer' }} className='my-2'><SettingsIcon /></div>
                {userInfo && 
                    <Tooltip title='Logout' placement="right">
                        <div style={{ cursor:'pointer' }} className='my-2' onClick={logoutHandler}>
                            <PowerSettingsNewIcon />
                        </div>
                    </Tooltip>
                }
                {!userInfo && 
                <Link to="/login" style={{ color:'white' }}>
                    <div style={{ cursor:'pointer' }} className='my-2'><ExitToAppIcon/></div>
                </Link>
                }
            </div>
            <div className='newHomeWrapper'>
                <div className='leftPanel border-right'>
                    <Navbar fixed="top" className='d-flex w-100 searchBar' style={{ alignItems:'center' }} >
                        <div style={{ flex:0.2, fontWeight:700, fontSize:'1.2rem', cursor:'pointer' }} className='text-center'>
                            All Notes
                        </div>
                        <div style={{ flex:0.7 }}>
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none', padding:'0 10px 2px 10px', height:'2.3rem' }} type="text" placeholder="Search all notes"/>
                        </div>
                        <div style={{ flex:0.1, textAlign:'center', cursor:'pointer' }}>
                            <EditIcon/>
                        </div>
                    </Navbar>
                    {(loadingShow || loadingDelete) 
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <Table responsive striped size="sm" style={{width:'100%' }} className='tableAllNotes rounded-0'>
                        <thead>
                            <tr>
                                <th className='pl-3'>TITLE</th>
                                <th className='pr-3' style={{ textAlign:'right' }}>UPDATED</th>
                            </tr>
                        </thead>
                        <tbody className='border-0'>
                            {notes && notes.map(note => (
                                <tr className='note border-0 p-0' key={note._id} onClick={e => setUpdateHandler(note._id, note.noteHeading, note.noteContent, note.noteTags, note.updatedAt.slice(0,10))} style={{ cursor:'pointer' }}>
                                    <td className='pl-3 py-1' style={{ fontWeight:500 }}>{note.noteHeading}</td>
                                    <td className='pr-3 py-1 updatedTr' style={{ textAlign:'right', fontWeight:500, fontSize:13 }}>{getDate(note.updatedAt.slice(0,10))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    :
                    !userInfo 
                    ?<Message variant='danger' message="Please login to view you notes" /> 
                    :
                    <div>No notes until now</div>
                    }
                </div>
                <div className='rightPanel'>
                    {(loading || loadingUpdate || loadingDelete) && <Loader/>}
                    {(error || errorAddNote || errorUpdate || errorDelete) && <Message message={error || errorUpdate || errorDelete || "Note heading and content cannot be empty"} variant="danger" />}
                    {success && <Message message={note.message} variant="success" />}
                    {successUpdate && <Message message="Updated successfully" variant="success" />}
                    {successDelete && <Message message="Deleted successfully" variant="success" />}
                    {!userInfo 
                    ?<Message variant='danger' message="Please login to add note" /> 
                    :<Form onSubmit={!update ? addNoteHandler : updateHandler} className='mx-auto'>
                        <Form.Label style={{ padding:'0.25rem 0.3rem 0.25rem 0.7rem', width:'100%' }} className='headingRight border-bottom'>
                            <div className='headingRightOne'>
                                <div style={{ fontWeight:'700', fontSize:'1.29rem' }}>
                                    {update && noteHeading ? noteHeading : "Add Note"}
                                </div>
                                <div className='headingRight-date' style={{ color:'gray', fontWeight:'500', fontSize:'0.75rem' }}>
                                    {noteUpdatedAt ?  `UPDATED : ${noteUpdatedAt}` : date && `${date.toString().slice(8,10)} ${date.toString().slice(4,7)} ${date.toString().slice(13,15)}`}
                                </div>
                            </div>
                            {update && 
                            <div>
                                {window.innerWidth>600 && <LinkIcon className='mx-2' style={{ fontSize:'1.5rem', cursor:'pointer' }} />}
                                {window.innerWidth>600 && <GetAppIcon className='mx-2' style={{ fontSize:'1.3rem', cursor:'pointer' }} />}
                                <DeleteIcon className='mx-2' onClick={e => deleteNoteHandler(e, updateId)} style={{ fontSize:'1.3rem', cursor:'pointer' }} />
                                {window.innerWidth>600 && <PrintIcon onClick={e => printHandler("print")} className='mx-2' style={{ fontSize:'1.3rem', cursor:'pointer' }} />}
                            </div>}
                        </Form.Label>
                        <Form.Group className='py-3 pl-3 border-bottom'>
                            <Form.Control className='font-weight-bold' style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none' }} value={noteHeading} placeholder="Add Heading" onChange={e => setNoteHeading(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='my-0 pl-3 tags border-bottom'>
                            <div className='tagsDivOne'>
                                {noteTags && noteTags.split(',').map(tag => (
                                    <Badge className='p-1 mx-1' style={{ fontSize:'0.9rem' }}>{tag}</Badge>
                                ))}
                            </div>
                            <div className='tagsDivTwo'>
                                <Tooltip placement='top-start' title='comma separated values'>
                                    <Form.Control style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} value={noteTags} placeholder="Add Tags" onChange={e => setNoteTags(e.target.value)} />
                                </Tooltip>
                            </div>
                        </Form.Group>
                        <ReactQuill value={noteContent} id="print" onChange={e => setNoteContent(e)}></ReactQuill>
                        <Form.Group className='mt-5 pt-0 pl-1 w-100'>
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
