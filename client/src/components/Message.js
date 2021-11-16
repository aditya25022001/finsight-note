import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'

export const Message = ({ variant, message }) => {
    const [show, setShow] = useState(true)
    if(show){
        setTimeout(()=>{
            setShow(false)
        },2000)
    }
    return (
        <>
            {show && <div style={{ width:'max-content' }} className='mx-auto alertMessage'>
                <Alert variant={variant}>{message}</Alert>            
            </div>}
        </>
    )
}
