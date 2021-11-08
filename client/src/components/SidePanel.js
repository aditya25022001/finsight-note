import React, { useState, useEffect } from 'react'
import { Badge, Form, Navbar } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { showNotesAction } from '../reducers/notes/showNoteSlice'
import { Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export const SidePanel = ({ history }) => {
    const dispatch = useDispatch()
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { notes } = userShowNotes
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const [showNoteTags] = useState(['react', 'gatsby', 'intern'])
    const deleteTagHandler = () => {}
    useEffect(()=>{
        if(!userInfo){
            history.push('/')
        }
        else{
            dispatch(showNotesAction())
        }
    },[dispatch, userInfo, history])
    return (
        <div style={{ width:"33%", display: "flex", float:'right', height:'100vh', flexDirection:'column', position:'fixed', right:0, overflowY:'scroll' }} className='border-left'>
            <Navbar fixed="top" className='d-flex w-100 searchBarSidePanel' style={{ alignItems:'center', height:'max-content', backgroundColor:'green' }} >
                <div style={{ flex:0.9 }} className='ml-2'>
                    <Form.Control style={{ boxShadow:'none' }} placeholder="Search all notes" class='w-100' name="note" list="notes"/>
                    <datalist id="notes">
                        {notes && notes.map((each,index) => (
                            <option value={each.noteHeading} key={index}>{each.noteHeading}</option>
                        ))}
                    </datalist>
                </div>
                <div style={{ flex:0.1, textAlign:'center', cursor:'pointer' }}>
                    <EditIcon/>
                </div>
            </Navbar>
            <div className='px-2'>
                <div className='h3 border-bottom py-2 px-1'>Heading</div>
                <div className='d-flex py-2 border-bottom'>
                {showNoteTags.map((tag,index) => (
                    <div>
                        <Badge className='p-1 mx-1' key={index} style={{ fontSize:'0.85rem', fontWeight:'500', textTransform:'uppercase', alignItems:'center', display:'flex' }}>
                            {tag}
                            <span className='ml-1'>
                                <CloseIcon style={{ color:'#007bff', fontSize:'0.8rem', cursor:'pointer', backgroundColor:'#c5ebff', borderRadius:'50%' }} onClick={e => deleteTagHandler(tag)} />
                            </span>
                        </Badge>
                    </div>
                ))}
                </div>
                <div className='border-bottom'>
                    <Tooltip placement='top-start' title='comma separated values'>
                        <Form.Control  style={{ width:'100%', border:'none', outline:'none', boxShadow:'none', fontSize:'1.1rem' }} placeholder="Add Tags" />
                    </Tooltip>
                </div>
                <ReactQuill></ReactQuill>
            </div>
        </div>
    )
}
