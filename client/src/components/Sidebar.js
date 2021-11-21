import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Tooltip from '@material-ui/core/Tooltip'
import { logoutAction } from '../reducers/users/loginSlice';

export const Sidebar = () => {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        console.log("logged out")
        dispatch(logoutAction())
    }

    return (
        <div className='sidebar' style={{ backgroundColor:'black', width:'max-content', color:'white', height:'100vh !important', alignItems:'center', display:'flex', flexDirection:'column', padding:'0.3rem 0.5rem' }}>
                <Link to='/' style={{ color:'white', textDecoration:'none' }}>
                    <div style={{ cursor:'pointer' }} className='my-2 h4'>Nt</div>
                </Link>
                <div style={{ cursor:'pointer' }} className='my-2'>
                    <Link to="/note" style={{ color:'white' }}>
                        <CreateIcon />
                    </Link>
                </div>
                <div style={{ cursor:'pointer' }} className='my-2'><SearchIcon /></div>
                <div style={{ cursor:'pointer' }} className='my-2'><SettingsIcon /></div>
                {userInfo && 
                    <Tooltip title='Logout' placement="right">
                        <div style={{ cursor:'pointer' }} className='my-2' onClick={logoutHandler}>
                            <PowerSettingsNewIcon />
                        </div>
                    </Tooltip>
                }
                {!userInfo && 
                <Link to="/login" style={{ color:'white' }}>
                    <div style={{ cursor:'pointer' }} className='my-2'><ExitToAppIcon/></div>
                </Link>
                }
            </div>
    )
}
