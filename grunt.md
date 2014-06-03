---
layout: page
title: Grunt Task
id: grunt
---

# {{ page.title }}

**artoo** ships with a [grunt](http://gruntjs.com/) task enabling you to create custom bookmarklets.

Those are especially useful when you need precise settings for **artoo** or when you need to inject your own code using **artoo** as a framework.

This also makes possible the creation of bookmarklet scripts or applications that even non-developers can use.

---

## Installation

For the time being and until a proper [npm](https://www.npmjs.org/) release is done, the grunt task can be installed thusly:

```bash
npm install git+https://github.com/medialab/grunt-artoo.git
```

---

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-artoo-bookmarklet');
```

---

## The task

### Overview
In your project's Gruntfile, add a section named `artoo` to the data object passed into `grunt.initConfig()` and create as many targets as you need.

```js
grunt.initConfig({
  artoo: {
    dev_target: {
      options: {
        // Your options there...
      },
      dest: 'path/to/bookmarklet.min.js'
    },
    prod_target: ...
  },
});
```

### Settings

#### Root

* **options** *?object* : an object of options for the task.
* **src** *?string | ?array* : files to compile with the bookmarklet.
* **dest** *?string* [`./targetName.bookmarklet.min.js`] : destination for the created bookmarklet.

#### Options

* **url** *?string* : **artoo**'s url if you want to serve it by your own means rather than through the official url.
* **clipboard** *?boolean*  [`true`] : should the ouptput bookmarklet be automatically copied to your clipboard when generated?
* **loadingText** *?string* : a custom loading text to be written when **artoo** is loading.
* **random** *?boolean* [`false`] : should we load artoo with a random `GET` parameter in its url to shunt some cache systems?
* **settings** *?object* : a configuration object for **artoo**. A list of the available settings can be found [here]({{ site.baseurl }}/settings).

### Executing files through the bookmarklet
If you need the bookmarklet to execute some of your scripts, you can either specify a distant url from where you are going to serve said script through `options.scriptUrl` or let **artoo**'s task concatenate and minify the `src` files.

---

## Examples

#### A basic bookmarklet

```js
grunt.initConfig({
  artoo: {
    basic: {
      src: ['./src/file1.js', './src/file2.js'],
      dest: 'basic.bookmarklet.min.js'
    }
  },
});
```

#### A complex bookmarklet

```js
grunt.initConfig({
  artoo: {
    complex: {
      options: {
        url: 'http://localhost:8000/artoo.js',
        clipboard: false,
        random: true,
        settings: {
          log: {
            enabled: false
          },
          autoInit: false
        }
      },
      src: ['./src/file1.js', './src/file2.js'],
      dest: 'complex.bookmarklet.min.js'
    }
  },
});
```

Note finally that **artoo**'s standard bookmarklet are generated through this task and can be another useful [example](https://github.com/medialab/artoo/blob/master/Gruntfile.js#L98).