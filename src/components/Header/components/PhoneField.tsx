import React from 'react';
import { PhoneMaskedInput } from '../../../common/components/styledComponents';
import { TextField } from '@mui/material';

const PhoneField: React.FC<{ phone: string, setPhone: React.Dispatch<React.SetStateAction<string>>, phoneError: boolean, setPhoneError: React.Dispatch<React.SetStateAction<boolean>> }> = ({ phone, setPhone, phoneError, setPhoneError }) => {
    const [phoneComplete, setPhoneComplete] = React.useState(false);

    return (
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
            sx={{flex: '1 0 30%'}}
        />
    )
}

export default PhoneField;