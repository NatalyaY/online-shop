import React from 'react';
import { BannerItem, button } from '../../../../common/types';
import { useNavigate } from "react-router-dom";

import {
    Button,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';

import { buttonStyles } from '../styles';


const BannerButton: React.FC<{ button: button, item: BannerItem, endIcon?: boolean }> = ({ button, item, endIcon = true }) => {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(button.link || item.link)}
            sx={buttonStyles(button)}
            variant="contained"
            endIcon={endIcon ? <EastIcon /> : null}
        >
            {button.text}
        </Button>
    )
};

export default BannerButton;