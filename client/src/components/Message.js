import React from 'react'
import { Alert } from 'react-bootstrap'

export const Message = ({ variant, message }) => {
    return (
        <div style={{ width:'max-content' }} className='mx-auto alertMessage'>
            <Alert variant={variant}>{message}</Alert>            
        </div>
    )
}
