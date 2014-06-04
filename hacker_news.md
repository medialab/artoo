---
layout: page
title: Hacker News Scraper
id: hacker_news
---

# {{ page.title }}

---

## Basic

```js
artoo.scrape('td.title:has(a):not(:last)', {
  title: {sel: 'a'},
  url: {sel: 'a', attr: 'href'}
}, artoo.savePrettyJson);
```

## Full

```js
artoo.scrape('tr tr:has(td.title:has(a)):not(:last)', {
  title: {sel: '.title a'},
  url: {sel: '.title a', attr: 'href'},
  domain: {
    sel: '.comhead',
    method: function($) {
      return $(this).text().trim().replace(/[\(\)]/g, '');
    }
  },
  score: {
    sel: '+ tr [id^=score]',
    method: function($) {
      return +$(this).text().replace(/ points/, '');
    }
  },
  user: {
    sel: '+ tr a[href^=user]',
    method: 'text'
  },
  nb_comments: {
    sel: '+ tr a:last',
    method: function($) {
      return +$(this).text().replace(/ comments/, '');
    }
  }
}, artoo.savePrettyJson);
```

## Getting more pages
One could easily scrape several pages by using an [ajaxSpider]({{ site.baseurl }}/spiders).
