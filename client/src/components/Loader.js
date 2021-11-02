import React from 'react'
import { Spinner } from 'react-bootstrap'

export const Loader = () => {
    return (
        <div className='mx-auto mt-5 pt-5' style={{ width:'max-content' }}>
            <Spinner animation="border"/>
        </div>
    )
}
