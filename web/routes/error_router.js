import { Router } from 'express';
let error_router = Router();

export function renderNotFound(req, res) {
    return res.status(404).render('./404.html.twig', {
        domain: process.env.DOMAIN,
        site: process.env.SITE,
        title_site: process.env.TITLE_SITE,
        title: '404',
        description: '404',
        keywords: '',
        canonical: 'https://econforecasting.com/404',
        robots: 'noindex, follow',
        pagescript: null
    });
}

error_router.get('/404', renderNotFound);
error_router.use(renderNotFound);

export default error_router;
