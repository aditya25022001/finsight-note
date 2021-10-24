import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { Form, Button } from 'react-bootstrap'

export const SearchBar = () => {
    const [search, setSearch] = useState("")
    return (
        <div className='d-flex align-items-center pb-2'>
            <div style={{ width:'80%' }}>
                <Form.Control value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%', boxShadow:'none' }} type="text" placeholder="Search all notes"/>
            </div>
            <div style={{ width:'15%', marginLeft:'10px' }}>
                <Button style={{ width:'100%' }} className='ml-2 py-1'>
                    <SearchIcon/>
                </Button>
            </div>
        </div>
    )
}
