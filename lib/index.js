import Fb2kCue from './cue';

module.exports = function transformBody(buf, options) {
    let cue = new Fb2kCue(buf, options);

    return cue.dest.buffer;
};
