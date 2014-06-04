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
    method: function($) {
      return $(this).length ? $(this).text() : null;
    }
  },
  nb_comments: {
    sel: '+ tr a[href^=item]',
    method: function($) {
      var nb = +$(this).text().replace(/ comments/, '');
      return isNaN(nb) ? 0 : nb;
    }
  }
}, artoo.savePrettyJson);
```

## Getting more pages
One could easily scrape several pages by using an [ajaxSpider]({{ site.baseurl }}/spiders).

*Example - Downloading the first three pages*

```js
function scrapeOnePage($page) {
  return artoo.scrape(
    $page.find('tr tr:has(td.title:has(a)):not(:last)'),
    {
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
        method: function($) {
          return $(this).length ? $(this).text() : null;
        }
      },
      nb_comments: {
        sel: '+ tr a[href^=item]',
        method: function($) {
          var nb = +$(this).text().replace(/ comments/, '');
          return isNaN(nb) ? 0 : nb;
        }
      }
    }
  );
}

function nextUrl($page) {
  return $page.find('td.title:last > a').attr('href');
}

var frontpage = scrapeOnePage(artoo.$(document));

artoo.ajaxSpider(
  function(i, data) {
    if (!i)
      return nextUrl(artoo.$(document));
    else
      return nextUrl(artoo.$(data));
  },
  {
    limit: 2,
    callback: function(data, i) {
      artoo.log.debug('Fecthed page ' + (i + 1));
      return scrapeOnePage(artoo.$(data));
    },
    concat: true,
    done: function(data) {
      artoo.savePrettyJson(
        frontpage.concat(data),
        {filename: 'hacker_news.json'}
      );
    }
  }
);
```

Just change the `limit` to get more pages and put a `throttle` parameter not to be too hard on their servers.
