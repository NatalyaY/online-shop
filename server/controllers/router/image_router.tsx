import express from 'express';
import sharp from 'sharp';
import path from 'path';

const indexPath = path.join(__dirname, '../../../media');
const router = express.Router();

const extensions = ['webp' as 'webp', 'png' as 'png', 'jpg' as 'jpg', 'jpeg' as 'jpeg', 'gif' as 'gif', 'svg' as 'svg'];

type extension = typeof extensions[number];

const sendFallBack = (res: express.Response) => res.status(200).sendFile(`${indexPath}/no_img.jpg`);

router.get('/:id/:w/:number.:ext', async (req, res) => {
    const { w: width, id, ext, number } = req.params;
    const filePath = `${indexPath}/${id}/original_${number}.jpeg`;

    if (isNaN(+width) || isNaN(+number) || !extensions.includes(ext as any)) {
        return sendFallBack(res);
    };

    try {
        const sharpStream = sharp(filePath)
            .resize({ width: +width })
            .toFormat((ext as extension), { quality: 80 })
            .toBuffer()
        res.type(ext).send(await sharpStream);
    } catch (error) {
        return sendFallBack(res);
    }
});

export default router;
