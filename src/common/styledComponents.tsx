import React from 'react';
import { NavLink } from 'react-router-dom';
import { Toolbar, IconButton, Link, InputBase, IconButtonProps, Chip, ChipProps, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { IMaskInput } from 'react-imask';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';


interface StyledIconButtonProps extends IconButtonProps {
    href?: string;
}
type RouterChipProps = ChipProps & { href: string }

export const RouterChip = (props: RouterChipProps) => {
    const { href, ...rest } = props;
    const routerProps = {
        component: NavLink,
        to: href,
        clickable: true,
    };
    return (
        <Chip
            {...routerProps}
            {...rest}
        />
    )
}

interface PhoneMaskedInputProps {
    onChange: (event: { target: { name: string; value: string } }, completed?: boolean) => void;
    name: string;
}

export const PhoneMaskedInput = React.forwardRef<HTMLInputElement, PhoneMaskedInputProps>(
    function test(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="{+7}(000)000-00-00"
                unmask={true}
                eager={true}
                inputRef={ref}
                onAccept={(value: any, mask) => {
                    onChange({ target: { name: props.name, value: value } }, mask.masked.isComplete);
                }}
            />
        );
    },
);

export const ToolbarWithWrap = styled(Toolbar)(({ theme }) => ({
    gap: 2,
    padding: '20px 0',
    [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
    },
}));

const LogoLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&.active': {
        color: 'inherit'
    },
    [theme.breakpoints.down('md')]: {
        flexGrow: '1',
        justifyContent: 'flex-start',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

export const Logo = () => {
    return (
        <LogoLink href="/">
            <CardGiftcardIcon color="primary" fontSize="large" />
            <Typography variant='h2' component={'span'} sx={{ fontSize: { xs: '14px', sm: '26px' }, fontWeight: 600 }}>Gifty</Typography>
        </LogoLink>
    )
}


export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '5px',
    backgroundColor: theme.palette.common.white,
    flex: 1,
    order: 4,
    marginTop: '10px',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.65),
    },
    width: '100%',
    [theme.breakpoints.up('md')]: {
        margin: theme.spacing(0, 2),
        order: 2,
    },
}));

export const SearchIconWrapper = styled('div')(() => ({
    padding: '0 16px 0 0',
    height: '100%',
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    cursor: 'pointer',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    fontSize: '1rem',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 0, 1.5, 2),
        paddingRight: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

export const StyledIconButton = styled(IconButton)<StyledIconButtonProps>(({ theme }) => ({
    size: "large",
    edge: "end",
    color: 'inherit',
    backgroundColor: theme.palette.common.white,
    borderRadius: '8px',
    padding: theme.spacing(1.5),
}));

export const IconLink = styled(Link)(() => ({
    color: "inherit",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
        opacity: 1,
    },
}));

export const Policy = () => <Typography variant='body2' sx={{ fontSize: 10 }} component={'span'}>Согласен с условиями <Link>Правил пользования торговой площадкой</Link> и <Link>правилами возврата</Link></Typography>;

