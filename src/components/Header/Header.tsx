import React from 'react';

import {
    Typography,
    AppBar,
    Box,
    IconButton,
    Container,
    Badge,
    Popover,
    Modal,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';

import { ToolbarWithWrap, Logo, StyledIconButton } from '../../common/components/styledComponents';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import SearchBox from './components/SearchBox';
import AuthForm from './components/AuthForm';
import UserMenu from './components/UserMenu';
import NavigationMenu from './components/NavigationMenu';
import { type user, type favorits, type cart, type Login, type SignUp, type brands, type GetAutocompleteProducts, type LogOut } from '../../containers/Header/Header_container';

interface Props {
    user: user,
    favorits: favorits,
    cart: cart,
    Login: Login,
    SignUp: SignUp,
    brands: brands,
    GetAutocompleteProducts: GetAutocompleteProducts,
    LogOut: LogOut
}


const Header: React.FC<Props> = ({ user, favorits, cart, Login, SignUp, brands, GetAutocompleteProducts, LogOut }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [authOpened, setAuthOpened] = React.useState<boolean>(false);
    const [authType, setAuthType] = React.useState<'login' | 'signUp'>('login');
    const [headerZIndex, setheaderZIndex] = React.useState(5);

    const navigationMenuOpen = Boolean(anchorEl);
    const userMenuOpen = Boolean(userMenuAnchorEl);
    const authMenuOpen = authOpened && user.state == 'unauthorized';

    const height = anchorEl ? window.innerHeight - anchorEl.clientHeight : 'auto';
    const right = userMenuAnchorEl ? userMenuAnchorEl.clientWidth / 2 : 0;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        anchorEl ? setAnchorEl(null) : setAnchorEl(event.currentTarget.closest('header') as HTMLElement);
        setheaderZIndex(1600);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setTimeout(() => setheaderZIndex(5), theme.transitions.duration.leavingScreen);
    };
    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null)
    };

    return (
        <AppBar position="relative" sx={{ boxShadow: 0, zIndex: headerZIndex }} onClick={handleClose}>
            <Container maxWidth="xl">
                <ToolbarWithWrap disableGutters>
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="open menu"
                        sx={{ borderRadius: '8px', mr: 2, '&:hover': { backgroundColor: 'primary.dark' }, color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'primary.main', padding: 1 }}
                        onClick={handleClick}
                    >
                        {anchorEl ? <CloseRoundedIcon /> : <MenuIcon />}
                        <Typography variant='h5' component={'span'} sx={{ fontWeight: 600, display: { sm: 'inline', xs: 'none' } }}>Каталог</Typography>
                    </IconButton>
                    <Popover
                        anchorEl={anchorEl}
                        TransitionComponent={Slide}
                        open={navigationMenuOpen}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                        }}
                        marginThreshold={0}
                        elevation={0}
                        PaperProps={{ sx: { width: '100%', maxWidth: 'unset', height: height, maxHeight: 'unset' } }}
                    >
                        <Container maxWidth="xl" sx={{ py: 5, display: 'flex', flexDirection: 'row', height: '100%', zIndex: 1199, width: '100%' }}>
                            <NavigationMenu handleClose={handleClose} brands={brands} />
                        </Container>
                    </Popover>
                    <Logo />
                    <SearchBox GetAutocompleteProducts={GetAutocompleteProducts} />
                    <Box sx={{ display: 'flex', gap: 1, order: 3 }}>
                        <StyledIconButton href="favorits">
                            <Badge badgeContent={favorits.items?.length} color="primary">
                                <FavoriteBorderRoundedIcon />
                            </Badge>
                        </StyledIconButton>
                        <StyledIconButton href="cart">
                            <Badge badgeContent={cart.items?.length} color="primary">
                                <ShoppingCartOutlinedIcon />
                            </Badge>
                        </StyledIconButton>
                        <StyledIconButton href="my"
                            onClick={(e) => { (user.state == 'unauthorized') && e.preventDefault(); setAuthOpened(true) }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).focus();
                                !(e.target as HTMLElement).closest('.MuiPopover-root') && setUserMenuAnchorEl(e.currentTarget as HTMLElement);
                            }}
                            onMouseLeave={handleUserMenuClose}
                        >
                            <PermIdentityRoundedIcon sx={{ color: user.state == 'unauthorized' ? 'inherit' : 'primary.main' }} />
                            <Popover
                                anchorEl={userMenuAnchorEl}
                                open={userMenuOpen}
                                onClose={handleUserMenuClose}
                                sx={{ zIndex: '5', pointerEvents: 'none' }}
                                PaperProps={{
                                    sx: {
                                        overflow: 'visible',
                                        pointerEvents: 'all',
                                        mt: '10px',
                                        p: 2,
                                        '&:before': {
                                            content: "''",
                                            borderColor: "background.paper",
                                            borderWidth: 10,
                                            borderStyle: 'solid',
                                            position: 'absolute',
                                            borderLeftColor: 'transparent',
                                            borderRightColor: 'transparent',
                                            borderTopColor: 'transparent',
                                            marginLeft: '-10px',
                                            right: right - 10,
                                            top: '-20px',
                                            zIndex: 1800,
                                        }
                                    },
                                    onClick: (e) => e.stopPropagation()
                                }}

                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <UserMenu handleClose={handleUserMenuClose} setAuthOpened={setAuthOpened} setAuthType={setAuthType} LogOut={LogOut} user={user} />
                            </Popover>
                        </StyledIconButton>
                        <Modal
                            open={authMenuOpen}
                            onClose={() => setAuthOpened(false)}
                            sx={{ zIndex: '1700' }}
                        >
                            <><AuthForm type={authType} setType={setAuthType} Login={Login} SignUp={SignUp} user={user} /></>
                        </Modal>
                    </Box>
                </ToolbarWithWrap>
            </Container>
        </AppBar >
    );
};

export default Header;
