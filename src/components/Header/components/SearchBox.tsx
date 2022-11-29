import React from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Typography,
    Box,
    Link,
    MenuItem,
    MenuList,
    Avatar,
    Skeleton
} from '@mui/material';

import { Search, SearchIconWrapper, StyledInputBase, SearchContainer } from '../../../common/components/styledComponents';
import { type GetAutocompleteProducts } from '../../../containers/Header/Header_container';

import SearchIcon from '@mui/icons-material/Search';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';


const SearchBox: React.FC<{ GetAutocompleteProducts: GetAutocompleteProducts }> = ({ GetAutocompleteProducts }) => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Awaited<ReturnType<GetAutocompleteProducts>>>(null);
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
            const results = await GetAutocompleteProducts(e.target.value);
            setSearchResults(results);
        } else {
            setSearchResults(null);
        };
    };
    return (
        <SearchContainer>
            <Search>
                <SearchIconWrapper onClick={() => search != '' && navigate(`/search/?s=${search}`)}>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    value={search}
                    onKeyDown={handleSearchApply}
                    onChange={handleSearchChange}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 100)}
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
                                        className='woUnderline'
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', flex: '0 0 56px' }} width={56} height={56}>
                                            <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
                                            <Avatar src={product.image[0]} alt={product.name} variant='square' sx={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, opacity: 1 }}>
                                                <ImageNotSupportedIcon />
                                            </Avatar>
                                        </Box>
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
        </SearchContainer>
    )
};

export default SearchBox;