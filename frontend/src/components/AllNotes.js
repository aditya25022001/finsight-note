import React from 'react'
import { SearchBar } from './SearchBar'
import { useSelector } from 'react-redux'
import { AllNotesTable } from './AllNotesTable'

export const AllNotes = () => {
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    return (
        <div style={{ overflowY:'scroll', position:'fixed', left:'3rem', padding:'0.8rem', paddingTop:'1rem', height:'100vh', width:'100%' }} className='border-right allNotes'>
            <SearchBar/>
            {userInfo
            ? <AllNotesTable/>
            : <div>Please login to view notes</div>
            }
        </div>
    )
}
