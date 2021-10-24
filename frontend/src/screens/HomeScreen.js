import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { AllNotes } from '../components/AllNotes'

export const HomeScreen = () => {
    return (
        <div className='d-flex w-100'>
            <Sidebar/>
            <AllNotes/>
        </div>
    )
}
