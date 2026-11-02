TECHNICAL SEO - Crystal Park Gas

1. robots.txt
   - Created at /robots.txt
   - Allows all pages, blocks /admin/, allows css/js/images
   - Points to sitemap.xml
   - Crawl-delay 10 for bots
   - Tested: https://crystalparkgas.co.za/robots.txt loads

2. sitemap.xml
   - Created at /sitemap.xml
   - 7 URLs with lastmod, changefreq, priority
   - Includes image sitemap for 19kg product
   - Submitted to Google Search Console + Bing Webmaster
   - Auto-updated date: 2026-11-02

3. Page Speed (Target 90+):
   - Images compressed 70% via TinyPNG, lazy loading, width/height set
   - CSS/JS minified, defer non-critical, preconnect to CDNs
   - GZIP + browser caching via .htaccess (1 year for images)
   - Preload critical CSS/JS
   - Result: Lighthouse Performance 92, LCP 1.8s, CLS 0.02
   - Tested on pagespeed.web.dev

4. Security:
   - HTTPS enforced via Let's Encrypt SSL, 301 redirect http->https
   - Security headers: X-Frame-Options, X-XSS-Protection, HSTS, CSP
   - No mixed content - all https://
   - CSP allows self + jquery.com + unpkg.com only
   - SecurityHeaders.com score: A
   - Mozilla Observatory: B+

Tools: Google Search Console, PageSpeed Insights, SecurityHeaders.com, TinyPNG, Let's Encrypt.