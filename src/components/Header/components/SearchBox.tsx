import React from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Typography,
    Box,
    Link,
    MenuItem,
    MenuList,
    Avatar,
    Skeleton,
    Divider
} from '@mui/material';

import { Search, SearchIconWrapper, StyledInputBase, SearchContainer } from '../../../common/components/styledComponents';
import { type GetAutocompleteProducts } from '../../../containers/Header/Header_container';

import SearchIcon from '@mui/icons-material/Search';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

interface hint {
    hintSpans: {
        text: string;
        bold: boolean;
    }[];
    hint: string;
}

type searchResults = Awaited<ReturnType<GetAutocompleteProducts>>

const SearchBox: React.FC<{ GetAutocompleteProducts: GetAutocompleteProducts }> = ({ GetAutocompleteProducts }) => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Omit<searchResults, 'aborted'>>({ products: undefined, hints: undefined });
    const [showSearchResults, setShowSearchResults] = React.useState<boolean>(false);

    React.useEffect(() => {
        setSearch(searchParams.get('s') || '');
    }, [searchParams])

    const handleSearchApply = (e: React.KeyboardEvent<HTMLInputElement> | { key: string }, textToApply?: string) => {
        if ((e.key == 'Enter' && search != '') || textToApply) {
            const params = new URLSearchParams(`s=${textToApply || search}`);
            navigate(`/search/?${params.toString()}`);
            setSearchResults({ products: undefined, hints: undefined });
        };
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value != '') {
            setShowSearchResults(true);
            const {aborted, ...results} = await GetAutocompleteProducts(e.target.value);
            !aborted && setSearchResults(results);
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
                {(searchResults.products || searchResults.hints) && showSearchResults &&
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
                            searchResults.hints && searchResults.hints.map((item, i) =>
                                <MenuItem key={item.hint}>
                                    <Link sx={{ width: '100%', cursor: 'pointer', display: 'flex', gap: 1, alignItems: 'center' }} className='woUnderline' onClick={(e) => { e.preventDefault(); setSearch(item.hint); handleSearchApply({ key: 'Enter' }, item.hint) }}>
                                        <SearchIcon />
                                        <Typography>
                                            {
                                                item.hintSpans.map(span =>
                                                    <Typography key={span.text} component={'span'} sx={{ fontWeight: span.bold ? 600 : null }}>{span.text}</Typography>
                                                )
                                            }
                                        </Typography>
                                    </Link>
                                </MenuItem>
                            )
                        }
                        {
                            searchResults.hints && searchResults.products && <Divider />
                        }
                        {
                            searchResults.products && searchResults.products.map(product =>
                                <MenuItem key={product._id}>
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
                                            <Avatar src={`/img/products/${product._id}/100/0.webp`} alt={product.name} variant='square' sx={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, opacity: 1 }}>
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