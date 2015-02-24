---
layout: page
title: Hacker News Scraper
id: hacker_news
---

# {{ page.title }}

---

* [You want basic data?](#basic)
* [You want full data?](#full)
* [You want more pages?](#more)
* [And a nice bookmarklet with that?](#nice-bookmarklet)

---

<h2 id="basic">Getting basic data</h2>

```js
artoo.scrape('td.title:nth-child(3)', {
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
var scraper = {
  iterator: 'tr tr:has(td.title:has(a)):not(:last)',
  data: {
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
        return +$(this).text().replace(' points', '');
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
        var nb = +$(this).text().replace(' comments', '');
        return isNaN(nb) ? 0 : nb;
      }
    }
  }
};

function nextUrl($page) {
  return $page.find('td.title:last > a').attr('href');
}

artoo.log.debug('Starting the scraper...');
var frontpage = artoo.scrape(scraper);

artoo.ajaxSpider(
  function(i, $data) {
    return nextUrl(!i ? artoo.$(document) : $data);
  },
  {
    limit: 2,
    scrape: scraper,
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

<h2 id="nice-bookmarklet">A nice bookmarklet?</h2>

> &laquo; *Ok, I see your point but this is quite tiresome to copy & paste code into the JavaScript console. There should be a more pratical way.* &raquo;

Fortunately, there is: You could create a custom **artoo.js** bookmarklet wrapping things up.

<p align="center">
  <a href='{{ site.bookmarklets.hackernews }}' id='bookmarklet'>
    <img alt="artoo HN" width="108" height="108" src="{{ site.baseurl }}/public/img/hackernews.png" />
  </a>
</p>

In fact, the icon above is just this. Just drop it onto your bookmark bar and click it when visiting *Hacker News* and it should download the first three pages' data.

This is not instantaneous so please wait for the data to be retrieved and downloaded for if you click the bookmark twice, you will logically download the data twice.

---

Custom bookmarks such as this one can easily be generated through a specific gulp plugin whose documentation can be found [here]({{ site.baseurl }}/gulp).

Finally, a fully explained example of how you would create such a bookmarklet can be found on this [gist](https://gist.github.com/Yomguithereal/5d792d88ad6f1fe7c15d).
