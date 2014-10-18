/** @jsx React.DOM */
;(function(undefined) {

  /**
   * CodeContainer
   *
   * A basic textarea meant to receive the code to compile into the
   * generated bookmarklet and a button to trigger the generation.
   */
  var CodeContainer = React.createClass({
    mixins: [control.mixin],
    generate: function() {

      // Retrieving code from textarea
      var code = this.refs.code.getDOMNode().value;

      if (!code.trim())
        return;

      // Dispatching
      this.control.emit('generate', {
        code: code
      });
    },
    render: function() {
      return (
        <div>
          <input placeholder="Need a fancy name?" type="text" ref="name" />
          <textarea placeholder="Paste your code here..."
                    className="code-container"
                    ref="code">
          </textarea>
          <button onClick={this.generate} type="button">Generate</button>
        </div>
      );
    }
  });

  /**
   * Bookmarklet
   *
   * The bookmarklet itself that will be generated and drag & dropped by
   * the user.
   */
  var Bookmarklet = React.createClass({
    render: function() {
      var style = {
        textAlign: 'center'
      };

      return !!this.props.string && (
        <p style={style}>
          <a href={this.props.string}>
            <img className="inline-img index-bookmarklet"
                 alt={this.props.name || 'custom'}
                 width="100"
                 height="100"
                 src={control.get('baseurl') + '/public/img/artoo-icon.svg'} />
          </a>
        </p>
      );
    }
  });

  /**
   * Generator
   *
   * The top-level component to render to display the generator.
   */
  var Generator = React.createClass({
    mixins: [control.mixin],
    renderOn: 'bookmarklet.updated',
    render: function() {
      var bookmarklet = this.control.get('bookmarklet') || {};

      return (
        <div>
          <Bookmarklet name={bookmarklet.name}
                       string={bookmarklet.string} />
          <CodeContainer />
        </div>
      );
    }
  });

  // Exporting
  this.Generator = Generator;
}).call(this);
