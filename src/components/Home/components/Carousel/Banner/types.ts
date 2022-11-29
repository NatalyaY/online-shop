export interface button {
    text: string,
    link?: string,
    backgroundColor?: string,
    color?: string
};

export interface imageLabel {
    main: string,
    before?: string,
    after?: string,
    backgroundColor?: string,
    color?: string
};

interface image {
    src: string,
    label?: imageLabel,
    margin?: number,
};

interface mediaImage extends image {
    position: 'media'
};

interface normalImage extends image {
    position: 'left' | 'right' | 'center' | 'top' | 'bottom'
};

interface text {
    title: string,
    position: 'left' | 'right' | 'center' | 'top' | 'bottom',
    caption?: string,
    color?: string,
}

interface normalText extends text { };

interface bannerMediaImageText extends text {
    backgroundColor?: string,
};

interface BannerCommon {
    text: normalText | bannerMediaImageText,
    link: string,
    buttons?: button[] | [button, button, ...button[]],
    images?: [normalImage, normalImage, ...normalImage[]] | [normalImage] | [mediaImage],
    backgroundColor?: string,
};

interface BannerWOImage extends BannerCommon {
    text: normalText
};

interface BannerSingleImage extends BannerCommon {
    images: [normalImage],
    text: normalText
};

export interface BannerMediaImage extends BannerCommon {
    images: [mediaImage],
    text: bannerMediaImageText
};

interface BannerMultyImages extends BannerCommon {
    images: [normalImage, normalImage, ...normalImage[]],
    text: normalText
};

type Item = BannerWOImage | BannerSingleImage | BannerMediaImage | BannerMultyImages;
export type MulipleItem = Item & { order: number, orderMobile: number };
export type Banner = [Item] | [MulipleItem, MulipleItem, ...MulipleItem[]];
export type BannerItem = Item | MulipleItem;

export type images = NonNullable<BannerItem['images']>;
export type imagePositionWOMedia = normalImage['position'];

export const isBannerWOImage = (item: any): item is BannerWOImage => {
    return item.images === undefined
};

export const isBannerWithMediaImage = (item: any): item is BannerMediaImage => {
    return item.images && item.images.length == 1 && item.images[0].position == 'media'
};

export const isBannerWithMultyItems = (item: any): item is MulipleItem => {
    return (item.order && item.orderMobile && true) || (Array.isArray(item) && item[0].order && item[0].orderMobile && item.length !== 1)
};