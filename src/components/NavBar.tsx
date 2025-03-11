import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import AvatarIcon from '../assets/avataricon.svg';
import MessageIcon from '../assets/messageicon.svg';
import NotificatonIcon from '../assets/notificationicon.svg';
import * as React from 'react';
import '@fontsource/inter/600.css';
import '@fontsource/inter/900.css';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';


export default function NavBar() {

    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        handleMenuClose();
        navigate('/login');
    };

    return(
        <>
        <Box sx={{display:'flex', width: '100%', bgcolor: 'background.white', justifyContent: 'space-between',
         }}>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="SpectraAi" sx={{fontFamily: "Inter, sans-serif", fontWeight: 900 , fontSize:"12px" , fontlineHeight:"15px" , color:'#BA3CCD'}} onClick={() => navigate('/')} />
                <Tab label="Проекты" sx={{fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize:"12px" , fontlineHeight:"15px"}} onClick={() => navigate('/')}/>
                <Tab label="Среда тестирования" sx={{fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize:"12px" , fontlineHeight:"15px"}}/>
                <Tab label="Мониторинг тестирования"sx={{fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize:"12px" , fontlineHeight:"15px"}}/>
            </Tabs>

            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton>
                <img src={NotificatonIcon} alt='notification'/>
                </IconButton>
                <IconButton>
                <img src={MessageIcon} alt='message'/>
                </IconButton>
                <IconButton onClick={handleMenuOpen}>
                <img src={AvatarIcon} alt="avatar" />
                </IconButton>
            </Box>

        </Box>

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{mt:1}}
        >
            <MenuItem onClick={handleLogout}>Выход</MenuItem>
        </Menu>

        </>
    )
}

