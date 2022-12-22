import React from 'react';
import { Box, Stack, Typography, List, ListItem, ListItemIcon, Tab, Avatar, Link, Skeleton } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { ProductInState } from '../../../../server/helpers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ProductCharacters } from './ProductCharacters';

const styles = {
    gap: { xs: 2, md: 4 },
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr auto', md: '2fr 1fr 1fr' }
}

const ProductContent: React.FC<{ product: ProductInState, brandLink?: string }> = ({ product, brandLink }) => {
    const [value, setValue] = React.useState('1');

    const theme = useTheme();
    const upperMD = useMediaQuery(theme.breakpoints.up('md'));

    const getDescription = (description: string) => {
        return description.split('\n•').map((string, i) => {
            const trimmed = string.trim();
            /* Checking if the string is a list or not. If it is not a list, it returns a paragraph. */
            if (trimmed.split('\n   •').length == 1 && trimmed.split('\n-').length == 1) {
                return (
                    <Typography key={trimmed} sx={{ ...(i == description.split('\n•').length - 1 ? { zIndex: 10, backgroundColor: 'white' } : {}) }}>
                        {trimmed.replace('•', '')}
                    </Typography>
                )
            } else {
                const list = trimmed.split('\n   •').length > 1 ? trimmed.split('\n   •') : trimmed.split('\n-');
                return (
                    <React.Fragment key={list[0]}>
                        <Typography sx={{ fontWeight: 600 }}>{list[0].replace('•', '').trim()}</Typography>
                        <List dense>
                            {
                                list.slice(1).map((str, i) =>
                                    <ListItem key={str} sx={{ ...(i == list.slice(1).length - 1 ? { zIndex: 10, backgroundColor: 'white' } : {}) }}>
                                        <ListItemIcon><CheckCircleOutlineRoundedIcon color='primary' sx={{ mx: 'auto' }} /></ListItemIcon>
                                        {str.replace('•', '').trim()}
                                    </ListItem>
                                )
                            }
                        </List>
                    </React.Fragment>
                )
            }
        })
    };

    const productDescription = product.description ?
        getDescription(product.description)
        :
        <Typography sx={{ zIndex: 10, backgroundColor: 'white' }}>
            {`${product.name} - это отличная покупка для себя или в подарокдрузьям и близким.`}
        </Typography>

    const leftAreaDesktop = <>
        <Stack gap={1}>
            <Typography variant='h6' mb={1}>Описание:</Typography>
            {productDescription}
        </Stack>
        <Stack>
            <Typography variant='h6' mb={2}>Характеристики:</Typography>
            <ProductCharacters product={product} />
        </Stack>
    </>;

    const leftAreaMobile = <TabContext value={value}>
        <TabList onChange={(e, newValue: string) => setValue(newValue)}>
            <Tab label="Описание" value="1" sx={{ px: 0 }} />
            <Tab label="Характеристики" value="2" sx={{ px: 0, ml: 2 }} />
        </TabList>
        <TabPanel value="1" sx={{ pl: 0 }}>
            {productDescription}
        </TabPanel>
        <TabPanel value="2" sx={{ pl: 0 }}>
            <ProductCharacters product={product} />
        </TabPanel>
    </TabContext>;

    const brandAreaStyles = {
        flexDirection: 'row',
        gap: 2,
        justifyContent: { xs: 'flex-start', sm: 'flex-end' }
    };

    const brandLetters = product.brand.split(' ').reduce((acc, cur) => acc += cur[0], '');

    return (
        <Box sx={styles}>
            {
                upperMD && leftAreaDesktop || leftAreaMobile
            }
            <Stack sx={brandAreaStyles} component={Link} href={brandLink} className={'woUnderline'}>
                <Avatar sx={{ width: '56px', height: '56px', bgcolor: '#F5813F' }} variant="rounded">
                    {brandLetters}
                </Avatar>
                <Stack>
                    <Typography>Бренд:</Typography>
                    <Typography variant='h4' component={'span'} sx={{ fontWeight: 600 }}>
                        {product.brand}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
};

export const ProductContentSkeleton = () => {

    const theme = useTheme();
    const upperMD = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box sx={{ ...styles, height: '100px' }}>
            <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
            <Skeleton variant="rectangular" width={'100%'} height={'100%'} sx={{minWidth: '150px'}} />
            {upperMD && <Skeleton variant="rectangular" width={'100%'} height={'100%'} />}
        </Box>
    )
};

export default ProductContent;