import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Form, Navbar, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { addNoteAction } from '../reducers/notes/addNoteSlice'
import { updateNoteAction } from '../reducers/notes/updateNoteSlice'
import { deleteNoteAction } from '../reducers/notes/deleteNoteSlice'
import { showNotesAction } from '../reducers/notes/showNoteSlice'
import { getNoteByIdAction } from '../reducers/notes/getNoteByIdSlice'
import { shareNoteAction } from '../reducers/notes/shareNoteSlice'
import { Sidebar } from '../components/Sidebar'
import { debounce } from 'lodash'
import { useLocation } from 'react-router-dom'
import converter from 'html-to-markdown'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ShareIcon from '@material-ui/icons/Share';
import LinkIcon from '@material-ui/icons/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import 'react-quill/dist/quill.snow.css';

export const HomeScreen = ({ history }) => {

    const searchId = useLocation().search
    const noteidFromUrl = new URLSearchParams(searchId).get("id") 

    const [search, setSearch] = useState("")
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const [showNoteTags, setShowNoteTags] = useState([])
    const [noteUsersEdit, setNoteUsersEdit] = useState([])
    const [addNote, setAddNote] = useState(false)
    const [update, setUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const [errorAddNote, setErrorAddNote] = useState(false)
    const [noteUpdatedAt, setNoteUpdatedAt] = useState("")
    const [share, setShare] = useState(false)
    const [url, setUrl] = useState('')
    const [can, setCan] = useState("Can view")
    const [toEmails, setToEmails] = useState('')
    
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { loading:loadingShow, error:errorShow, notes, success:successShow } = userShowNotes
    
    const userAddNote = useSelector(state => state.userAddNote)
    const { loading, error, success, note } = userAddNote
    
    const userUpdateNote = useSelector(state => state.userUpdateNote)
    const { laoding:loadingUpdate, error:errorUpdate } = userUpdateNote 
    
    const userDeleteNote = useSelector(state => state.userDeleteNote)
    const { loading:loadingDelete, error:errorDelete, success:successDelete } = userDeleteNote 

    const userGetNoteById = useSelector(state => state.userGetNoteById)
    const { success:successGetById, note:noteId } = userGetNoteById

    const userShareNote = useSelector(state => state.userShareNote)
    const { loading:loadingShare, error:errorShare, success:successShare } = userShareNote

    useEffect(()=>{
        if(!userInfo){
            history.push('/login')
        }
        else{
            dispatch(showNotesAction(userInfo._id))
            Quill.register("modules/imageUploader", ImageUploader);
        }
        if(successDelete){
            setNoteHeading("")
            setNoteContent("")
            setNoteTags("")
            setShowNoteTags([])
            setTimeout(()=>{
                history.push('/note')
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
    
    const setUpdateHandler = (id) => {
        history.push({
            pathname:"/note",
            search:`id=${id}`
        })
        setUpdateId(id)
        dispatch(getNoteByIdAction(id))
    }

    const date = useMemo(() => {new Date()},[])

    const getDate = useCallback((date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${date.slice(8)} ${months[parseInt(date.slice(5,7))-1]}  ${date.slice(2,4)}`
    },[])

    useEffect(() => {
        if(successGetById){
            setUpdate(true)
            setNoteUpdatedAt(getDate(noteId.updatedAt.slice(0,10)))
            setNoteHeading(noteId.noteHeading)
            setNoteContent(noteId.noteContent)
            setShowNoteTags([...noteId.noteTags])
            setNoteUsersEdit(noteId.usersEdit)
            setAddNote(true)
        }
    },[successGetById, noteId.noteHeading, noteId.noteContent, noteId.noteTags, getDate, noteId.updatedAt, noteId.usersView, noteId.usersEdit])
    
    if(errorAddNote){
        setTimeout(()=>{
            setErrorAddNote(false)
        },3000)
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
                setNoteUsersEdit(note.usersEdit)
                setNoteUpdatedAt(getDate(note.updatedAt.slice(0,10)))
                dispatch(showNotesAction(userInfo._id))
            }
            setUpdate(true)
            history.push({
                pathname:'/note',
                search:`id=${note.noteId}`
            }) 
        }
    },[success,note,getDate,history,dispatch,userInfo._id])

    const delayedQuery = useCallback(debounce((updateId, noteHeading, noteContent, showNoteTags) => dispatch(updateNoteAction({id:updateId, heading:noteHeading, content:noteContent, tags:showNoteTags})),300),[])

    useEffect(()=>{
        if(update){
            delayedQuery(updateId, noteHeading, noteContent, showNoteTags)
        }
    },[updateId, noteHeading, dispatch, update, noteContent, showNoteTags, delayedQuery])

    const deleteTagHandler = (tag) => {
        setShowNoteTags(showNoteTags.filter(eachTag => eachTag!==tag))
    }

    const modules = useMemo(() => ({
        toolbar: [{ header: [1, 2, 3, 4, 5, 6] },'bold', 'italic', 'underline','image', { list: 'ordered' }, { list: 'bullet' },'code-block','link',{'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}],
        imageUploader: {
          upload: file => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append("image", file);
    
              fetch(
                "https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22",
                {
                  method: "POST",
                  body: formData
                }
              )
                .then(response => response.json())
                .then(result => {
                  console.log(result);
                  resolve(result.data.url);
                })
                .catch(error => {
                  reject("Upload failed");
                  console.error("Error:", error);
                });
            });
          }
        }
      }), [])

    const uploadHandler = async (e) => {
        e.preventDefault();
        console.log(e.target.files[0])
    }

    const downLoadhandler = (content) => {
        console.log(converter.convert(content))
    }

    useEffect(() => {
        if(successShow){
            if(noteidFromUrl!==null){
                setUpdateId(noteidFromUrl)
                dispatch(getNoteByIdAction(noteidFromUrl))
            }
            else{
                if(successShow && notes && notes.length>0){
                    history.push({
                        pathname:'/note',
                        search:`id=${notes[0]._id}`
                    })
                    setUpdateId(notes[0]._id)
                    dispatch(getNoteByIdAction(notes[0]._id))
                }
            }
        }
    },[noteidFromUrl, successShow, dispatch, notes, history])

    const shareNote = () => {
        setShare(true)
        setUrl(window.location.href)
    }

    const onCloseShareNote = () => {
        setShare(false)
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    const copyNote = () => {
        dispatch(addNoteAction({heading:noteHeading,content:noteContent, tags:showNoteTags}))
    }

    const shareNoteActionUser = (email, to, link, id, access) => {
        dispatch(shareNoteAction({fromEmail:email, toEmails:to, link:link, id:id, access:access }))
    }

    if(successShare){
        setTimeout(() => {
            setShare(false)
        },2000)
    }

    return (
        <div className='newHome'>
            <Sidebar/>
            <div className='newHomeWrapper'>
                <div className='leftPanel' style={{ borderRight:'1px solid rgb(235, 235, 235)' }}>
                    <Navbar fixed="top" className='d-flex w-100 searchBar' style={{ flexDirection:'column' }} >
                        <div className='h5' style={{ textAlign:'left', width:'90%', padding:'0px 4px 4px 4px', letterSpacing:'0.8px' }}>Anotated PDFs</div>
                        <div style={{ flex:1, padding:'4px 1px', width:'90%' }}>
                            <Form.Control className="leftpanelsearch" value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none', padding:'0 10px 2px 10px', height:'2.3rem', letterSpacing:'0.8px' }} type="text" placeholder="Filter by company"/>
                        </div>
                    </Navbar>
                    {loadingDelete || loadingShow
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <div style={{width:'100%', paddingTop:'0.05rem' }} className='tableAllNotes rounded-0'>
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
                    ?<Message variant='error' message="Please login to view you notes" /> 
                    :
                    <div className='noNotes'>Your notes will appear here.</div>
                    }
                </div>
                <div className='leftPanel' style={{ borderRight:'1px solid rgb(235, 235, 235)' }}>
                    <Navbar fixed="top" className='d-flex w-100 searchBar' style={{ alignItems:'center', flexDirection:'column' }} >
                    <div className='h5' style={{ textAlign:'left', width:'90%', padding:'0px 4px 4px 4px', letterSpacing:'0.8px' }}>Notes</div>
                        <div style={{ flex:1, padding:'4px 1px', width:'90%' }}>
                            <Form.Control value={search} className='leftpanelsearch' onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none', padding:'0 10px 2px 10px', height:'2.3rem', letterSpacing:'0.8px' }} type="text" placeholder="Search all notes"/>
                        </div>
                    </Navbar>
                    {loadingDelete || loadingShow
                    ? <Loader />
                    : errorShow 
                    ? <Message message={errorShow} variant="danger" />
                    : notes && notes.length>0
                    ?
                    <div style={{width:'100%', paddingTop:'0.05rem' }} className='tableAllNotes rounded-0'>
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
                    ?<Message variant='error' message="Please login to view you notes" /> 
                    :
                    <div className='noNotes'>Your notes will appear here.</div>
                    }
                </div>
                <div className='rightPanel'>
                    {(loading || loadingUpdate || loadingDelete || loadingShare) && <Loader/>}
                    {(error || errorAddNote || errorUpdate || errorDelete || errorShare) && <Message message={error || errorShare || errorUpdate || errorDelete || "Note heading and content cannot be empty"} variant="danger" />}
                    {successDelete && <Message message="Deleted successfully" variant="success" />}
                    {!userInfo 
                    ?<Message variant='error' message="Please login to add note" /> 
                    : (addNote || update) &&
                    <Form>
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
                                {userInfo && userInfo._id && noteId.user!==userInfo._id && 
                                    <Tooltip title="Copy note" placement="bottom">
                                        <Button className='mx-2 py-1' onClick={copyNote} style={{ backgroundColor:'rgb(26, 92, 190)', color:'white', fontWeight:'600', letterSpacing:'1px' }}>COPY</Button>
                                    </Tooltip>
                                }
                                {window.innerWidth>600 && userInfo && notes && notes.find(each => each._id===updateId) &&
                                    <Tooltip title="Share note" placement="bottom">
                                        <ShareIcon className='mx-2' onClick={shareNote} style={{ fontSize:'1.2rem', cursor:'pointer' }} />
                                    </Tooltip>
                                }
                                {window.innerWidth>600 && <LinkIcon className='mx-2' style={{ fontSize:'1.5rem', cursor:'pointer' }} />}
                                {window.innerWidth>600 && <GetAppIcon onClick={ e => downLoadhandler(noteContent) } className='mx-2' style={{ fontSize:'1.3rem', cursor:'pointer' }} />}
                                <DeleteIcon className='mx-2' onClick={e => deleteNoteHandler(e, updateId)} style={{ fontSize:'1.3rem', cursor:'pointer' }} />
                                {window.innerWidth>600 && <PrintIcon onClick={e => printHandler("print")} className='mx-2' style={{ fontSize:'1.3rem', cursor:'pointer' }} />}
                            </div>}
                        </Form.Label>
                        <Form.Group className='py-2 pl-3' style={{ borderBottom:'1px solid rgb(235, 235, 235)' }}>
                            <Form.Control disabled={userInfo && userInfo.email && !noteUsersEdit.includes(userInfo.email)} style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none', fontWeight:'500' }} value={noteHeading} placeholder="Add Heading" onChange={e => setNoteHeading(e.target.value)} />
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
                                    <Form.Control disabled={userInfo && userInfo.email && !noteUsersEdit.includes(userInfo.email)} style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} value={noteTags} placeholder="Add Tags" onChange={e => tagsHandler(e)} />
                                </Tooltip>
                            </div>
                        </Form.Group>
                        <input type='file' accept='image/*' id='inputimage' style={{ display:'none' }} onChange={uploadHandler} />
                        <ReactQuill modules={modules} readOnly={userInfo && userInfo.email && !noteUsersEdit.includes(userInfo.email)} value={noteContent} id="print" onChange={e => setNoteContent(e)}></ReactQuill>
                    </Form>
                    }
                    <Tooltip placement="top" title="Add New Note">
                        <div style={{ borderRadius:'50%', position:'fixed', bottom:'2rem', right:"2rem", backgroundColor:'#ececec', border:'1px solid rgb(210,210,210)', padding:'0.4rem', cursor:'pointer', boxShadow:'1px 1px 3px gray' }}>
                            <AddIcon style={{ fontSize:"2rem" }} onClick={e => newNoteHandler(e)} />
                        </div>
                    </Tooltip> 
                    <Dialog open={share} onClose={onCloseShareNote}>
                        <DialogTitle className='pb-1 pt-2'>
                            <div className='d-flex' style={{ alignItems:'center', justifyContent:'space-between' }}>
                                <div>
                                    {noteHeading}
                                </div>
                                <div>
                                    <CloseIcon onClick={onCloseShareNote} style={{ fontSize:"1.3rem", cursor:'pointer' }}/>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent style={{ marginTop:"-2rem" }}>
                            <div style={{ backgroundColor:'#ececec', padding:'0.5rem' }} className="rounded px-3">
                                <div className='d-flex mb-2' style={{ justifyContent:'space-between', alignItems:'center' }}>
                                    <div style={{ fontSize:"0.9rem", fontWeight:"600", letterSpacing:'0.8px' }}>Shareable link</div>
                                    <div style={{ borderRadius:'50%', padding:"0.5rem" }}>
                                        <FileCopyOutlinedIcon onClick={copyUrl} className='copyurl' style={{ cursor:'pointer', fontSize:'1.3rem', color:'rgb(112, 112, 112)' }}/>
                                    </div>
                                </div>
                                <div style={{ letterSpacing:'0.09rem' }}>{url}</div>
                            </div>
                            <div className='mt-3'>
                                <div className='mb-2'>Invite someone</div>
                                <div className='d-flex'>
                                    <Form.Control type="email" value={toEmails} onChange={e => setToEmails(e.target.value)} inputmode="email" style={{ width:'100%' }} className="invite border" />
                                    <Form.Control as="select" aria-label="Default select example" style={{ width:'30%', cursor:'pointer' }} className="invite border" onChange={e => setCan(e.target.value)}>
                                        <option value="Can view">Can view</option>
                                        <option value="Can edit">Can edit</option>                                        
                                    </Form.Control>
                                </div>
                            </div>
                            <div className='mt-3 mb-2'>
                                <Button variant='contained' onClick={e => shareNoteActionUser(userInfo.email, toEmails.split(','), url, updateId, can)} style={{ backgroundColor:'rgb(26, 92, 190)', color:'white', fontWeight:'600', letterSpacing:'1px' }}>Send</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>   
            </div>
        </div>
    )
}
