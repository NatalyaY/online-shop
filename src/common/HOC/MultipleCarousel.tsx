'use strict';

import React, { useState, useEffect } from 'react';
import useCarousel from '../hooks/useCarousel';

import {
    MenuList,
} from '@mui/material';
import { CSSProperties } from '@mui/styled-engine';

type children = React.ReactElement<HTMLElement & { sx: CSSProperties } & React.DOMAttributes<HTMLElement>>[];

type InitializerProps = {
    time: number,
    delay: number,
    dots: boolean,
    itemsQty: number,
    infinite?: boolean,
}

type MultipleCarouselProps = {
    children: children,
    sx?: CSSProperties,
    settings: {
        time: number,
        index: number
        infinite: boolean,
        setIndex: (index: number) => void,
    },
}


export const MultipleCarousel: React.FC<MultipleCarouselProps> = ({ children, sx, settings }) => {
    const { time, index, infinite, setIndex } = settings;
    const [pointerEvents, setPointerEvents] = useState<CSSProperties['pointerEvents']>('all');
    const ref = React.useRef<HTMLUListElement>(null);
    const [childrenWithProps, setChildrenWithProps] = useState<typeof children | null>(null);
    const [dontAddChild, setDontAddChild] = useState<boolean>(false);
    const [prevIndex, setprevIndex] = useState<number>(index);


    const getChildrenWithProps = () => {
        return React.Children.map(children, (child, i) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child,
                    {
                        id: `${i}`,
                        sx: { ...child.props.sx, pointerEvents: pointerEvents },
                    }
                );
            };
            return child;
        })
    };

    if (!childrenWithProps) {
        setChildrenWithProps(getChildrenWithProps())
    };

    let pageX = 0;

    const addFirstChildToEnd = () => {
        if (!ref.current) return;
        const gap = ref.current.children[1].getClientRects()[0].x - (ref.current.children[0].getClientRects()[0].x + ref.current.children[0].getClientRects()[0].width);

        const firstChild = ref.current.children[0];
        ref.current.append(firstChild);
        const newItemShift = firstChild.getClientRects()[0].width + gap;
        ref.current.scrollLeft = ref.current.scrollWidth - ref.current.getClientRects()[0].width - newItemShift;
    };

    const addLastChildToStart = () => {
        if (!ref.current) return;
        const gap = ref.current.children[1].getClientRects()[0].x - (ref.current.children[0].getClientRects()[0].x + ref.current.children[0].getClientRects()[0].width);

        const lastChild = ref.current.children[ref.current.children.length - 1];
        ref.current.prepend(lastChild);
        ref.current.scrollLeft = lastChild.getClientRects()[0].width + gap;
    };

    const setIndexToScrolledElement = () => {
        if (!ref.current) return;

        const childWithMinShift = [...ref.current.children].reduce((acc, child) => {
            const accShift = Math.abs(acc.getClientRects()[0].x - ref!.current!.getClientRects()[0].x);
            const curShift = Math.abs(child.getClientRects()[0].x - ref!.current!.getClientRects()[0].x);
            return accShift <= curShift ? acc : child;
        });
        const newIndex = Number(childWithMinShift.id);
        setIndex(newIndex);
        setprevIndex(index);
    }

    const galleryScroll: EventListener = (e) => {
        if (!ref.current) return;
        if (pageX !== 0) {
            const scroll = ref.current.scrollLeft + (pageX - (e as MouseEvent).pageX);

            if (scroll < 0) {
                infinite ? addLastChildToStart() : ref.current.scrollLeft = 0;
            } else if (scroll >= ref.current.scrollWidth - ref.current.getClientRects()[0].width) {
                infinite ? addFirstChildToEnd() : ref.current.scrollLeft = ref.current.scrollWidth - ref.current.getClientRects()[0].width;
            } else {
                ref.current.scrollLeft = scroll;
            };
        };
        pageX = (e as MouseEvent).pageX;
        setPointerEvents('none');
    };

    const pointerUp = () => {
        if (!ref.current) return;

        pageX = 0;
        setPointerEvents('all');
        setIndexToScrolledElement();
        document.removeEventListener('pointermove', galleryScroll);
        document.removeEventListener('pointerup', pointerUp);
    };

    const pointerDown = () => {
        pageX = 0;
        document.addEventListener('pointermove', galleryScroll);
        document.addEventListener('pointerup', pointerUp);
    };

    const scrollToActiveChild = () => {
        if (!ref.current || ref.current.children.length == 0) return;
        if (index >= 0) {
            const childs = ref.current.children;
            const firstChild = childs[0];
            const activeChild = [...childs].find(child => +child.id == index);
            if (!activeChild) return;
            const scrollLeft = ref.current.scrollLeft;
            const galleryWidth = ref.current.getClientRects()[0].width;
            const galleryTotalWidth = ref.current.scrollWidth;

            if ((activeChild == childs[childs.length - 1]) && (scrollLeft == 0) && infinite && !dontAddChild) {
                addLastChildToStart();
                ref.current.scrollLeft = 0;
                setprevIndex(index);
                return;
            };

            if ((activeChild == firstChild) && (scrollLeft == galleryTotalWidth - galleryWidth) && infinite) {
                addFirstChildToEnd();
                ref.current.scrollLeft = galleryTotalWidth - galleryWidth;
                setprevIndex(index);
                return;
            };

            const firstChildX = firstChild.getClientRects()[0].x;
            const activeChildX = activeChild.getClientRects()[0].x;

            let scrollX = (scrollLeft + activeChildX) - (scrollLeft + firstChildX);
            if (scrollX > (galleryTotalWidth - galleryWidth)) {
                if ((index != childs.length - 1) && (prevIndex < index)) {
                    infinite && addFirstChildToEnd();
                    setIndex(childs.length - 1);
                    setDontAddChild(true);
                };
                scrollX = galleryTotalWidth - galleryWidth;
                if (prevIndex > index) {
                    setIndexToScrolledElement();
                    ref.current.scrollLeft = scrollX;
                    return;
                };
            };
            setprevIndex(index);
            ref.current.scrollLeft = scrollX;
        };
    };

    useEffect(() => {
        setChildrenWithProps(getChildrenWithProps());
    }, [pointerEvents]);

    useEffect(() => {
        if (!children || !ref.current || ref.current.children.length == 0) return;
        if (index != null) {
            scrollToActiveChild();
        };
    }, [index]);

    return (
        <MenuList
            sx={{
                display: 'flex',
                overflow: 'scroll hidden',
                userSelect: 'none',
                scrollbarWidth: 'none',
                whiteSpace: 'nowrap',
                touchAction: 'none',
                '&::-webkit-scrollbar': {
                    width: 0,
                    height: 0,
                },
                ...sx,
                gap: { xs: 1, md: 3 },
                transition: `all ${time}ms`,
            }}
            ref={ref}
            onDragStart={() => false}
            onPointerDown={() => pointerDown()}
        >
            {childrenWithProps}
        </MenuList>
    )
};

export default function getCarousel(parameters: InitializerProps) {
    const settings = useCarousel({
        time: parameters.time,
        delay: parameters.delay,
        itemsQty: parameters.itemsQty,
        dots: parameters.dots,
        infinite: parameters.infinite == undefined ? true : parameters.infinite
    });

    return {
        handleForward: settings['handleForward'],
        handleBack: settings['handleBack'],
        handleDot: settings['handleDot'],
        index: settings['index'],
        carouselSettings: {
            time: parameters.time,
            index: settings.index,
            infinite: parameters.infinite == undefined ? true : parameters.infinite,
            setIndex: settings.setIndex
        }
    };
};



