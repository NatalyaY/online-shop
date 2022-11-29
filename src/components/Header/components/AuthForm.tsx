import React from 'react';

import {
    Typography,
    IconButton,
    Button,
    TextField,
    Paper,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    FormControl,
    Alert,
} from '@mui/material';
import { PhoneMaskedInput, Policy } from '../../../common/components/styledComponents';
import { type Login, type SignUp, type user } from '../../../containers/Header/Header_container';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import LoadingButton from '@mui/lab/LoadingButton';
import Fade from '@mui/material/Fade';


interface Props {
    type: 'login' | 'signUp',
    setType: React.Dispatch<React.SetStateAction<"login" | "signUp">>,
    user: user,
    Login: Login,
    SignUp: SignUp
}



const AuthForm: React.FC<Props> = ({ type, setType, Login, SignUp, user }) => {

    const [phone, setPhone] = React.useState('');
    const [phoneComplete, setPhoneComplete] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState(false);

    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [checked, setChecked] = React.useState(true);
    const [checkboxError, setCheckboxError] = React.useState(false);

    const [isValidated, setisValidated] = React.useState(false);


    React.useEffect(() => {
        setPhone('');
        setPhoneComplete(false);
        setPhoneError(false);
        setPassword('');
        setShowPassword(false);
        setPasswordError(false);
        setChecked(true);
        setCheckboxError(false);
        setisValidated(false);
    }, [type])

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phone || !password || !checked) {
            !phone && setPhoneError(true);
            !password && setPasswordError(true);
            !checked && setCheckboxError(true);
            return;
        };
        if (phoneError || passwordError) return;
        setisValidated(true);
        type == 'login' ? Login({ phone, password }) : SignUp({ phone, password });
    }


    return (
        <Paper component={'form'} noValidate onSubmit={submit} sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: 400
        }}>
            <Typography variant='h2' sx={{ mb: 3 }}>{type == 'login' ? 'Войти' : 'Зарегистрироваться'}</Typography>
            <TextField
                autoComplete='tel'
                error={phoneError}
                id="phone"
                name="phone"
                label="Телефон"
                placeholder="Телефон"
                variant="outlined"
                InputProps={{ inputComponent: PhoneMaskedInput as any, required: true }}
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>, complete = undefined) => {
                    if (complete != undefined) {
                        complete && setPhoneError(false);
                        setPhoneComplete(complete);
                    };
                    setPhone(e.target.value);
                }}
                onFocus={() => !phone && setPhone(' ')}
                onBlur={() => {
                    (phone != '+7' && phone != '') && !phoneComplete && setPhoneError(true);
                    phone == '+7' && setPhone('')
                }}
            />
            <TextField
                autoComplete='current-password'
                id="password"
                name="password"
                error={passwordError}
                placeholder="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { e.target.value && setPasswordError(false); setPassword(e.target.value) }}
                InputProps={{
                    required: true,
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
                label="Пароль"
            />
            <LoadingButton loading={user.status == 'loading'} type='submit' disabled={phoneError || passwordError || checkboxError} variant="contained" sx={{ mt: 2 }}>{type == 'login' ? 'Войти' : 'Зарегистрироваться'}</LoadingButton>

            {user.error && isValidated && user.status != 'loading' && <Fade in={true}>
                <Alert severity="error">
                    {user.error}
                </Alert>
            </Fade>}
            {
                type == 'signUp' &&
                <FormControl error={checkboxError}>
                    <FormControlLabel control={<Checkbox required checked={checked} onChange={() => { setChecked(!checked); !checked && setCheckboxError(false) }} sx={{ color: 'inherit' }} />} label={Policy()} sx={{ mt: -2, color: 'secondary.dark', '&.Mui-error': { color: 'error.main' } }} />
                </FormControl>
            }
            {
                type == 'login' ?
                    <Button color="inherit" onClick={() => setType('signUp')} sx={{ textTransform: 'none', fontSize: 12, '&:hover': { backgroundColor: 'transparent' } }}>Еще нет аккаунта? Зарегистрироваться</Button>
                    :
                    <Button color="inherit" onClick={() => setType('login')} sx={{ textTransform: 'none', fontSize: 12, '&:hover': { backgroundColor: 'transparent' } }}>Уже есть аккаунт? Войти</Button>
            }
        </Paper>
    )
};

export default AuthForm;