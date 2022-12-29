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
    error: userState['error']
}

const CheckoutForm: React.FC<ICheckoutFormProps> = ({ userData, setIsValid, setValidatedContacts, error }) => {
    const [phone, setPhone] = React.useState(userData.phone || '');
    const [phoneError, setPhoneError] = React.useState(false);

    const [email, setEmail] = React.useState(userData.email || '');
    const [name, setName] = React.useState(userData.name || '');

    const [address, setAddress] = React.useState(userData.address || '');
    const [addressError, setAddressError] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (phone != '' && phone != '+7' && address != '' && !phoneError && !addressError) {
            setIsValid(true);
            setValidatedContacts({ phone, address, ...(email !== '' ? { email } : {}), ...(name !== '' ? { name } : {}) })
        } else {
            setIsValid(false);
        }
    }, [phone, phoneError, address, addressError]);

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
            <FieldWithHints type={'address'} value={address} setValue={setAddress} error={addressError} setError={setAddressError} />
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
    error?: boolean | null,
    setError?: React.Dispatch<React.SetStateAction<boolean>>
}

const FieldWithHints: React.FC<IFieldWithHintsProps> = ({ type, value, setValue, error, setError }) => {
    const [valueHasChanged, setValueHasChanged] = React.useState(false);

    const [hints, setHints] = React.useState<{ value: string, data: { [k: string]: string } }[] | null>(null);

    function handleChange() {
        return function (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
            const normalizedValue = type == 'name' ? e.target.value.replace(/\d/g, "") : e.target.value;
            const encodedValue = encodeURIComponent(normalizedValue);
            setValue(normalizedValue);
            if (type == 'address' && setError && !error) {
                setError(true);
            };
            normalizedValue !== "" && fetch(`/api/${type}/${encodedValue}`)
                .then(resp => resp.json())
                .then(data => {
                    const suggestions: any[] = data.suggestions;
                    setHints(suggestions);
                });
        };
    };

    function handleBlur() {
        return function (e: React.FocusEvent<HTMLDivElement, Element>) {
            if (e.relatedTarget?.closest('ul') !== ref.current) {
                setHints(null);
                if (type == 'address') {
                    setValueHasChanged(true);
                };
            };
        };
    };

    function handleHintClick(hint: { value: string, data: { [k: string]: string } }) {
        return function () {
            setValue(hint.value);
            if (hint.data.flat || type == 'name') {
                setHints(null);
                setError && setError(false);
            } else {
                setError && setError(true);
            };
        };
    };

    const ref = React.useRef<HTMLUListElement>(null);

    const label = type == 'name' ? 'Имя' : 'Адрес';
    const autoComplete = type == 'name' ? 'given-name' : 'street-address';

    return (
        <Stack sx={{ position: 'relative', flex: type == 'address' ? '1 0 100%' : '1 0 30%' }} onBlur={handleBlur()}>
            <TextField
                autoComplete={autoComplete}
                error={valueHasChanged ? error || false : false}
                id={type}
                name={type}
                onChange={handleChange()}
                placeholder={label}
                value={value}
                label={label} />
            {
                hints &&
                <List ref={ref} sx={{ position: 'absolute', width: '100%', left: 0, top: '100%', gap: 2, background: 'white', zIndex: 10 }}>
                    {
                        hints.map(h =>
                            <MenuItem key={h.value} onClick={handleHintClick(h)}>{h.value}</MenuItem>
                        )
                    }
                </List>
            }
        </Stack>
    );
};

export default CheckoutForm;