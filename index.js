/**
 *
 */
'use strict';

const gutil = require('gulp-util');
const through = require('through2');

const transformBody=require('./lib');

const PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-fb2kcue';


module.exports = function (options) {
    function transform(file, encoding, callback) {
        try {
            if (file.isNull()) {
                return callback(null, file);
            }

            if (file.isStream()) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            }

            if (file.isBuffer()) {
                return callback(null, transformBody(file,options));
            }

            this.push(file);
            callback();
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, err, {fileName: file.path}));
        }
    };

    return through.obj(transform);
}
