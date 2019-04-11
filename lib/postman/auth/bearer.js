var util = require('util');

module.exports = {
  enabled: true,
  header: function (request) {
    var params = request.auth['bearer'];
    if (params) {
      return util.format("Bearer %s", params.members[0].value)
    }
  }

};
