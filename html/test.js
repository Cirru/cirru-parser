// Generated by CoffeeScript 1.6.3
(function() {
  var req, source_file;

  source_file = "../cirru/indent.cr";

  req = new XMLHttpRequest;

  req.open("get", source_file);

  req.onload = function() {
    var res;
    res = parse(req.response, source_file);
    console.log(JSON.stringify(res, null, 2));
    return console.log(res);
  };

  req.send();

}).call(this);

/*
//@ sourceMappingURL=test.map
*/
