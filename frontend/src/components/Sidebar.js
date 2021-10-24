import React from 'react'
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import { useSelector, useDispatch } from 'react-redux';
import { userLogoutAction } from '../actions/authActions'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(userLogoutAction())
    }
    return (
        <div style={{ backgroundColor:'black', width:'max-content', color:'white', height:'100vh', position:'fixed', alignItems:'center', display:'flex', flexDirection:'column', padding:'0.8rem' }}>
            <Link to='/' style={{ color:'white', textDecoration:'none' }}>
                <div style={{ cursor:'pointer' }} className='my-2 h4'>Nt</div>
            </Link>
            {userInfo && 
            <Link to='/addnote' style={{ color:'white' }}>
                <div style={{ cursor:'pointer' }} className='my-2'><CreateIcon /></div>
            </Link>}
            <div style={{ cursor:'pointer' }} className='my-2'><SearchIcon /></div>
            <div style={{ cursor:'pointer' }} className='my-2'><SettingsIcon /></div>
            {userInfo && <div style={{ cursor:'pointer' }} className='my-2' onClick={logoutHandler}><PowerSettingsNewIcon /></div>}
            {!userInfo && 
            <Link to="/login" style={{ color:'white' }}>
                <div style={{ cursor:'pointer' }} className='my-2'><ExitToAppIcon/></div>
            </Link>
            }
        </div>
    )
}
