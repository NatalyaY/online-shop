import React from 'react';
import { ToolbarWithWrap, Logo } from '../common/styledComponents';
import useCategories from '../common/hooks/useCategories';

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

const Footer = () => {
    const { topLevelCategories } = useCategories();

    return (
        <AppBar position="relative" sx={{ boxShadow: 0 }}>
            <Container maxWidth="xl">
                <ToolbarWithWrap disableGutters>

                </ToolbarWithWrap>
            </Container>
        </AppBar>
    )

}