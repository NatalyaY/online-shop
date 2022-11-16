import * as React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { LinkProps } from '@mui/material/Link';


const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<NavLinkProps, 'to'> & { href: NavLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    return <NavLink ref={ref} to={href} {...other} />;
});

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        xxl: true;
    }
}


const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#029FAE',
            dark: '#007580',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#F0F2F3',
            dark: '#636270',
            light: '#9A9CAA',
            contrastText: '#272343',

        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#272343',
            secondary: '#636270',
            disabled: '#9A9CAA',
        },
        info: {
            main: '#01AD5A',
            contrastText: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: 'Inter',
        h1: {
            fontSize: '3.7rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
        },
        h4: {
            fontSize: '1.5rem',
        },
        h5: {
            fontSize: '1.25rem',
        },
        h6: {
            fontSize: '1rem',
        },
        subtitle1: {
            fontSize: '1.125rem',
        },
        button: {
            fontSize: '1rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '0.875rem',
        },
        body2: {
            fontSize: '0.75rem',
        },
    },
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
                color: 'inherit',
                underline: 'none',
                position: 'relative',
            } as LinkProps,
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    '&:after': {
                        content: "''",
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0,
                        display: ownerState.className?.includes('woUnderline') ? 'none' : 'block',
                    },
                    '&:hover': {
                        opacity: 0.8,
                        color: ownerState.className?.includes('woUnderline') ? null : theme.palette.primary.main,
                    },
                    '&:hover:after': {
                        opacity: 1
                    }
                }),
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
        MuiAppBar: {
            defaultProps: {
                color: 'secondary',
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1740,
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;