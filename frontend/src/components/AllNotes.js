import React from 'react'
import { SearchBar } from './SearchBar'

export const AllNotes = () => {
    return (
        <div style={{ position:'fixed', left:'3rem', padding:'0.8rem', paddingTop:'1rem', height:'100vh', width:'100%' }} className='border-right allNotes'>
            <SearchBar/>
        </div>
    )
}
