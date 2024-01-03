import { Router } from 'express';
let error_router = Router();

// 404
error_router.get('/404', (req, res) => {
    res.render('./404.html.twig', {
        site: process.env.SITE,
        title_site: process.env.TITLE_SITE,
        title: '404',
        description: '404',
        keywords: '',
        canonical: 'https://macropredictions.com/404',
        pagescript: null
    });

});
  
// Catch all route
error_router.get('*', (req, res) => {
    res.redirect('/404');
});

export default error_router;  