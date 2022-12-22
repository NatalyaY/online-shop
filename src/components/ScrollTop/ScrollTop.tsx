import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fade from '@mui/material/Fade';
import { Box, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const animate = ({ timing, draw, duration }: { timing: (t: number) => number, draw: (n: number) => void, duration: number }) => {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        const progress = timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        };
    });
};

const ScrollTop = () => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 300,
    });

    return (
        <Fade in={trigger}>
            <Box
                onClick={() => {
                    animate({
                        duration: 300,
                        draw(progress) {
                            window.scrollBy(0, window.scrollY * -progress);
                        },
                        timing(timeFraction) {
                            return Math.pow(timeFraction, 2);
                        }
                    })
                }}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1 }}
            >
                <Fab size="medium" color="warning" aria-label="вернуться наверх">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Fade>
    );
};

export default ScrollTop;