import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { debounce } from 'lodash'
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
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
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
    const { loading:loadingShow, error:errorShow, notes } = userShowNotes
    
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

    const delayedQuery = useCallback(debounce((updateId, noteHeading, noteContent, showNoteTags) => dispatch(updateNoteAction({id:updateId, heading:noteHeading, content:noteContent, tags:showNoteTags})),500),[])

    useEffect(()=>{
        if(update){
            delayedQuery(updateId, noteHeading, noteContent, showNoteTags)
        }
    },[updateId, noteHeading, dispatch, update, noteContent, showNoteTags, delayedQuery])

    const deleteTagHandler = (tag) => {
        setShowNoteTags(showNoteTags.filter(eachTag => eachTag!==tag))
    }
    const imageHandler = () => { 
        document.getElementById('inputimage').click()
    }
    const modules = useMemo(() => ({
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['image', 'code-block'],
            ['link'],
             [{'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}]
          ],
          handlers: {
            image: imageHandler
          }
        }
      }), [])

      const uploadHandler = async (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
      }

    return (
        <div className='newHome'>
            <div className='sidebar' style={{ backgroundColor:'black', width:'max-content', color:'white', height:'100vh !important', alignItems:'center', display:'flex', flexDirection:'column', padding:'0.3rem 0.5rem' }}>
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
                <div className='leftPanel' style={{ borderRight:'1px solid rgb(235, 235, 235)' }}>
                    <Navbar fixed="top" className='d-flex w-100 searchBar' style={{ alignItems:'center' }} >
                        <div style={{ flex:1, padding:'4px 16px' }}>
                            <Form.Control value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none', padding:'0 10px 2px 10px', height:'2.3rem', letterSpacing:'0.8px' }} type="text" placeholder="Search all notes"/>
                        </div>
                    </Navbar>
                    {loadingDelete || loadingShow
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <div style={{width:'100%', paddingTop:'0.06rem' }} className='tableAllNotes rounded-0'>
                        <div className='border-0 notes'>
                            {notes && notes.map((note,index) => (
                                <>
                                <div className='note border-0 p-0' key={index} onClick={e => setUpdateHandler(note._id, note.noteHeading, note.noteContent, note.noteTags, note.updatedAt.slice(0,10))} style={{ cursor:'pointer', borderRadius:'0px' }}>
                                    <div className='d-flex pb-1' style={{ alignItems:'center', justifyContent:'space-between' }}>
                                        <div className='pl-3' style={{ fontWeight:500, fontSize:18, letterSpacing:'1.2px' }}>{note.noteHeading}</div>
                                        <div className='pl-3 updatedTr' style={{ fontWeight:500, fontSize:13 }}>{getDate(note.updatedAt.slice(0,10))}</div>
                                    </div>
                                    <div className='pl-3 pb-1' style={{ fontWeight:500, fontSize:15, color:'#6c6c6c' }}>{note.noteContent.replace(/<\/?[^>]+(>|$)/g, "").split(' ').slice(0,10).join(' ')}...</div>
                                </div>
                                <hr/>
                                </>
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
                    : addNote || update 
                    ? <Form>
                        <Form.Label style={{ padding:'0.5rem 0.3rem 0.5rem 0.7rem', width:'100%' }} className='headingRight'>
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
                                        <Badge className='p-1 mx-1' key={index} style={{ fontSize:'0.85rem', fontWeight:'500', textTransform:'uppercase', alignItems:'center', display:'flex' }}>
                                            {tag}
                                            <span className='ml-1'>
                                                <CloseIcon style={{ color:'white', fontSize:'0.8rem', cursor:'pointer', borderRadius:'50%' }} onClick={e => deleteTagHandler(tag)} />
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
                        <input type='file' accept='image/*' id='inputimage' style={{ display:'none' }} onChange={uploadHandler} />
                        <ReactQuill modules={modules} readOnly={!addNote && !update} value={noteContent} id="print" onChange={e => setNoteContent(e)}></ReactQuill>
                    </Form>
                    :<Tooltip placement="top" title="Add New Note">
                        <div style={{ borderRadius:'50%', position:'fixed', bottom:'2rem', right:"2rem", backgroundColor:'#ececec', border:'1px solid rgb(210,210,210)', padding:'0.4rem', cursor:'pointer', boxShadow:'1px 1px 3px gray' }}>
                            <AddIcon style={{ fontSize:"2rem" }} onClick={e => newNoteHandler(e)} />
                        </div>
                    </Tooltip> 
                    }
                </div>   
            </div>
        </div>
    )
}
