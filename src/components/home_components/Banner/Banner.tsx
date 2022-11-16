import React from 'react';
import {
    Banner,
    BannerItem,
    isBannerWithMultyItems,
} from '../../../common/types';

import { cardStyles, cardActionStyles } from './styles';

import {
    Card,
    CardActionArea,
    Slide,
    Stack,
    Link,
} from '@mui/material';

import BannerContent from './components/BannerContent';

interface BannerComponentProps {
    content: Banner,
    isActive: boolean,
    containerRef: React.RefObject<HTMLAnchorElement>,
    time: number,
    onPointerDown: React.MouseEventHandler<HTMLElement>,
    onClickHandler: React.MouseEventHandler<HTMLElement>,
    direction: 'left' | 'right',
    bottomPadding: number
}



const BannerComponent: React.FC<BannerComponentProps> = ({ content, isActive, containerRef, time, onPointerDown, onClickHandler, direction, bottomPadding }) => {

    return (
        <Slide in={isActive} direction={isActive ? direction : direction == 'right' ? 'left' : 'right'} timeout={time} easing='linear' container={containerRef.current}>
            {
                !isBannerWithMultyItems(content) ?
                    <BannerCard item={content[0]} onPointerDown={onPointerDown} onClickHandler={onClickHandler} bottomPadding={bottomPadding}/>
                    :
                    <Stack sx={{ width: '100%', position: 'absolute', height: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, touchAction: 'none' }} direction={'row'} onDragStart={(e) => e.preventDefault()} onPointerDown={onPointerDown} onClick={onClickHandler}>
                        {
                            content.map((item, i) =>
                                <BannerCard item={item} key={i} bottomPadding={bottomPadding} />
                            )
                        }

                    </Stack>
            }
        </Slide>
    )
};

const BannerCard = React.forwardRef<HTMLDivElement, { item: BannerItem, onPointerDown?: React.MouseEventHandler<HTMLElement>, onClickHandler?: React.MouseEventHandler<HTMLElement>, bottomPadding: number }>(({ item, onPointerDown, onClickHandler, bottomPadding }, ref) => {
    return (
        <Card
            sx={cardStyles(item, bottomPadding)}
            elevation={0}
            ref={ref}
            onPointerDown={onPointerDown}
            onDragStart={(e) => e.preventDefault()}
        >
            <CardActionArea href={item.link} component={Link} sx={cardActionStyles(item, bottomPadding)} className='woUnderline' onClick={onClickHandler}>
                <BannerContent item={item} bottomPadding={bottomPadding} />
            </CardActionArea>
        </Card>
    )
});

export default BannerComponent;