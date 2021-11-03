import React, { useState, useEffect, useCallback } from 'react'
import { Form, Navbar, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { addNoteAction } from '../reducers/notes/addNoteSlice'
import { updateNoteAction } from '../reducers/notes/updateNoteSlice'
import { deleteNoteAction } from '../reducers/notes/deleteNoteSlice'
import { showNotesAction } from '../reducers/notes/showNoteSlice'
import { logoutAction } from '../reducers/users/loginSlice'
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
import CloseIcon from '@material-ui/icons/Close';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export const HomeScreen = ({ history }) => {

    const [search, setSearch] = useState("")
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const [showNoteTags, setShowNoteTags] = useState([])
    const [addNote, setAddNote] = useState(false)
    const [update, setUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const [errorAddNote, setErrorAddNote] = useState(false)
    const [noteUpdatedAt, setNoteUpdatedAt] = useState("")
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { error:errorShow, notes } = userShowNotes
    
    const userAddNote = useSelector(state => state.userAddNote)
    const { loading, error, success, note } = userAddNote
    
    const userUpdateNote = useSelector(state => state.userUpdateNote)
    const { laoding:loadingUpdate, error:errorUpdate } = userUpdateNote 
    
    const userDeleteNote = useSelector(state => state.userDeleteNote)
    const { loading:loadingDelete, error:errorDelete, success:successDelete } = userDeleteNote 

    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        else{
            dispatch(showNotesAction(userInfo._id))
        }
        if(successDelete){
            setNoteHeading("")
            setNoteContent("")
            setNoteTags("")
            setShowNoteTags([])
            setTimeout(()=>{
                history.push('/')
            },3000)
        }
    },[userInfo, history, dispatch, successDelete])

    const tagsHandler = (e) => {
        setNoteTags(e.target.value)
        if(e.target.value.slice(-1)===','){
            setNoteTags('')
            setShowNoteTags([...showNoteTags,e.target.value.slice(0,-1)])
            setNoteTags("")
        }
    }
    
    const setUpdateHandler = (id, heading, content, tags, date) => {
        setUpdate(true)
        setUpdateId(id)
        setNoteUpdatedAt(getDate(date))
        setNoteHeading(heading)
        setNoteContent(content)
        setShowNoteTags([...tags])
        setAddNote(true)
    }

    const logoutHandler = () => {
        console.log("logged out")
        dispatch(logoutAction())
    }
    
    if(errorAddNote){
        setTimeout(()=>{
            setErrorAddNote(false)
        },3000)
    }

    const date = new Date()

    const getDate = useCallback((date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${date.slice(8)} ${months[parseInt(date.slice(5,7))-1]}  ${date.slice(2,4)}`
    },[])

    const printHandler = (divName) => {
        let printContents = document.getElementById(divName).children[1].innerHTML
        let originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
    }

    const deleteNoteHandler = (e, id) => {
        e.preventDefault()
        setUpdate(false)
        setAddNote(false)
        dispatch(deleteNoteAction(id))
    }

    const newNoteHandler = (e) => {
        setUpdate(false)
        setNoteHeading("")
        setNoteContent("")
        setNoteTags("")
        setShowNoteTags([])
        setAddNote(true)
        dispatch(addNoteAction({heading:"Untitled",content:"Untitled"}))
    }
    
    useEffect(() => {
        if(success){
            if(note){
                setUpdateId(note.noteId)
                setNoteHeading(note.noteHeading)
                setNoteContent(note.noteContent)
                setShowNoteTags(note.noteTags)
                setNoteUpdatedAt(getDate(note.updatedAt.slice(0,10)))
            }
            setUpdate(true)
        }
    },[success,note,getDate])

    useEffect(()=>{
        if(update){
            setTimeout(()=>{
                dispatch(updateNoteAction({id:updateId, heading:noteHeading, content:noteContent, tags:showNoteTags}))
            },1000)
        }
    },[updateId, noteHeading, dispatch, update, noteContent, showNoteTags])

    const deleteTagHandler = (tag) => {
        setShowNoteTags(showNoteTags.filter(eachTag => eachTag!==tag))
    }

    return (
        <div className='newHome'>
            <div style={{ backgroundColor:'black', width:'max-content', color:'white', height:'100vh !important', alignItems:'center', display:'flex', flexDirection:'column', padding:'0.3rem 0.5rem' }}>
                <Link to='/' style={{ color:'white', textDecoration:'none' }}>
                    <div style={{ cursor:'pointer' }} className='my-2 h4'>Nt</div>
                </Link>
                <Tooltip title="Add new note" placement="right">
                    <div style={{ cursor:'pointer' }} className='my-2' onClick={e => newNoteHandler(e)} ><CreateIcon /></div>
                </Tooltip>
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
                <div className='leftPanel' style={{ borderRight:'1px solid rgb(235, 235, 235)' }}>
                    <Navbar fixed="top" className='d-flex w-100 searchBar' style={{ alignItems:'center' }} >
                        <div style={{ flex:0.2, fontWeight:500, fontSize:'1.2rem', cursor:'pointer' }} className='text-center'>
                            All Notes
                        </div>
                        <div style={{ flex:0.7 }}>
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none', padding:'0 10px 2px 10px', height:'2.3rem' }} type="text" placeholder="Search all notes"/>
                        </div>
                        <div style={{ flex:0.1, textAlign:'center', cursor:'pointer' }}>
                            <EditIcon/>
                        </div>
                    </Navbar>
                    {loadingDelete
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <div style={{width:'100%', paddingTop:'0.5rem' }} className='tableAllNotes rounded-0'>
                        <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:'0.5rem' }}>
                            <div className='pl-3'>TITLE</div>
                            <div className='pr-3' style={{ textAlign:'right' }}>UPDATED</div>
                        </div>
                        <div className='border-0'>
                            {notes && notes.map((note,index) => (
                                <div className={index%2===0 ? 'note border-0 p-0 d-flex even' : 'note odd border-0 p-0 d-flex'} key={note._id} onClick={e => setUpdateHandler(note._id, note.noteHeading, note.noteContent, note.noteTags, note.updatedAt.slice(0,10))} style={{ cursor:'pointer', alignItems:'center', justifyContent:'space-between' }}>
                                    <div className='pl-3 py-1' style={{ fontWeight:500 }}>{note.noteHeading}</div>
                                    <div className='pr-3 py-1 updatedTr' style={{ textAlign:'right', fontWeight:500, fontSize:13 }}>{getDate(note.updatedAt.slice(0,10))}</div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                    {successDelete && <Message message="Deleted successfully" variant="success" />}
                    {!userInfo 
                    ?<Message variant='danger' message="Please login to add note" /> 
                    :<Form className={addNote || update ? 'mx-auto' : 'mx-auto disabledform'}>
                        <Form.Label style={{ padding:'0.25rem 0.3rem 0.25rem 0.7rem', width:'100%' }} className='headingRight'>
                            <div className='headingRightOne'>
                                <div style={{ fontWeight:'500', fontSize:'1.29rem' }}>
                                    {update && noteHeading ? noteHeading : "Add Note"}
                                </div>
                                <div className='headingRight-date' style={{ color:'gray', fontWeight:'500', fontSize:'0.75rem' }}>
                                    {update && noteUpdatedAt ?  `UPDATED : ${noteUpdatedAt}` : date && `${date.toString().slice(8,10)} ${date.toString().slice(4,7)} ${date.toString().slice(13,15)}`}
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
                        <Form.Group className='py-2 pl-3' style={{ borderBottom:'1px solid rgb(235, 235, 235)' }}>
                            <Form.Control disabled={!addNote && !update} style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none', fontWeight:'500' }} value={noteHeading} placeholder="Add Heading" onChange={e => setNoteHeading(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='my-0 pl-3 tags' style={{ borderBottom:'1px solid rgb(235, 235, 235)' }}>
                            <div className='tagsDivOne'>
                                {showNoteTags.map((tag,index) => (
                                    <div>
                                        <Badge className='p-1 mx-1' key={index} style={{ fontSize:'0.85rem',backgroundColor:'#007bff !important', fontWeight:'500', textTransform:'uppercase', alignItems:'center', display:'flex' }}>
                                            {tag}
                                            <span className='ml-1'>
                                                <CloseIcon style={{ color:'#007bff', fontSize:'0.8rem', cursor:'pointer', backgroundColor:'lightblue', borderRadius:'50%' }} onClick={e => deleteTagHandler(tag)} />
                                            </span>
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <div className='tagsDivTwo'>
                                <Tooltip placement='top-start' title='comma separated values'>
                                    <Form.Control disabled={!addNote && !update} style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} value={noteTags} placeholder="Add Tags" onChange={e => tagsHandler(e)} />
                                </Tooltip>
                            </div>
                        </Form.Group>
                        <ReactQuill readOnly={!addNote && !update} value={noteContent} id="print" onChange={e => setNoteContent(e)}></ReactQuill>
                    </Form>}
                </div>   
            </div>
        </div>
    )
}
