;(function(undefined) {

  // Instantiating controller
  var controller = new domino({
    properties: {
      baseurl: {
        type: 'string',
        value: $('#baseurl').val()
      },
      template: {
        type: 'string',
        value: $('#bookmarklet-tpl').html()
      },
      opts: {
        type: 'object',
        value: {
          url: null,
          clipboard: true,
          loadingText: 'artoo.js is loading...',
          random: false,
          settings: {},
          version: 'latest'
        }
      },
      bookmarklet: {
        type: '?object',
        value: null,
        emit: 'bookmarklet.updated'
      }
    }
  });

  // Some basic events
  controller.on('generate', function(e) {
    var opts = controller.get('opts'),
        prodUrl = '//medialab.github.io/artoo/public/dist/',
        minified;

    // Attempting to uglify the given code
    try {
      minified = UglifyJS.minify(e.data.code);
    }
    catch (e) {
      console.log(e);
      return controller.emit('feedback', {
        text: 'Parsed JavaScript is not valid.',
        status: 'error'
      });
    }

    // Forging url
    var url = opts.url ||
              prodUrl + 'artoo-' + opts.version + '.min.js';

    // Templating
    var code = _.template(
      controller.get('template'),
      {
        settings: JSON.stringify({eval: JSON.stringify(minified)}),
        url: url,
        loadingText: opts.loadingText ?
          "console.log('" + opts.loadingText + "');" : '',
        random: opts.random ?
          "var r = Math.random(); script.src += '?r=' + r;" : ''
      }
    );

    // Bookmarklet
    var bookmarklet = 'javascript: ' + UglifyJS.minify(code);

    controller.update('bookmarklet', {name: e.data.name, string: bookmarklet});
    controller.emit('feedback', {
      text: 'Bookmarklet generated!',
      status: 'success'
    });
  });

  // Exporting
  this.control = controller;
}).call(this);
