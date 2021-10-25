import React from 'react'
import { ListGroup } from 'react-bootstrap'

export const Note = ({ heading, updated }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[parseInt(updated.slice(5,7))-1]
    return (
        <ListGroup.Item className='py-1 px-3 note rounded-0' style={{ display:'flex', justifyContent:'space-between', cursor:'pointer' }}>
            <div>{heading}</div>
            <div>{`${updated.slice(8)} ${month} ${updated.slice(0,4)}`}</div>
        </ListGroup.Item>
    )
}
