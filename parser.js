// Generated by CoffeeScript 1.6.3
(function() {
  var Charactar, Inline, error, parse, parseBlock, parseNested, parseText, parseTree, wrap_text;

  Charactar = (function() {
    function Charactar(opts) {
      this.char = opts.char;
    }

    Charactar.prototype.isBlank = function() {
      return this.char === " ";
    };

    Charactar.prototype.isOpenParen = function() {
      return this.char === "(";
    };

    Charactar.prototype.isCloseParen = function() {
      return this.char === ")";
    };

    Charactar.prototype.isDollar = function() {
      return this.char === "$";
    };

    Charactar.prototype.isDoubleQuote = function() {
      return this.char === '"';
    };

    Charactar.prototype.isBackslash = function() {
      return this.char === "\\";
    };

    return Charactar;

  })();

  Inline = (function() {
    function Inline(opts) {
      var file, y;
      file = opts.file;
      y = opts.y;
      this.line = opts.line.split("").map(function(char, x) {
        return new Charactar({
          char: char,
          x: x,
          y: y,
          file: file
        });
      });
    }

    Inline.prototype.isEmpty = function() {
      if (this.line.length === 0) {
        return true;
      } else {
        return this.line.every(function(char) {
          return char.isBlank();
        });
      }
    };

    Inline.prototype.getIndent = function() {
      var char, n, _i, _len, _ref;
      n = 0;
      _ref = this.line;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        char = _ref[_i];
        if (char.isBlank()) {
          n += 1;
        } else {
          break;
        }
      }
      return Math.ceil(n / 2);
    };

    Inline.prototype.dedent = function() {
      var first;
      this.line.shift();
      first = this.line[0];
      if (first.isBlank()) {
        return this.line.shift();
      }
    };

    Inline.prototype.shift = function() {
      return this.line.shift();
    };

    Inline.prototype.line_end = function() {
      return this.line.length === 0;
    };

    return Inline;

  })();

  wrap_text = function(text, filename) {
    var file;
    file = {
      text: text,
      filename: filename
    };
    return text.split("\n").map(function(line, y) {
      return new Inline({
        line: line,
        y: y,
        file: file
      });
    });
  };

  parseNested = function(curr_lines) {
    curr_lines.map(function(line) {
      return line.dedent();
    });
    return parseBlock(curr_lines);
  };

  parseBlock = function(curr_lines) {
    var buffer, collection, digest_buffer;
    collection = [];
    buffer = [];
    digest_buffer = function() {
      var line;
      if (buffer.length > 0) {
        line = buffer[0];
        if ((collection.length === 0) && (line.getIndent() > 0)) {
          collection.push(parseNested(buffer));
        } else {
          collection.push(parseTree(buffer));
        }
        return buffer = [];
      }
    };
    curr_lines.map(function(line) {
      if (line.isEmpty()) {
        return;
      }
      if (line.getIndent() === 0) {
        digest_buffer();
      }
      return buffer.push(line);
    });
    digest_buffer();
    return collection;
  };

  parseTree = function(tree) {
    var args, follows, func;
    follows = tree.slice(1).map(function(line) {
      line.dedent();
      return line;
    });
    func = tree[0];
    console.log(JSON.stringify(tokenize(func), null, 2));
    if (follows.length > 0) {
      args = parseBlock(follows);
      return {
        func: func,
        args: args
      };
    } else {
      return {
        func: func
      };
    }
  };

  window.tokenize = function(line) {
    var add_buffer, buffer, char, digest_buffer, escape_mode, quote_mode, tokens;
    tokens = [];
    buffer = void 0;
    quote_mode = false;
    escape_mode = false;
    digest_buffer = function(as_string) {
      var type;
      type = as_string != null ? "string" : "text";
      if (buffer != null) {
        tokens.push({
          type: type,
          buffer: buffer
        });
        return buffer = void 0;
      }
    };
    add_buffer = function(the_char) {
      if (buffer != null) {
        return buffer.char += the_char.char;
      } else {
        return buffer = char;
      }
    };
    while (!line.isEmpty()) {
      char = line.shift();
      if (quote_mode) {
        console.log("in quote");
        if (escape_mode) {
          add_buffer(char);
          escape_mode = false;
        } else {
          if (char.isDoubleQuote()) {
            digest_buffer("string");
            quote_mode = false;
          } else if (char.isBackslash()) {
            escape_mode = true;
          } else {
            add_buffer(char);
          }
        }
      } else {
        if (char.isBlank()) {
          digest_buffer();
        } else if (char.isOpenParen()) {
          digest_buffer();
          tokens.push({
            type: "openParen"
          });
        } else if (char.isCloseParen()) {
          digest_buffer();
          tokens.push({
            type: "closeParen"
          });
        } else if (char.isDoubleQuote()) {
          digest_buffer();
          quote_mode = true;
        } else {
          add_buffer(char);
        }
      }
    }
    digest_buffer();
    return tokens;
  };

  parseText = function(line, args) {};

  parse = function(text, filename) {
    var whole_list;
    whole_list = wrap_text(text, filename);
    return parseBlock(whole_list);
  };

  error = function() {};

  if (typeof define !== "undefined" && define !== null) {
    define({
      parse: parse,
      error: error
    });
  } else if (typeof exports !== "undefined" && exports !== null) {
    exports.parse = parse;
    exports.error = error;
  } else if (typeof window !== "undefined" && window !== null) {
    window.parse = parse;
    window.error = error;
  }

}).call(this);

/*
//@ sourceMappingURL=parser.map
*/
