import { Router } from 'express';
import { concat_js } from '../middleware.js';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let blog_router = Router();

const libs =
    ['jquery/jquery', 'bootstrap/bootstrap', 'gradient/gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat']
    .map(f => `libs/${f}`)
    .concat(['helpers'])

// Get all blog posts existing in JSON
const raw_data = await fs.promises.readFile(path.join(__dirname, '..', '..', 'views', 'blog_posts', 'posts.json'), 'utf8');
const blog_posts_in_json = JSON.parse(raw_data);

// Get all blog posts existing in file system
const files = await fs.promises.readdir(path.join(__dirname, '..', '..', 'views', 'blog_posts'));
const blog_posts_in_fs = files.filter(file => path.extname(file).toLowerCase() === '.twig');

const valid_posts = blog_posts_in_json.filter(post => blog_posts_in_fs.includes(post.id + '.html.twig')).map(post => {
    const date = new Date(new Date(post.datetime).toLocaleString('en-US', {timeZone: 'US/Eastern'}));
    return {...post, date: date, year: date.getFullYear()}
})

// Extract a list of all topics belonging to all valid posts
const valid_topics = [...new Set(valid_posts.flatMap(p => p.topics))].sort();
const valid_years = [...new Set(valid_posts.flatMap(p => p.year))].sort();

// Main blog page
blog_router.get('/', concat_js('blog.js', libs), async (req, res, next) => {

    try {
        const page = req.query.p ? Number(req.query.p) : 1;
        const query_topic = req.query.topic ?? null;
        const query_year = parseInt(req.query.year) || null; // If fail, return null

        const page_length = 5;

        // Get all blog posts that exist in both file system and JSON; clean up date format
        const now = new Date();
        const today = new Date(now.toLocaleString('en-US', {timeZone: 'US/Eastern'}));
        const yday = new Date((new Date(now.getTime() - (24 * 60 * 60 * 1000))).toLocaleString('en-US', {timeZone: 'US/Eastern'}));

        // Filter posts to only include topics which pass the filters
        const filtered_posts =
            valid_posts
            .map(post => {
                const date = post.date;
                const formatted_date = 
                    date.toDateString() === today.toDateString() ? 'Today at ' + date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}).toLowerCase() 
                    : date.toDateString() === yday.toDateString()  ? 'Yesterday at ' + date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}).toLowerCase() 
                    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '');;
                return {...post, formatted_date: formatted_date}
            })
            .sort((a, b) => b.date - a.date)    
            .filter(post => query_topic === null || post.topics.includes(query_topic))
            .filter(post => query_year === null || post.year === query_year)

        // Get posts belonging to the relevant page only
        const page_posts = filtered_posts.slice((page - 1) * page_length, page * page_length);

        // Get pagination
        const banner_blog_post_el = page_posts.length === 0 ? '<h5>No results found! <a href="/blog">Clear filters</a>.</h5>' :
        `
        <a href="/blog/${page_posts[0].id}" class="d-block bg-white-neutral bg-hover-white-warm text-decoration-none text-slate-700 text-hover-slate-900 transition duration-100" style="height: 18rem">
            <div class="d-flex w-100 h-100">
                <div class="d-block" style="width:30rem;background-image:url(/static/img/blog/${page_posts[0].img});background-size:cover;background-repeat:no-repeat;background-position:center;">
                </div>
                <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center px-5">
                    <h3 class="blog-post-title text-center">${page_posts[0].title}</h3>
                    <p class="blog-post-meta text-sm text-slate-500">${page_posts[0].formatted_date} by Charles</p>
                    <div class="blog-post-content">${page_posts[0].blurb}</div>
                </div>
            </div>
        </a>
        `

        const blog_posts_el = page_posts.slice(1).map(p => {
            return `
            <a href="/blog/${p.id}" class="d-block text-decoration-none text-slate-700 text-hover-slate-900 transition duration-100 bg-white bg-hover-white-warm rounded rounded-2" style="height:12rem">
                <div class="d-flex w-100 h-100">
                    <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-start px-2">
                        <h5 class="blog-post-title">${p.title}</h5>
                        <p class="blog-post-meta text-xs text-slate-400">${p.formatted_date} by Charles</p>
                        <div class="blog-post-content">${p.blurb}</div>
                    </div>
                    <div class="d-none d-md-block mb-4 mt-1 me-1 rounded rounded-2" style="min-width:12rem;width:12rem;background-image:url(/static/img/blog/${p.img});background-size:cover;background-repeat:no-repeat;background-position:center;"></div>
                </div>
            </a>
            <hr style="border-top:1px solid var(--slate-200)" class="my-2">
            `
        }).join('');

        const total_pages = Math.ceil(filtered_posts.length / page_length);
        const pagination_el = page_posts.length === 0 ? '' : 
            `<a class="btn btn-sm rounded-0 px-3 fs-6 border-0 ${page === 1 ? 'disabled' : ''}" href="/blog?p=${page - 1}">Previous</a>
            <span class="fs-6 align-self-center mx-3 text-slate-500">Page ${page} of ${total_pages}</span>
            <a class="btn btn-sm rounded-0 px-3 fs-6 border-0 ${page >= total_pages ? ' disabled' : ''}" href="/blog?p=${page + 1}">Next</a>`;

        // Get topics filtering widget
        const topics_el = valid_topics.map(function(topic) {
            if (query_topic !== null && query_topic === topic) {
                return `
                    <div class="d-flex flex-nowrap">
                        <a class="badge-sm badge text-sm transition duration-200 text-decoration-none text-hover-slate-200 bg-sky text-slate-200 bg-hover-sky-dark" href="blog?topic=${encodeURIComponent(topic)}${query_year !== null ? '&year='+query_year : ''}">${topic}</a>
                        <a class="align-self-center transition duration-200 text-decoration-none text-sky text-hover-sky-dark ms-1" href="blog?${query_year !== null ? '&year='+query_year : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </a>
                    </div>
                    `;
            } else {
                // Match margins of the "x" box = width of icon + size of left-margin
                return `
                    <div class="d-flex" style="margin-right: calc(10px + 0.25rem);">
                        <a class="badge-sm badge text-sm transition duration-200 text-decoration-none text-hover-slate-200 bg-slate-300 text-slate-500 bg-hover-sky" href="blog?topic=${encodeURIComponent(topic)}${query_year !== null ? '&year='+query_year : ''}">${topic}</a>
                    </div>`
            }
        }).join('');

        const years_el = valid_years.map(function(year) {
            if (query_year !== null && query_year === year) {
                return `
                    <div class="d-flex flex-nowrap">
                        <a class="badge-sm badge text-sm transition duration-200 text-decoration-none text-hover-slate-200 bg-sky text-slate-200 bg-hover-sky-dark" href="blog?year=${encodeURIComponent(year)}${query_topic !== null ? '&topic='+query_topic : ''}">${year}</a>
                        <a class="align-self-center transition duration-200 text-decoration-none text-sky text-hover-sky-dark ms-1" href="blog?${query_topic !== null ? '&topic='+query_topic : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </a>
                    </div>
                    `;
            } else {
                return `
                <div class="d-flex" style="margin-right: calc(10px + 0.25rem);">
                    <a class="badge-sm badge text-sm transition duration-200 text-decoration-none text-hover-slate-200 bg-slate-300 text-slate-500 bg-hover-sky" href="blog?year=${encodeURIComponent(year)}${query_topic !== null ? '&topic='+query_topic : ''}">${year}</a>
                </div>`
            }
        }).join('');

        const clear_filters_el = query_topic != null ? '<a class="text-sm ms-1 fst-italic text-decoration-none text-sky-light text-hover-sky" href="/blog">clear all</a>' : '';

        res.render(
            'blog.html.twig',
            {
                domain: process.env.DOMAIN,
                site: process.env.SITE,
                title_site: process.env.TITLE_SITE,
                title: 'Blog | ' + process.env.TITLE_SITE,
                description: 'Our latest commentary, analysis and data on economic forecasting, with a focus on the technical side of modeling and macroeconomics.',
                keywords: '',
                canonical: 'https://econforecasting.com/blog',
                pagescript: null,
                banner_blog_post: banner_blog_post_el,
                blog_posts: blog_posts_el,
                pagination: pagination_el,
                topics: topics_el,
                years: years_el,
                clear_filters: clear_filters_el
            }
        );
    } catch (err) {
        next(err)
    }

});


blog_router.get('/:post_id', concat_js('blog.js', libs), async (req, res, next) => {

    const post_id = req.params.post_id;
    const match_posts = valid_posts.filter(post => post.id === post_id);
    
    if (match_posts.length !== 1) res.status(200).json('Error');
    const this_post = match_posts[0]

    try {
        res.render(
            `blog_posts/${post_id}.html.twig`,
            {
                domain: process.env.DOMAIN,
                site: process.env.SITE,
                title_site: process.env.TITLE_SITE,
                title: this_post.title + ' | ' + process.env.TITLE_SITE,
                description: 'Our latest commentary, analysis and data on economic forecasting, with a focus on the technical side of modeling and macroeconomics.',
                keywords: '',
                canonical: 'https://econforecasting.com/blog',
                pagescript: null,
                // Blog-specific options, see blogpost.html.twig
                blog_title: this_post.title,
                blog_img: this_post.img
            }
        );
    } catch (err) {
        next(err)
    }

    // res.send(
    //     file_basenames.join('') + 
    //     file_basenames.includes(post_id)
    // );


});





export default blog_router;