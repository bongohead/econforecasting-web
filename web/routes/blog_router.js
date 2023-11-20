import { Router } from 'express';
import { concat_js } from '../middleware.js';
import fs from 'fs'
import path from 'path';
let blog_router = Router();

const libs =
    ['jquery/jquery', 'bootstrap/bootstrap', 'gradient/gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat']
    .map(f => `libs/${f}`)
    .concat(['helpers'])

blog_router.get('/', concat_js('blog.js', libs), async (req, res, next) => {

    try {
        const page = req.query.p ? Number(req.query.p) : 1;
        const topic = req.query.topic ?? null;

        const page_length = 2;

        const files = await fs.promises.readdir('./../views/blog_posts');
        const data = await fs.promises.readFile('./../views/blog_posts/posts.json', 'utf8');
        const json_doc = JSON.parse(data);

        const blog_posts_in_fs = files.filter(file => path.extname(file).toLowerCase() === '.twig');

        const all_blog_posts =
            json_doc
            .filter(post => blog_posts_in_fs.includes(post.id + '.html.twig'))
            .filter(post => topic != null ? post.tags.includes(topic) : true)
            .map(post => {
                const date_string = post.datetime.replace(' ', 'T') + ':00.000Z';
                const date = new Date(date_string);

                const now = new Date();
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                const is_dst = now.getTimezoneOffset() < 300; // Check if DST is in effect
                now.setHours(now.getHours() - (is_dst ? 4 : 5)); // Adjust to Eastern Time Zone
                yesterday.setHours(yesterday.getHours() - (is_dst ? 4 : 5)); // Adjust to Eastern Time Zone
    
                const formatted_date = 
                    date.toDateString() === now.toDateString() ? 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase() 
                    : date.toDateString() === yesterday.toDateString()  ? 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase() 
                    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                return {
                    id: post.id,
                    title: post.title,
                    blurb: post.blurb,
                    date: date,
                    formatted_date: formatted_date,
                    blog_posts_in_fs: blog_posts_in_fs,
                    tags: post.tags
                }

            })
            .sort((a, b) => b.date - a.date)

        const page_blog_posts = all_blog_posts.slice((page - 1) * page_length, page * page_length);

        const blog_posts_el = page_blog_posts.map(p => {
            return `<div class="blog-post my-4">
                <div class="row g-0">
                    <div class="d-none d-md-block col-4">
                    </div>
                    <div class="col-12 col-md-8">
                        <h3 class="blog-post-title font-family-serif">${p.title}</h3>
                        <p class="blog-post-meta font-family-serif">${p.formatted_date} by <a href="#">Charles</a></p>
                        <div class="blog-post-content font-family-serif">${p.blurb}</div>
                        <a class="btn btn btn-sm bg-sky-light bg-hover-sky text-white px-2 py-1 text-sm font-family-serif">Continue reading...</a>
                    </div>
                </div>
            </div><hr class="me-4" style="border-bottom: 1px solid var(--slate-500); border-top: none;">`
        }).join('');

        const total_pages = Math.ceil(all_blog_posts.length / page_length);
        const pagination_el =
            `<a class="btn btn-sm rounded-pill px-3 fs-6 ${page === 1 ? 'disabled' : ''}" href="/blog?p=${page - 1}">Previous</a>
                <span class="fs-6 align-self-center mx-3 text-slate-500">Page ${page} of ${total_pages}</span>
                <a class="btn btn-sm rounded-pill px-3 fs-6 ${page >= total_pages ? ' disabled' : ''}" href="/blog?p=${page + 1}">Next</a>`;

        const tags_el = [...new Set(all_blog_posts.flatMap(p => p.tags))].sort().map(t => {
            return `<a class="ps-3 ${t === topic ? 'fw-bold': ''}" href="blog?topic=${encodeURIComponent(t)}">${t}</a>`
        }).join('');

        const clear_filters_el = topic != null ? '<a href="/blog">Clear filters</a>' : '';

        res.render(
            'blog.html.twig',
            {
                title: 'Blog | Macropredictions.com',
                description: 'Our latest commentary, analysis and data on economic forecasting, with a focus on the technical side of modeling and macroeconomics.',
                keywords: '',
                canonical: 'https://macropredictions.com/blog',
                pagescript: null,
                blog_posts: blog_posts_el,
                pagination: pagination_el,
                tags: tags_el,
                clear_filters: clear_filters_el
            }
        );
    } catch (err) {
        next(err)
    }

});


blog_router.get('/:post_id', concat_js('blog.js', libs), async (req, res) => {

    const post_id = req.params.post_id;
    const files = await fs.promises.readdir('./../views/blog_posts');
    const file_basenames = files.map(filename => {
        const parts = filename.split('.');
        parts.splice(-2, 2);
        return parts.join('.');
    });

    res.send(
        file_basenames.join('') + 
        file_basenames.includes(post_id)
    );


});





export default blog_router;