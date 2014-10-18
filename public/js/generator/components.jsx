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
      var code = this.refs.code.getDOMNode().value,
          name = this.refs.name.getDOMNode().value;

      if (!code.trim())
        return;

      // Dispatching
      this.control.emit('generate', {
        name: name,
        code: code
      });
    },
    componentDidMount: function () {
      this.refs.code.getDOMNode().focus();
    },
    render: function() {
      return (
        <div>
          <div>
            <input className="form-control"
                   placeholder="Your bookmarklet name"
                   type="text"
                   ref="name" />
          </div>
          <br />
          <div className="code-div">
            <textarea placeholder="Paste your code here..."
                      className="form-control code-container"
                      ref="code">
            </textarea>
          </div>
          <br />
          <div>
            <button className="btn btn-default"
                    onClick={this.generate}
                    type="button">Generate</button>
            <Dialog />
          </div>
        </div>
      );
    }
  });

  /**
   * Dialog
   *
   * Just a little span providing some feeback to the user.
   */
  var Dialog = React.createClass({
    mixins: [control.mixin],
    getInitialState: function() {
      return {message: null};
    },
    componentDidMount: function () {
      var self = this;

      this.control.on('feedback', function(e) {
        self.setState({message: e.data});
      });
    },
    componentDidUpdate: function (prevProps, prevState) {

      // Fading in
      $(this.refs.dialog.getDOMNode()).fadeIn();
    },
    render: function() {
      var msg = this.state.message;
      return !!msg &&
        <span ref="dialog"
              style={{display: 'none'}}
              className={'dialog ' + (msg.status === 'success' ? 'success' : 'error')}>{msg.text}
        </span>;
    }
  });

  /**
   * Bookmarklet
   *
   * The bookmarklet itself that will be generated and drag & dropped by
   * the user.
   */
  var Bookmarklet = React.createClass({
    componentDidUpdate: function (prevProps, prevState) {
      $(this.refs.container.getDOMNode()).fadeIn();
    },
    render: function() {
      var style = {
        textAlign: 'center',
        display: 'none'
      };

      return !!this.props.string && (
        <p ref="container" style={style}>
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
