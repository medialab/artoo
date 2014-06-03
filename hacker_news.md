---
layout: page
title: Hacker News Scraper
id: hacker_news
---

# {{ page.title }}

---

## Basic

```js
artoo.scrape('td.title:has(a)', {
  title: {sel: 'a'},
  url: {sel: 'a', attr: 'href'}
}, artoo.savePrettyJson);
```

## Full

```js
artoo.scrape('td.title:has(a)', {
  title: {sel: 'a'},
  url: {sel: 'a', attr: 'href'},
  domain: function($) {
    return $(this).find('.comhead')
                  .text().trim().replace(/[\(\)]/g, '');
  },
  score: function($) {
    return +$(this).parent().next().find('[id^=score]')
                   .text().replace(/ points/, '');
  },
  user: function($) {
    return $(this).parent().next().find('a[href^=user]')
                  .text();
  },
  nb_comments: function($) {
    return +$(this).parent().next().find('a:last')
                   .text().replace(/ comments/, '');
  }
}, artoo.savePrettyJson);
```