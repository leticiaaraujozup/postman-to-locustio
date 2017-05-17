#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs'),
    stripJSONComments = require('strip-json-comments');

// describe the options and usage instruction for the `convert` command
program
    .version(require('../package.json').version)
    .usage('<filePath> [options]')
    .description('Convert a Postman collection to Load Impact Lua user scenario')
    .option('-j --input-version <version>', 'Input version. Options `2.0.0` or `1.0.0`. Default `2.0.0`.', /^(2.0.0|1.0.0)$/i, '2.0.0')
    .option('-o --output <path>', 'Target file path where the converted collection will be written. Default `console`')
    .action(function (fileName, options) {

      var input;
      try {
        input = loadJSON(fileName);
      } catch (e) {
        console.error('unable to load the input file!', e);
        return;
      }

      var converter = require('../lib/converters/postman-' + options.inputVersion);
      if (!converter) {
        console.error('unable to load converter ' + options.inputVersion);
        return;
      }

      converter.convert(input, function(error, result) {
        if (error) {
          console.error(error);
          return;
        }

        if (options.output) {
          fs.writeFile(options.output, result, function(error) {
            if (error) {
              console.error('Count not create output '+options.output);
              console.error(error);
            }
          });
        } else {
          console.log(result);
        }
      });


    });


program.parse(process.argv);

function loadJSON(path) {
  var data = fs.readFileSync(path);
  return JSON.parse(stripJSONComments(data.toString()));
};
