const Fb2kCue = require('./cue');

module.exports = function transformBody(buf, options) {
    let cue = new Fb2kCue(buf, options);

    return cue.dest.buffer;
};
