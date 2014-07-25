---
layout: page
title: Google Trends Batch Fetcher
id: gt
---

# {{ page.title }}

The Google Trends bookmarklet aims at spawning a parasite interface on the Google Trends site to help you fetch a batch of CSVs files from the site.

## Installation

1. Install either *[Chrome](https://www.google.com/chrome/browser/)* or *Chromium*.
2. Display the bookmark bar if this is not already the case: `Parameters > Bookmarks > Show bookmarks bar`.
3. Drag and drop the icon below onto your bookmark bar.

<p align="center">
  <a href='{{ site.bookmarklets.gt }}' id='bookmarklet'>
    <img class="index-bookmarklet" alt="GT Batch" width="148" height="148" src="{{ site.baseurl }}/public/img/artoo-icon.svg" />
  </a>
</p>

## Advices

* You should use a browser you do not use usually so you can set a proxy for it and the downloads folder so you keep things organized and not mixed with your usual downloads.

## Usage

To use the tool:

0. Be sure to be connected to a gmail account and to have browse the Internet with it connected before.
1. Visit the google trends [homepage](https://www.google.fr/trends/).
2. Click the GT Batch bookmark.
3. Wait for the R2D2 sound to trigger and the interface to appear.
4. Write or copy you keywords list of the left block (WARNING: only one query per line and no `/` separators).
5. Click start and wait for the batch to complete.

Note that it is possible to resume the batch if you've quit the page before completion.

The right block will log information so you now what happens. If a red text appear, you've run into an error.

## Errors and their probable meanings

Whenever you reach an error, don't try to restart without reloading the page and the tool.

* If a request failed, just check your keyword works and relaunch the tool after a little wait.
* `quota`: you've reached your quota limit. Wait and check whether your google account is still live and not banned temporarily.
* `invalid_query`: one of your keyword failed because it triggered an invalid query to google trends. check your keyword and restart.
* `dead_end`: you've reached a dead end. Try disconnecting, reconnecting your gmail account and browse some more with it connected before restart.
* `404_throttle`: your account has likely been banned. Try connecting to it and reset it while providing google with the information they want. Either that or your keywords are messed up.

## N.B.

Sometimes, the tool might tell you to reload the page and the tool. You should really do it or weird things will happen.
