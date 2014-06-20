;(function(undefined) {


  /**
   * artoo instructions
   * ===================
   *
   * This utility is meant to record user console inputs in order to be able
   * to save them for later use.
   */
  var _root = this,
      _call = Function.prototype.call,
      _instructions = [],
      blackList = [
        'saveInstructions(',
        '.instructions'
      ];

  // We override function calling to sniff user input
  function overrideFunctionCall() {
    Function.prototype.call = function() {
      if (arguments.length > 1 &&
          this.name === 'evaluate' &&
          arguments[0].constructor.name === 'InjectedScriptHost') {

        var input = arguments[1].split('\n').slice(1, -1).join('\n'),
            lastIndex = _instructions.length - 1;

        if (input !== 'this' &&
            !artoo.helpers.some(blackList, function(e) {
              return ~input.indexOf(e);
            }) &&
            input !== 'artoo') {
          if (~input.indexOf(_instructions[lastIndex]))
            _instructions[lastIndex] = input;
          else
            _instructions.push(input);
        }
      }

      return _call.apply(this, arguments);
    };
  }

  function restoreOriginalFunctionCall() {
    Function.prototype.call = _call;
  }

  // artoo's methods
  artoo.instructions = function() {
    return artoo.instructions.get();
  };

  artoo.instructions.get = function() {
    if (!artoo.browser.chrome)
      artoo.log.warning('You are not in chrome. artoo is therefore unable ' +
                        'to record console\'s instructions.');

    // Filtering the array
    _instructions = _instructions.filter(function(e, i) {
      return (e !== _instructions[i - 1]);
    });

    return _instructions;
  };

  artoo.instructions.getScript = function() {
    return '// ' + window.location + '\n' +
           '// ' + new Date() + '\n' +
           artoo.instructions.get().join('\n\n') + '\n';
  };

  artoo.instructions.startRecording = function() {
    if (!artoo.browser.chrome)
      return;
    overrideFunctionCall();
  };

  artoo.instructions.stopRecording = function() {
    if (!artoo.browser.chrome)
      return;
    restoreOriginalFunctionCall();
  };
}).call(this);
