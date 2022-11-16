import React from 'react';

const useCarousel = ({ time, delay, itemsQty, dots }: { time: number, delay: number, itemsQty: number, dots: boolean }) => {
    const [index, setIndex] = React.useState(0);

    const [isDragged, setIsDragged] = React.useState<boolean>(false);
    const [direction, setDirection] = React.useState<'left' | 'right'>('left');
    const [awaitBannerTransition, setAwaitBannerTransition] = React.useState<boolean>(false);
    let X: number | undefined;
    let movementX: number | undefined;

    let controllers: Record<string, any> = {};

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
    }

    let timer: NodeJS.Timeout;

    const handleForward = () => {
        setIndex(index == itemsQty - 1 ? 0 : index + 1);
        setDirection('left');
    };

    const handleBack = () => {
        setIndex(index == 0 ? itemsQty - 1 : index - 1);
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

    controllers.handleForward = handleForward;
    controllers.handleBack = handleBack;
    controllers.onPointerDown = onPointerDown;
    controllers.onClick = onClick;
    controllers.index = index;
    controllers.direction = direction;

    return controllers;
}

export default useCarousel;