import { Router } from 'express';
import { concat_js } from '../middleware.js';
import fs from 'fs'
import path from 'path';
let blog_router = Router();

const libs =
    ['jquery/jquery', 'bootstrap/bootstrap', 'gradient/gradient', 'dayjs/dayjs', 'dayjs/timezone', 'dayjs/utc', 'dayjs/minmax', 'dayjs/advancedformat']
    .map(f => `libs/${f}`)
    .concat(['helpers'])

blog_router.get('/', concat_js('blog.js', libs), (req, res) => {

    const page = req.query.p ? Number(req.query.p) : 1;
    const page_length = 4;

    fs.readdir('./../views/blog_posts', (err, files) => {

        if (err) {
            res.status(500).send('Error reading directory');
            return;
        }

        const blog_posts_in_fs = files.filter(file => path.extname(file).toLowerCase() === '.twig');

        const read_json = new Promise((resolve, reject) => {
            fs.readFile('./../views/blog_posts/posts.json', 'utf8', (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            });
        });

        read_json.then(json_doc => {

            const blog_posts =
                json_doc
                .filter(post => blog_posts_in_fs.includes(post.id + '.html.twig'))
                .map(post => {
                    console.log(post);
                    const date_string = post.datetime.replace(" ", "T") + ":00.000Z";
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
                        blog_posts_in_fs: blog_posts_in_fs
                    }

                });

            const blog_posts_el = blog_posts.map(p => {
                return `<div class="blog-post my-4">
                    <h3 class="blog-post-title">${p.title}</h3>
                    <p class="blog-post-meta">${p.formatted_date} by <a href="#">Charles</a></p>
                    <div class="blog-post-content">${p.blurb}</div>
                    <a class="btn btn btn-sm bg-sky-light bg-hover-sky text-white px-2 py-1 text-sm">Continue reading...</a>
                </div><hr class="me-4" style="border-bottom: 1px solid var(--slate-500); border-top: none;s">`
            }).join('');

            const total_pages = Math.ceil(blog_posts.length / page_length);
            const pagination_el =
                `<div class="blog-pagination d-flex justify-content-center mt-5">
                    <a class="btn btn-sm bg-forest-light bg-hover-forest text-white rounded-pill px-3 fs-6 ${page === 1 ? ' disabled' : ''}" href="/blog?p=${page - 1}">Previous</a>
                    <span class="fs-6 align-self-center mx-3 text-slate-500">Page ${page} of ${total_pages}</span>
                    <a class="btn btn-sm bg-forest-light bg-hover-forest text-white rounded-pill px-3 fs-6 ${page >= total_pages ? ' disabled' : ''}" href="/blog?p=${page + 1}">Next</a>
                </div>`;

            res.render(
                'blog.html.twig',
                {
                    blog_posts: blog_posts_el,
                    pagination: pagination_el
                }
              );




        });   
             

        // blog_posts.sort((a, b) => b.date - a.date);

        // // Calculate the start and end indices for the current page
        // const start = (page - 1) * page_length;
        // const end = start + page_length;

        // const page_posts = blog_posts.slice(start, end);
        
        
        // const read_files = page_posts.map(post => {
        //     return new Promise((resolve, reject) => {
        //         fs.readFile(post.filepath, 'utf8', (err, data) => {
        //             const post_with_content = {
        //                 ...post,
        //                 post_content: data
        //             }
        //             if (err) reject(err);
        //             else resolve(post_with_content);
        //         });
        //     });
        // });

        // const html_renders = Promise.all(read_files).then(page_posts_with_content => {
        //     const blog_posts_el = 
        //         page_posts_with_content
        //         .map(p => {
        //             return `<div class="blog-post my-4">
        //                 <h2 class="blog-post-title">${p.post_name}</h2>
        //                 <p class="blog-post-meta">${p.formatted_date} by <a href="#">Charles</a></p>
        //                 <div class="blog-post-content">${p.post_content}</div>
        //                 <a class="btn btn btn-sm bg-sky-light bg-hover-sky text-white px-2 py-1 text-sm">Continue reading...</a>
        //             </div>`
        //         })
        //         .join('');

        //     const total_pages = Math.ceil(blog_posts.length / page_length);
        //     const pagination_el =
        //         `<div class="blog-pagination d-flex justify-content-center mt-5">
        //             <a class="btn btn-sm bg-forest-light bg-hover-forest text-white rounded-pill px-3 fs-6 ${page === 1 ? ' disabled' : ''}" href="/blog?p=${page - 1}">Previous</a>
        //             <span class="fs-6 align-self-center mx-3 text-slate-500">Page ${page} of ${total_pages}</span>
        //             <a class="btn btn-sm bg-forest-light bg-hover-forest text-white rounded-pill px-3 fs-6 ${page >= total_pages ? ' disabled' : ''}" href="/blog?p=${page + 1}">Next</a>
        //         </div>`;

        //     res.render(
        //         'blog.html.twig',
        //         {
        //             blog_posts: blog_posts_el,
        //             pagination: pagination_el
        //         }
        //       );
    
        // }).catch(err => {
        //     res.status(500).send('Error rendering page')
        // })

        // res.json(page_posts);
    });

});



export default blog_router;