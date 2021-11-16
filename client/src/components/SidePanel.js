import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Badge, Form, Navbar, Dropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { showNotesAction } from '../reducers/notes/showNoteSlice'
import { Tooltip } from '@material-ui/core';
import { updateNoteAction } from '../reducers/notes/updateNoteSlice';
import { debounce } from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export const SidePanel = ({ history }) => {
    const dispatch = useDispatch()
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { notes } = userShowNotes
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const [noteHeading, setNoteHeading] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [noteTags, setNoteTags] = useState("")
    const [showNoteTags, setShowNoteTags] = useState([])
    const [update, setUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const deleteTagHandler = () => {}
    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        else{
            dispatch(showNotesAction())
        }
    },[dispatch, userInfo, history])
    const tagsHandler = (e) => {
        setNoteTags(e.target.value)
        if(e.target.value.slice(-1)===','){
            setNoteTags('')
            setShowNoteTags([...showNoteTags,e.target.value.slice(0,-1)])
            setNoteTags("")
        }
    }
    const setUpdateHandler = (id, heading, content, tags) => {
        setUpdate(true)
        setUpdateId(id)
        setNoteHeading(heading)
        setNoteContent(content)
        setShowNoteTags([...tags])
    }
    const delayedQuery = useCallback(debounce((updateId, noteHeading, noteContent, showNoteTags) => dispatch(updateNoteAction({id:updateId, heading:noteHeading, content:noteContent, tags:showNoteTags})),500),[])

    useEffect(()=>{
        if(update){
            delayedQuery(updateId, noteHeading, noteContent, showNoteTags)
        }
    },[updateId, noteHeading, dispatch, update, noteContent, showNoteTags, delayedQuery])
    const modules = useMemo(() => ({
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6] },'bold', 'italic', 'underline', { list: 'ordered' }, { list: 'bullet' },'code-block','link',{'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}],
          ],
        }
      }), [])
    return (
        <div style={{ width:"33%", display: "flex", float:'right', height:'100vh', flexDirection:'column', position:'fixed', right:0, overflowY:'scroll' }} className='border-left'>
            <Navbar fixed="top" className='d-flex w-100 searchBarSidePanel' style={{ alignItems:'center', height:'max-content', backgroundColor:'green' }} >
                <div style={{ flex:1 }} className='ml-2'>
                    <Dropdown>
                        <Dropdown.Toggle style={{ boxShadow:'none !important' }} variant="secondary" id="dropdown-basic">
                            {noteHeading || "Select Note"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {notes && notes.map((each,index) => (
                                <Dropdown.Item onClick={e => setUpdateHandler(each._id, each.noteHeading, each.noteContent, each.noteTags)}>
                                    <option value={each.noteHeading} key={index}>{each.noteHeading}</option>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Navbar>
            <div className='px-0'>
                <Form.Control disabled={!update} style={{ fontSize:'2rem', width:'100%', border:'none', outline:'none', boxShadow:'none', fontWeight:'500' }} className='h3 border-bottom py-2 px-3' placeHolder="Heading" value={noteHeading} onChange={e => setNoteHeading(e.target.value)} />
                <div className='border-bottom px-1'>
                    <Tooltip placement='top-start' title='comma separated values'>
                        <Form.Control disabled={!update} value={noteTags} style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} placeholder="Add Tags" onChange={e => tagsHandler(e)} />
                    </Tooltip>
                </div>
                <div style={{ height:'50px' }} className='d-flex pt-2 pb-0 px-2 border-bottom'>
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
                <ReactQuill modules={modules} readOnly={!update} value={noteContent} id="print" onChange={e => setNoteContent(e)}></ReactQuill>
            </div>
        </div>
    )
}
