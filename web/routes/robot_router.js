// @ts-nocheck
import { Router } from 'express';
let robot_router = Router();

robot_router.get('/sitemap.xml', (req, res, next) => {
    try {
        res.header('Content-Type', 'text/xml');
        res.render('./sitemap.xml.twig', {site: process.env.SITE,                 title_site: process.env.TITLE_SITE,
        });
    } catch(err) {
        next(err);
    }
});

robot_router.get('/robots.txt', (req, res, next) => {
    try {
        res.type('text/plain');
        res.render('./robots.txt.twig', {site: process.env.SITE, title_site: process.env.TITLE_SITE});
    } catch(err) {
        next(err);
    }
});


export default robot_router;