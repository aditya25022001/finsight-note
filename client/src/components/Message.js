import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export const Message = ({ message, variant }) => {

    const [open, setOpen] = useState(true)

    const closeHandler = () => {
        setOpen(false)
    }

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={closeHandler}>
            <Alert severity={variant} variant='filled'>{message}</Alert>
        </Snackbar>
    )
}