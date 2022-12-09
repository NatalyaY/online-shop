import React from 'react';
import {
    OutlinedInput,
    Stack,
    Slider,
    InputAdornment
} from '@mui/material';
import { filter, price, setFilter, clearFilter } from '../../../../../containers/Catalog/Catalog_container';

interface Props {
    setFilter: setFilter,
    clearFilter: clearFilter,
    minPrice: NonNullable<filter['minPrice']>,
    maxPrice: NonNullable<filter['maxPrice']>,
    price: price,
}

const Filter_prices: React.FC<Props> = ({ setFilter, clearFilter, minPrice, maxPrice, price }) => {
    const [min, max] = price?.split(';') || [minPrice, maxPrice];
    const [value, setValue] = React.useState<number[]>([+min, +max]);
    const [inputsValue, setInputsValue] = React.useState<number[]>([+min, +max]);

    React.useEffect(() => {
        let [min, max] = price?.split(';') || [minPrice, maxPrice];

        const validatedValues = getValidatedValues([min, max]);
        applyValues(validatedValues);
        setOrClearFilter(validatedValues);

    }, [minPrice, maxPrice, price])

    const handleChange = (e: Event, newValue: number | number[], activeThumb: number,) => {

        if (!Array.isArray(newValue)) return;

        const values = activeThumb == 0 ? [newValue[0], value[1]] : [value[0], newValue[1]];
        const validatedValue = getValidatedValues(values);

        applyValues(validatedValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputNumber: number) => {
        let inputValue = +e.target.value;
        if (isNaN(inputValue)) inputValue = inputNumber == 0 ? minPrice : maxPrice;
        const newValue = inputNumber == 0 ? [inputValue, inputsValue[1]] : [inputsValue[0], inputValue];
        setInputsValue(newValue);
    };

    const handleInputBlur = (e: React.FocusEvent<any> | React.KeyboardEvent<any>, inputNumber: number) => {
        let inputValue = (e.target as HTMLInputElement).value;

        const values = inputNumber == 0 ? [inputValue, inputsValue[1]] : [inputsValue[0], inputValue];
        const validatedValue = getValidatedValues(values);

        applyValues(validatedValue);
        setOrClearFilter(validatedValue);
    };

    const getValidatedValues = (numbers: (number | string)[]) => {
        let validatedValues: [number, number];
        const initialPrices = [minPrice, maxPrice];

        validatedValues = [isNaN(+numbers[0]) ? initialPrices[0] : +numbers[0], isNaN(+numbers[1]) ? initialPrices[1] : +numbers[1]];
        if (validatedValues.join(';') == initialPrices.join(';')) return validatedValues;

        validatedValues[0] = Math.max(Math.min(validatedValues[0], value[1], initialPrices[1]), minPrice);
        validatedValues[1] = Math.min(Math.max(validatedValues[1], value[0], initialPrices[0]), maxPrice);
        return validatedValues;
    };

    const applyValues = (values: number[]) => {

        if (values.join(';') !== inputsValue.join(';')) {
            setInputsValue(values);
        };

        if (values.join(';') !== value.join(';')) {
            setValue(values);
        };
    };

    const setOrClearFilter = (val: number[] = value) => {
        if (price == val.join(';')) return;

        if (val[0] == minPrice && val[1] == maxPrice) {
            clearFilter('price');
        } else {
            setFilter({ price: val.join(';') });
        };
    };

    return (
        <>
            <Slider
                value={value}
                onChange={handleChange}
                onChangeCommitted={() => setOrClearFilter()}
                min={minPrice}
                max={maxPrice}
                valueLabelDisplay="auto"
                disableSwap
                sx={{ width: 'calc(100% - 20px)', mx: 'auto', display: 'block' }}
            />
            <Stack gap={2} justifyContent={'space-between'} direction={'row'}>
                <PriceInput value={inputsValue[0]} handleInputChange={handleInputChange} handleInputBlur={handleInputBlur} num={0} />
                <PriceInput value={inputsValue[1]} handleInputChange={handleInputChange} handleInputBlur={handleInputBlur} num={1} />
            </Stack>
        </>
    )
};

interface PriceInputProps {
    value: number,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputNumber: number) => void,
    handleInputBlur: (e: React.FocusEvent<any> | React.KeyboardEvent<any>, inputNumber: number) => void,
    num: number,
};

const PriceInput: React.FC<PriceInputProps> = ({ value, handleInputChange, handleInputBlur, num }) => {
    return (
        <OutlinedInput
            value={value}
            size="small"
            onChange={(e) => handleInputChange(e, num)}
            onBlur={(e) => handleInputBlur(e, num)}
            onKeyUp={(e) => (e.key === 'Enter') && handleInputBlur(e, num)}
            startAdornment={<InputAdornment position="start">{num == 0 ? 'от' : 'до'}</InputAdornment>}
            inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
            }}
        />
    )
}

export default Filter_prices;