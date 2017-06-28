'use strict';
const path = require('path');
const gutil = require('gulp-util');

const rgxp = {
    file        : /^.*?FILE "(.*(?!¥.cue).*)" .*$/g,
    cue_modified: /.*¥.cue.*/g
};
const args = argv.option([
    {
        name: 'fb2kcue_path',
        type: 'list,path'
    }
]).run();

class cueForFb2k {
    constructor(buf, options) {
        const {pwd} = options;
        this._org = {
            buffer : buf,
            content: buf.contents,
            files  : []
        };
        this.cwd = path.dirname(buf.path);
        this.pwd = pwd;

        this._cueCheck()
            ._cueConv();
    }

    _cueConv() {
        let {buffer, content} = this._org;
        let files = [];

        this._org.files.forEach((v) => {
            let destFile = gutil.replaceExtension(path.format({
                dir : this.cwd,
                base: v
            }), '.cue.' + path.extname(v));
            let destBasename = path.basename(destFile);

            files.push(destFile);
            buffer = Buffer.from(this._org.content.replace(rgxp.file, destBasename));
            content = buffer.contents;
            gutil.log(gutil.colors.bgMagentaBright('renamed:'), path.relative(this.pwd, destFile));
        });

        this.dest = {buffer, content, files};
        gutil.log(gutil.colors.bgMagentaBright('cue:'), path.relative(this.pwd, buf.path));
        return this;
    }

    _cueCheck() {
        const file_exists = rgxp.file.test(this._org.content);
        if (file_exists) {
            this._org.files = this._org.content.match(rgxp.file)
                .slice(1);
        }
        return this;
    }

}
module.exports = cueForFb2k;