---
layout: page
title: Hacker News Scraper
id: hacker_news
---

# {{ page.title }}

---

* [Getting basic data](#basic)
* [Getting full data](#full)
* [Getting more pages](#more)
* [A nice bookmarklet?](#bookmarklet)

---

<h2 id="basic">Getting basic data</h2>

```js
artoo.scrape('td.title:has(a):not(:last)', {
  title: {sel: 'a'},
  url: {sel: 'a', attr: 'href'}
}, artoo.savePrettyJson);
```

---

<h2 id="full">Getting full data</h2>

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

---

<h2 id="more">Getting more pages</h2>
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

artoo.log.debug('Starting the scraper...');
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
      artoo.log.debug('Finished retrieving data. Downloading...');
      artoo.savePrettyJson(
        frontpage.concat(data),
        {filename: 'hacker_news.json'}
      );
    }
  }
);
```

Just change the `limit` to get more pages and put a `throttle` parameter not to be too hard on their servers.

---

<h2 id="bookmarklet">A nice bookmarklet?</h2>

Wouldn't it be nice to create a custom **artoo** bookmarklet scraping the first three pages of Hacker News?

Well this can be done thanks to **artoo**'s grunt task for which you can find documentation [here]({{ site.baseurl }}/grunt).

A full example of how you would create such a bookmarklet can be found on this [gist](https://gist.github.com/Yomguithereal/5d792d88ad6f1fe7c15d).

