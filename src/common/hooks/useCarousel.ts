import React from 'react';

const useCarousel = ({ time, delay, itemsQty, dots, infinite = true }: { time: number, delay: number, itemsQty: number, dots: boolean, infinite?: boolean }) => {
    const [index, setIndex] = React.useState(0);

    const [isDragged, setIsDragged] = React.useState<boolean>(false);
    const [direction, setDirection] = React.useState<'left' | 'right'>('left');
    const [awaitBannerTransition, setAwaitBannerTransition] = React.useState<boolean>(false);
    let X: number | undefined;
    let movementX: number | undefined;

    let controllers: {
        handleForward: () => void,
        handleBack: () => void,
        onPointerDown: React.MouseEventHandler<HTMLElement>,
        onClick: React.MouseEventHandler<HTMLElement>,
        index: number,
        direction: "left" | "right",
        handleDot?: (i: number) => Promise<void>,
        setIndex: (index: number) => void
    };

    let timer: NodeJS.Timeout;

    const handleForward = () => {
        handleIndexChange(index + 1);
        setDirection('left');
    };

    const handleBack = () => {
        handleIndexChange(index - 1);
        setDirection('right');
    };

    const onPointerDown: React.MouseEventHandler<HTMLElement> = (e) => {
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        X = (e.pageX);
    };

    const onPointerMove: EventListener = (e) => {
        setIsDragged(true);
        movementX = (e as MouseEvent).pageX - (X || 0);
    };

    const onPointerUp: EventListener = (e) => {
        if (movementX != undefined) {
            if (movementX > 0) {
                handleBack();
            } else if (movementX < 0) {
                handleForward();
            };
        };
        X = undefined;
        movementX = undefined;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
    };

    const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
        if (isDragged) {
            e.preventDefault();
            setIsDragged(false);
        };
    };

    const handleIndexChange = (index: number) => {
        if (index > itemsQty - 1) {
            setIndex(infinite ? 0 : itemsQty - 1)
        } else if (index < 0) {
            setIndex(infinite ? itemsQty - 1 : 0)
        } else {
            setIndex(index)
        }
    }

    controllers = {
        handleForward,
        handleBack,
        onPointerDown,
        onClick,
        index,
        direction,
        setIndex: handleIndexChange
    };

    if (dots) {
        const [dotIndex, setDotIndex] = React.useState<number | null>(null);
        React.useEffect(() => {
            const awaitTransition = async (callback: () => void) => {
                await new Promise((resolve) => { setTimeout(resolve, time) });
                callback();
            };
            if (dotIndex != null) {
                if (dotIndex < index) {
                    if (!awaitBannerTransition) {
                        setAwaitBannerTransition(true);
                        handleBack();
                    } else {
                        awaitTransition(handleBack);
                    };
                } else if (dotIndex > index) {
                    if (!awaitBannerTransition) {
                        setAwaitBannerTransition(true);
                        handleForward();
                    } else {
                        awaitTransition(handleForward);
                    };
                } else {
                    setDotIndex(null);
                    setAwaitBannerTransition(false);
                }
            };
        }, [index, dotIndex]);
        const handleDot = async (i: number) => {
            setDotIndex(i);
        };
        controllers.handleDot = handleDot;
    };

    return controllers;
}

export default useCarousel;