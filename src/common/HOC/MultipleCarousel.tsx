import React, { useState, useEffect } from 'react';
import useCarousel from '../hooks/useCarousel';

import { MenuList, SxProps } from '@mui/material';

type children = React.ReactElement<HTMLElement>[];

type InitializerProps = {
    time: number,
    delay: number,
    itemsQty: number,
    infinite?: boolean,
    setActiveToChild?: boolean
}

type MultipleCarouselProps = {
    children: children,
    sx?: SxProps,
    settings: {
        time: number,
        index: number
        infinite: boolean,
        setIndex: (index: number) => void,
        setActiveToChild?: boolean
    },
}


export const MultipleCarousel: React.FC<MultipleCarouselProps> = ({ children, sx, settings }) => {
    const { time, index, infinite, setIndex, setActiveToChild } = settings;
    const ref = React.useRef<HTMLUListElement>(null);
    const [prevIndex, setprevIndex] = useState<number>(index);

    let pageX = 0;

    const addFirstChildToEnd = () => {
        if (!ref.current) return;
        const childs = ref.current.children;
        ref.current.append(childs[0]);
    };

    const addLastChildToStart = () => {
        if (!ref.current) return;
        const childs = ref.current.children;
        ref.current.prepend(childs[childs.length - 1]);
    };

    const setIndexToScrolledElement = () => {
        if (!ref.current) return;

        const galleryLeft = ref.current.getBoundingClientRect().left;

        const childWithMinShift = [...ref.current.children].sort((a, b) =>
            Math.abs(galleryLeft - a.getBoundingClientRect().left)
            - Math.abs(galleryLeft - b.getBoundingClientRect().left)
        )[0];

        const newIndex = Number(childWithMinShift.id);
        setIndex(newIndex);
        setprevIndex(index);
    };

    const galleryScroll = (e: MouseEvent) => {
        if (!ref.current) return;

        ref.current.style.pointerEvents = 'none';
        const childs = ref.current.children;
        setActiveToChild && [...childs].forEach(ch => ch.classList.add('active'));

        if (pageX == 0) {
            pageX = e.pageX;
            return;
        };

        const scroll = ref.current.scrollLeft + (pageX - e.pageX);
        const maxScroll = ref.current.scrollWidth - ref.current.getBoundingClientRect().width;

        if (scroll >= 0 && scroll < maxScroll) {
            ref.current.scrollLeft = scroll;
            pageX = e.pageX;
            return;
        };

        if (!infinite) {
            ref.current.scrollLeft = scroll < 0 ? 0 : maxScroll;
            pageX = e.pageX;
            return;
        };

        const gap = childs[1].getBoundingClientRect().left - childs[0].getBoundingClientRect().right;
        const firstChildWidth = childs[0].getBoundingClientRect().width;
        const lastChildWidth = childs[childs.length - 1].getBoundingClientRect().width;

        if (scroll < 0) {
            addLastChildToStart();
            ref.current.scrollLeft = lastChildWidth + gap + scroll;
        } else {
            addFirstChildToEnd();
            ref.current.scrollLeft = scroll - firstChildWidth - gap;
        };

        pageX = e.pageX;
    };

    const pointerUp: EventListener = (e) => {
        if (!ref.current) return;

        ref.current.style.pointerEvents = 'all';
        setActiveToChild && [...ref.current.children].forEach(ch => ch.classList.remove('active'));

        pageX = 0;
        setIndexToScrolledElement();
        document.removeEventListener('pointermove', galleryScroll);
        document.removeEventListener('pointerup', pointerUp);
    };

    const getScroll = () => {
        if (!ref.current || ref.current.children.length == 0 || index < 0) return 0;
        const childs = ref.current.children;

        const childToScroll = [...childs].find(child => +child.id == index);
        if (!childToScroll) return 0;

        return ref.current.scrollLeft + childToScroll.getBoundingClientRect().left - ref.current.getBoundingClientRect().left;
    };

    const scrollToActiveChild = () => {
        if (!ref.current || ref.current.children.length == 0 || index < 0) return;

        const childs = ref.current.children;
        const maxScroll = ref.current.scrollWidth - ref.current.getBoundingClientRect().width;

        const newScroll = getScroll();

        if (ref.current.scrollLeft == 0 && infinite && index == +childs[childs.length - 1].id) {
            addLastChildToStart();
            ref.current.scrollLeft = 0;
            setprevIndex(index);
            return;
        };

        if (newScroll > maxScroll) {
            if (infinite) {
                addFirstChildToEnd();
                ref.current.scrollLeft = getScroll();
            } else {
                ref.current.scrollLeft = maxScroll;
            };
            setprevIndex(index);
            return;
        };

        setprevIndex(index);
        ref.current.scrollLeft = newScroll;
    };

    useEffect(() => {
        if (!ref.current || index != prevIndex) return;
        [...ref.current.children].forEach((ch, i) => ch.id = "" + i);
    }, [children])

    useEffect(() => {
        if (
            !children
            || !ref.current
            || ref.current.children.length == 0
        ) return;
        scrollToActiveChild();
    }, [index]);

    function onDragStart() { return false; };
    function onPointerDown() {
        pageX = 0;
        document.addEventListener('pointermove', galleryScroll);
        document.addEventListener('pointerup', pointerUp);
    };

    return (
        <MenuList
            sx={{
                transition: `all ${time}ms`,
                gap: { xs: 1, md: 3 },
                ...sx,
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
            }}
            ref={ref}
            onDragStart={onDragStart}
            onPointerDown={onPointerDown}
        >
            {children}
        </MenuList>
    )
};

export default function getCarousel(parameters: InitializerProps) {
    const settings = useCarousel({
        time: parameters.time,
        delay: parameters.delay,
        itemsQty: parameters.itemsQty,
        infinite: parameters.infinite == undefined ? true : parameters.infinite
    });

    return {
        handleForward: settings['handleForward'],
        handleBack: settings['handleBack'],
        handleDot: settings['handleDot'],
        index: settings['index'],
        setIndex: settings['setIndex'],
        carouselSettings: {
            time: parameters.time,
            index: settings.index,
            infinite: parameters.infinite == undefined ? true : parameters.infinite,
            setIndex: settings.setIndex,
            setActiveToChild: parameters.setActiveToChild
        }
    };
};



