import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Message } from '../components/Message'
import { showNotesAction } from '../actions/noteActions'
import { Table, Badge } from 'react-bootstrap'

export const AllNotesTable = () => {
    const dispatch = useDispatch()
    const userShowNotes = useSelector(state => state.userShowNotes)
    const { loading, error, notes } = userShowNotes
    useEffect(()=>{
        dispatch(showNotesAction())
    },[dispatch])
    return (
        <>
            {loading 
            ? <Loader />
            : error 
            ? <Message message={error} variant="danger" />
            : notes && notes.length>0
            ?
            <Table style={{width:'95.5%' }} bordered hover>
                <thead>
                    {window.innerWidth > 500 
                    ?<tr>
                        <th>Heading</th>
                        <th>Content</th>
                        <th>Tags</th>
                        <th>Updated</th>
                    </tr>
                    :<tr>
                        <th>Heading</th>
                        <th>Updated</th>
                    </tr>
                    }
                </thead>
                <tbody>
                    {notes.map(note => (
                        window.innerWidth>500
                        ?<tr>
                            <td>{note.noteHeading}</td>
                            <td>{note.noteContent.slice(0,100)}...</td>
                            <td>{note.noteTags.map(tag => (
                                <Badge bg='secondary' className='mx-1' style={{ color:'white', fontWeight:'400', fontSize:'0.8rem' }}>{tag}</Badge>
                            ))}
                            </td>
                            <td>{note.updatedAt.slice(0,10)}</td>
                        </tr>
                        :<tr>
                            <td>{note.noteHeading}</td>
                            <td>{note.updatedAt.slice(0,10)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            : <div>No notes until now</div>
            }
            
        </>
    )
}
