import React from 'react';
import { NavLink } from 'react-router-dom';
import { Toolbar, IconButton, Link, InputBase, IconButtonProps, Chip, ChipProps, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { IMaskInput } from 'react-imask';
import { useTheme } from '@mui/material/styles';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        flexGrow: '1',
        justifyContent: 'flex-start',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

export const Logo = ({ flexible = true }) => {
    const Container = (props: React.PropsWithChildren) => {
        return (
            flexible ?
                <LogoLink href="/" role={'directory'}>{props.children}</LogoLink> :
                <Link href="/" role={'directory'} sx={{ display: 'flex', alignItems: 'center' }}>{props.children}</Link>
        )
    }
    return (
        <Container>
            <CardGiftcardIcon color="primary" fontSize="large" />
            <Typography variant='h2' component={'span'} sx={{ fontSize: { xs: flexible ? '14px' : '26px', sm: '26px' }, fontWeight: 600 }}>Gifty</Typography>
        </Container>
    )
}

export const ResponsiveAccordion = (props: React.PropsWithChildren & { title: string }) => {
    const theme = useTheme();
    const [accordionExpanded, setAccordionExpanded] = React.useState(true);
    const [accordionIconVisibility, setAccordionIconVisibility] = React.useState(false);

    const onResize = () => {
        setAccordionExpanded(window.innerWidth >= theme.breakpoints.values.sm ? true : false);
        setAccordionIconVisibility(window.innerWidth >= theme.breakpoints.values.sm ? false : true)
    };

    const handleAccordionExpand = () => {
        if (window.innerWidth >= theme.breakpoints.values.sm) return;
        setAccordionExpanded(!accordionExpanded);
    };

    React.useEffect(() => {
        onResize()
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener('resize', onResize)
        };
    }, []);

    return (
        <Accordion expanded={accordionExpanded} onChange={handleAccordionExpand} sx={{ boxShadow: 0, '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ opacity: accordionIconVisibility ? 1 : 0 }} />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 }, '& .MuiAccordionSummary-content.Mui-expanded': { m: 0, pb: 1, cursor: 'text' }, '&.Mui-expanded': { minHeight: 0 } }}>
                <Typography variant="body1" component={'h6'} textTransform={'uppercase'} sx={{ color: 'text.disabled', fontWeight: 500 }}>{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
                {props.children}
            </AccordionDetails>
        </Accordion>
    )
};

export const SearchContainer = styled('div')(({ theme }) => ({
    flex: 1,
    order: 4,
    flexBasis: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    [theme.breakpoints.up('md')]: {
        margin: theme.spacing(0, 2),
        order: 2,
    },
}));

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '5px',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.65),
    },
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 500,
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

