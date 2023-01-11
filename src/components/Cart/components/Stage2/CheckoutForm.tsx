import React from 'react';
import { Stack, List, TextField, MenuItem, Typography } from '@mui/material';
import PhoneField from '../../../Header/components/PhoneField';
import { UserData } from '../../../../containers/Cart/Cart_container';
import { setValidatedContacts } from '../../Cart';
import { userState } from '../../../../common/types';
import Fade from '@mui/material/Fade';
import { Alert } from '@mui/lab';

interface ICheckoutFormProps {
    userData: UserData,
    setIsValid: React.Dispatch<React.SetStateAction<boolean>>,
    setValidatedContacts: setValidatedContacts,
    error: userState['error'],
}

const CheckoutForm: React.FC<ICheckoutFormProps> = ({ userData, setIsValid, setValidatedContacts, error }) => {
    const [phone, setPhone] = React.useState(userData.phone || '');
    const [phoneError, setPhoneError] = React.useState(false);

    const [email, setEmail] = React.useState(userData.email || '');
    const [name, setName] = React.useState(userData.name || '');

    const [address, setAddress] = React.useState(userData.address || '');

    React.useEffect(() => {
        if (phone != '' && phone != '+7' && address != '' && !phoneError) {
            setIsValid(true);
            setValidatedContacts({ phone, address, ...(email !== '' ? { email } : {}), ...(name !== '' ? { name } : {}) })
        } else {
            setIsValid(false);
        }
    }, [phone, phoneError, address]);

    function handleEmailChange() {
        return function (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
            setEmail(e.target.value)
        };
    };

    return (
        <Stack component={'form'} noValidate gap={2} direction={'row'} flexWrap={'wrap'}>
            <Typography variant='h2' sx={{ flexBasis: '100%', mb: 2 }}>Контактные данные</Typography>
            <PhoneField phone={phone} setPhone={setPhone} phoneError={phoneError} setPhoneError={setPhoneError} />
            <FieldWithHints type={'name'} value={name} setValue={setName} />
            <TextField
                autoComplete='email'
                id="email"
                name="email"
                onChange={handleEmailChange()}
                placeholder="email"
                value={email}
                label="email"
                sx={{ flex: '1 0 30%', minWidth: '200px' }} />
            <FieldWithHints type={'address'} value={address} setValue={setAddress} />
            {error &&
                <Fade in={true}>
                    <Alert severity="error" sx={{ flexBasis: '100%' }}>
                        {error}
                    </Alert>
                </Fade>
            }
        </Stack>
    );
};

interface IFieldWithHintsProps {
    type: 'name' | 'address',
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    autofocus?: boolean
}

export const FieldWithHints: React.FC<IFieldWithHintsProps> = ({ type, value, setValue, autofocus }) => {
    const [hintClicked, setHintClicked] = React.useState(false);

    const [hints, setHints] = React.useState<{ value: string, data: { [k: string]: string } }[] | null>(null);

    const fetchHints = (value: string) => {
        fetch(`/api/${type}/${value}`)
            .then(resp => resp.json())
            .then(data => {
                const suggestions: any[] = data.suggestions;
                setHints(suggestions);
            });
    };

    function handleChange() {
        return function (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
            setHintClicked(false);
            const normalizedValue = type == 'name' ? e.target.value.replace(/\d/g, "") : e.target.value;
            const encodedValue = encodeURIComponent(normalizedValue);
            setValue(normalizedValue);
            normalizedValue !== "" && fetchHints(encodedValue);
        };
    };

    function handleBlur() {
        return function (e: React.FocusEvent<HTMLDivElement, Element>) {
            if (e.relatedTarget?.closest('ul') !== ref.current && e.relatedTarget !== inputRef.current) {
                setHints(null);
            };
        };
    };

    function handleHintClick(hint: { value: string, data: { [k: string]: string } }) {
        return function () {
            setValue(hint.value);
            setHintClicked(true);
            if (hint.data.house || type == 'name') {
                setHints(null);
            } else {
                const value = encodeURIComponent(hint.value + ' ');
                fetchHints(value);
            };
        };
    };

    React.useEffect(() => {
        if (type == 'address' && inputRef.current && hintClicked) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
    }, [value, hintClicked])

    const ref = React.useRef<HTMLUListElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);


    const label = type == 'name' ? 'Имя' : 'Адрес';
    const autoComplete = type == 'name' ? 'given-name' : 'street-address';

    return (
        <Stack sx={{ position: 'relative', flex: type == 'address' ? '1 0 100%' : '1 0 30%', minWidth: '200px' }} onBlur={handleBlur()}>
            <TextField
                autoComplete={autoComplete}
                id={type}
                name={type}
                onChange={handleChange()}
                placeholder={label}
                value={value}
                label={label}
                inputRef={inputRef}
                autoFocus={autofocus}
            />
            {
                hints &&
                <List
                    ref={ref}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        left: 0,
                        top: '100%',
                        gap: 2,
                        background: 'white',
                        zIndex: 10,
                        boxShadow: 1,
                        borderRadius: '0 0 10px 10px',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#007580 transparent',
                        p: 0,
                        '&::-webkit-scrollbar': {
                            width: '4px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent'
                        },

                        '&::-webkit-scrollbar-thumb': {
                            background: '#007580'
                        },

                    }}>
                    {
                        hints.map(h =>
                            h.value !== value &&
                            <MenuItem key={h.value} onClick={handleHintClick(h)} sx={{ whiteSpace: 'normal' }}>
                                {h.value}
                            </MenuItem>
                        )
                    }
                </List>
            }
        </Stack>
    );
};

export default CheckoutForm;