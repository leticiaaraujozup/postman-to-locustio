var util = require('util');

module.exports = {

  buildLuaRequest: function(options) {
    var url = options.url,
        method = options.method,
        headers = options.headers,
        data = options.data,
        preRequest = options.preRequest,
        postRequest = options.postRequest,
        sleepTime = options.sleepTime,
        variable = options.variable,
        variables = [],
        tmpVariables,
        result = '';

    if (variable) {
      result += util.format("%s = ", variable);
    }

    tmpVariables = getVariables(url);
    if (tmpVariables) {
      variables = variables.concat(tmpVariables);
    }
    url = pathOnly(url);

    if (method === "GET") {
      result += util.format("self.client.get(\"%s\"", url);
    } else if (method === "POST") {
      result += util.format("self.client.post(\"%s\"", url);
    } else if (method === "PUT") {
      result += util.format("self.client.put(\"%s\"", url);
    } else if (method === "DELETE") {
      result += util.format("self.client.delete(\"%s\"", url);
    } else if (method === "PATCH") {
      result += util.format("self.client.patch(\"%s\"", url);
    } else {
      console.log("XXXX");
    }

    result += util.format(", headers=%s", JSON.stringify(headers));
    if (data) {
      result += util.format(", data=\"%s\".encode('utf-8')", data);
    }
    result += util.format(")\n");
    if (sleepTime) {
      result += util.format("time.sleep(%s)\n", sleepTime);
    }

    return {
      result: result,
      variables: variables
    };

  },

  escapeContent: function(input) {
    if (input) {

      //copied from loadimpact-chrome-extension

      // " --> \" (escape doublequote)
      input = input.replace(/"/g, '\\\"');

      //  This replace fixes content which contains a doublequote string
      //  \"  - (first replace) -> \\" - (second replace to work in Lua) -> \\\"
      input = input.replace(/\\\\"/g, '\\\\\\\"');
      input = input.replace(/[\r\n]/g, "");
    }
    return input;

  }



};

function getVariables(input) {


  if (input) {
    var matches = input.match(/{{(.*?)}}/g);
    if (matches) {
      return matches.map(function(item) {
        return item.replace(/{{/g,"").replace(/}}/g,"");
      });
    }
  }

}

function replaceCurlyBrackets(input) {

  return input.replace(/{{/g,"\"..").replace(/}}/g,"..\"");

}

function pathOnly(url) {
  return "/" + url.match(/\/\/[^\/]+\/([^\.]+)/)[1];
}
