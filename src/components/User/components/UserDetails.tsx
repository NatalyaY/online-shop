import React from 'react';
import { removeUserData, editUserData, changePassword, Logout } from '../../../containers/User/User_container';
import { Stack, Typography, Link, Button, TextField, InputAdornment, IconButton, Fade, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { LoadingButton } from '@mui/lab';
import { userState } from '../../../common/types';
import CloseIcon from '@mui/icons-material/Close';
import { FieldWithHints } from './../../Cart/components/Stage2/CheckoutForm';

interface IUserDetailsProps {
    user: userState,
    editUserData: editUserData,
    removeUserData: removeUserData,
    changePassword: changePassword,
    Logout: Logout
};

const UserDetails: React.FC<IUserDetailsProps> = ({ user, editUserData, removeUserData, changePassword, Logout }) => {

    const [popupOpen, setPopupOpen] = React.useState(false);
    const [popupType, setPopupType] = React.useState<'name' | 'email' | 'address' | null>(null);

    function handlePopupClose() { setPopupOpen(false) };

    const userDetailBlockStyles = {
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'start',
        flex: '1 0 0',
        minWidth: '200px',
    };

    const iconStyle = { fontSize: '68px' };

    const editIconStyles = {
        color: 'primary.main',
        fontSize: '1.2rem',
        ml: '5px',
    };

    const editLinkProps = {
        component: Stack,
        className: 'woUnderline',
        direction: 'row',
        sx: {
            cursor: 'pointer',
            overflow: 'hidden',
        }
    };

    const editLinkTextStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    return (
        <>
            <Typography variant="h1" flex={'1'}>Мои данные</Typography>
            <Button variant='outlined' onClick={() => Logout()} color='error' sx={{ display: 'flex', gap: 1, alignItems: 'center', textTransform: 'none', alignSelf: 'flex-end' }}>
                <LogoutIcon fontSize='small' />
                <Typography>Выйти</Typography>
            </Button>
            <Stack direction={'row'} flexWrap={'wrap'} width={'100%'} gap={10} justifyContent={'space-between'} alignItems={'start'}>
                <Stack maxWidth={'100%'} gap={4} flex={'2'} direction={'row'} flexWrap={'wrap'}>
                    <Stack sx={userDetailBlockStyles}>
                        <AccountBoxIcon sx={iconStyle} />
                        <Stack overflow={'hidden'}>
                            <Link {...editLinkProps} onClick={() => { setPopupOpen(true); setPopupType('name') }}>
                                <Typography sx={editLinkTextStyle} variant='h6'>{user.name || 'Имя не указано'}</Typography>
                                <EditRoundedIcon sx={editIconStyles} />
                            </Link>
                            <Typography>{user.phone || 'Телефон не указан'}</Typography>
                        </Stack>
                    </Stack>
                    <Stack sx={userDetailBlockStyles}>
                        <AlternateEmailRoundedIcon sx={iconStyle} />
                        <Link {...editLinkProps} onClick={() => { setPopupOpen(true); setPopupType('email') }}>
                            <Typography sx={editLinkTextStyle}>{user.email || 'Email не указан'}</Typography>
                            <EditRoundedIcon sx={editIconStyles} />
                        </Link>
                    </Stack>
                    <Stack sx={userDetailBlockStyles}>
                        <RoomOutlinedIcon sx={iconStyle} />
                        <Link {...editLinkProps} onClick={() => { setPopupOpen(true); setPopupType('address') }}>
                            <Typography sx={editLinkTextStyle}>{user.address || 'Адрес доставки не указан'}</Typography>
                            <EditRoundedIcon sx={editIconStyles} />
                        </Link>
                    </Stack>
                </Stack>
                <Stack gap={2} flex={'1'}>
                    <Typography variant="h3" fontWeight={600} width={'100%'}>Изменить пароль</Typography>
                    <ChangePasswordForm user={user} changePassword={changePassword} />
                </Stack>
            </Stack>
            <PopupForm
                open={popupOpen}
                type={popupType}
                handleClose={handlePopupClose}
                userStatus={user.status}
                editUserData={editUserData}
                removeUserData={removeUserData}
                error={popupType && user.lastUpdatedFields?.includes(popupType) ? user.error : null}
            />
        </>
    )
};

const ChangePasswordForm: React.FC<{ user: userState, changePassword: changePassword }> = ({ user, changePassword }) => {
    const [isValidated, setIsValidated] = React.useState(false);
    const [error, setError] = React.useState<userState['error']>(null);

    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [newPassword, setNewPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [newPasswordError, setNewPasswordError] = React.useState(false);

    const [isNewPassTheSame, setIsNewPassTheSame] = React.useState(false);

    function handleChange(type: 'new' | 'current') {
        const setPassErr = type == 'current' ? setPasswordError : setNewPasswordError;
        const setPass = type == 'current' ? setPassword : setNewPassword;
        const otherPassValue = type == 'current' ? newPassword : password;
        return function (e: React.ChangeEvent<HTMLInputElement>) {
            e.target.value && setPassErr(false);
            setPass(e.target.value);
            if (e.target.value == otherPassValue && !isNewPassTheSame) {
                setIsNewPassTheSame(true);
            } else if (isNewPassTheSame) {
                setIsNewPassTheSame(false);
            }
        };
    };

    function handleMouseDown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPasswordError || passwordError) return;

        if (!password || !newPassword) {
            !password && setPasswordError(true);
            !newPassword && setNewPasswordError(true);
            return;
        };

        if (password == newPassword) {
            setIsNewPassTheSame(true);
            return;
        };

        setIsValidated(true);
        changePassword({ currentPassword: password, newPassword });
    };

    const isRelevant = () => user.lastUpdatedFields?.includes('currentPassword');

    React.useEffect(() => {
        if (!isRelevant() || !isValidated) return;
        if (user.status == 'succeeded') {
            setPassword('');
            setNewPassword('');
            setTimeout(() => setIsValidated(false), 1500);
            setError(null);
            return;
        };
        if (user.status == 'failed') {
            setError(user.error);
        };
    }, [user.status])

    return (
        <Stack component={'form'} noValidate minWidth={'200px'} gap={2} onSubmit={handleSubmit}>
            <TextField
                autoComplete='current-password'
                id="password"
                name="password"
                error={passwordError}
                placeholder="Текущий пароль"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChange('current')}
                InputProps={{
                    required: true,
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={handleMouseDown}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
                label="Текущий пароль"
            />
            <TextField
                autoComplete='new-password'
                id="newPassword"
                name="newPassword"
                error={newPasswordError || isNewPassTheSame}
                placeholder="Новый пароль"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleChange('new')}
                InputProps={{
                    required: true,
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                onMouseDown={handleMouseDown}
                                edge="end"
                            >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
                label="Новый пароль"
            />
            <LoadingButton
                loading={user.status == 'loading' && isRelevant()}
                type='submit'
                disabled={passwordError || newPasswordError}
                variant="contained"
                sx={{ mt: 2 }}>
                Изменить пароль
            </LoadingButton>
            {
                (error || isNewPassTheSame) && (user.status != 'loading' || !isRelevant()) &&
                <Fade in={true}>
                    <Alert severity="error">
                        {isNewPassTheSame ? 'Новый пароль не должен совпадать со старым' : error}
                    </Alert>
                </Fade>
            }
            {
                isValidated && user.status == 'succeeded' && isRelevant() &&
                <Fade in={true}>
                    <Alert>
                        Пароль обновлен
                    </Alert>
                </Fade>
            }
        </Stack>
    )
};

interface IPopupFormProps {
    open: boolean,
    type: 'name' | 'email' | 'address' | null,
    handleClose: () => void,
    editUserData: editUserData,
    removeUserData: removeUserData,
    userStatus: userState['status'],
    error: userState['error']
}

const PopupForm: React.FC<IPopupFormProps> = ({ open, type, handleClose, editUserData, removeUserData, userStatus, error }) => {

    const [value, setValue] = React.useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const labels = {
        name: 'имя',
        email: 'email',
        address: 'адрес'
    };

    React.useEffect(() => {
        if (userStatus == 'succeeded' && isSubmitted) {
            cleanAndClose();
        };
    }, [userStatus]);

    if (!type) return null;

    function handleSubmit() {
        if (!type) return;
        if (!value || value == '' || value == ' ') {
            removeUserData(type);
        } else {
            editUserData({ [type]: value })
        };
        setIsSubmitted(true);
    };

    function cleanAndClose() {
        setValue('');
        setIsSubmitted(false);
        handleClose();
    };

    const styles = {
        p: 4,
        overflow: 'visible',
        width: '500px',
        maxWidth: '90%'
    };


    return (
        <Dialog open={open} onClose={cleanAndClose} PaperProps={{ sx: styles }}>
            <DialogTitle sx={{ fontSize: '1.5rem', px: 0, pt: 0 }}>
                {`Изменить ${labels[type]}`}
            </DialogTitle>
            <DialogContent sx={{ px: 0, overflow: 'visible' }}>
                {
                    type == 'email' ?
                        <TextField
                            autoFocus
                            autoComplete='email'
                            margin='dense'
                            label='email'
                            type='email'
                            fullWidth
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        :
                        <FieldWithHints {...{ type, value, setValue, autofocus: true }} />
                }
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', px: 0 }}>
                <Button variant='contained' onClick={handleSubmit}>Сохранить</Button>
                <Button variant='outlined' onClick={handleClose}>Отменить</Button>
            </DialogActions>
            <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            {
                error && isSubmitted && userStatus == 'failed' &&
                <Fade in={true}>
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Fade>
            }
        </Dialog>
    )
}

export default UserDetails;