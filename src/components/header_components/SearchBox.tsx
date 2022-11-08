import React from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Typography,
    Box,
    Link,
    MenuItem,
    MenuList,
    Avatar,
} from '@mui/material';

import { Search, SearchIconWrapper, StyledInputBase } from '../../common/styledComponents';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';

import Product from '../../../server/db/models/product';


const SearchBox = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<null | Product[]>(null);
    const [showSearchResults, setShowSearchResults] = React.useState<boolean>(false);

    React.useEffect(() => {
        setSearch(searchParams.get('s') || '');
    }, [searchParams])

    const handleSearchApply = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter' && search != '') {
            navigate(`/search/?s=${search}`);
            setSearchResults(null);
        };
    };
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value != '') {
            setShowSearchResults(true);
            const products = await (await fetch(`/api/products/autocomplete?s=${e.target.value}`)).json();
            setSearchResults(products.length ? products : null);
        } else {
            setSearchResults(null);
        };
    };
    return (
        <Search>
            <SearchIconWrapper onClick={() => search != '' && navigate(`/search/?s=${search}`)}>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                value={search}
                onKeyDown={handleSearchApply}
                onChange={handleSearchChange}
                onBlur={() => setShowSearchResults(false)}
                placeholder="Найти…"
                inputProps={{ 'aria-label': 'search' }}
            />
            {searchResults && showSearchResults &&
                <Box
                    component={MenuList}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                        overflow: 'hidden auto'
                    }}>
                    {
                        searchResults.map(product =>
                            <MenuItem key={product._id as unknown as string}>
                                <Link
                                    href={product.breadcrumps ? product.breadcrumps[product.breadcrumps?.length - 1].link : '/'}
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <Avatar src={product.image[0]} alt={product.name} variant='square' sx={{ width: 56, height: 56 }}>
                                        <ImageIcon />
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant='body1'
                                            component='h6'
                                            sx={{
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}>
                                            {product.description}
                                        </Typography>
                                    </Box>
                                </Link>
                            </MenuItem>
                        )
                    }
                </Box>
            }
        </Search>
    )
};

export default SearchBox;