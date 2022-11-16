import React from 'react';

import {
    Typography,
    Box,
    Link,
    MenuItem,
    MenuList,
    Button,
    Avatar,
} from '@mui/material';

import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import LogoutIcon from '@mui/icons-material/Logout';
import { type user, type LogOut } from '../../containers/Header_container';

interface Props {
    handleClose: () => void,
    setAuthOpened: (val: boolean) => void,
    setAuthType: (val: 'login' | 'signUp') => void,
    user: user,
    LogOut: LogOut
}

const UserMenu: React.FC<Props> = ({ handleClose, setAuthOpened, setAuthType, user, LogOut }) => {
    if (user.state === 'unauthorized') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 180, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '12px' }}>Войдите или зарегистрируйтесь, чтобы отслеживать статус заказов и пользоваться персональными скидками</Typography>
                <Button variant="contained" sx={{ mt: 2, fontSize: '10px', width: '100%' }} onClick={() => { handleClose(); setAuthOpened(true); setAuthType('login') }}>Войти</Button>
                <Typography sx={{ fontSize: '12px' }}>или</Typography>
                <Button variant="contained" sx={{ fontSize: '10px', width: '100%' }} onClick={() => { handleClose(); setAuthOpened(true); setAuthType('signUp') }}>Зарегистрироваться</Button>
            </Box>
        )
    } else {
        return (
            <MenuList>
                <MenuItem sx={{ p: 0, pb: 2, '&:hover': { backgroundColor: 'transparent' } }} divider={true}>
                    <Link href="my" onClick={handleClose} sx={{ display: 'flex', gap: 2, alignItems: 'center' }} className='woUnderline'>
                        <Avatar><PermIdentityRoundedIcon /></Avatar>
                        <Box>
                            <Typography variant="body1" component={'p'} sx={{ fontWeight: 600 }}>{user.name || 'Имя не указано'}</Typography>
                            <Typography variant="body1" component={'p'}>{user.phone}</Typography>
                            <Typography variant="body1" component={'p'} sx={{ color: 'primary.main', fontWeight: 600 }}>Личные данные</Typography>
                        </Box>
                    </Link>
                </MenuItem>
                <MenuItem sx={{ p: 0, pt: 2, '&:hover': { backgroundColor: 'transparent' } }}>
                    <Link href="my/orders" onClick={handleClose} sx={{ display: 'flex', gap: 1, alignItems: 'center' }} className='woUnderline'>
                        <TakeoutDiningIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="body1" component={'p'}>Мои заказы</Typography>
                    </Link>
                </MenuItem>
                <MenuItem sx={{ p: 0, pt: 2, '&:hover': { backgroundColor: 'transparent' } }}>
                    <Button variant='outlined' color='error' onClick={() => { LogOut(); handleClose(); setAuthOpened(false) }} sx={{ display: 'flex', gap: 1, alignItems: 'center', textTransform: 'none', }}>
                        <LogoutIcon fontSize='small' />
                        <Typography variant="body1" component={'p'}>Выйти</Typography>
                    </Button>
                </MenuItem>
            </MenuList>
        )
    }
};

export default UserMenu;