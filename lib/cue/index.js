'use strict';
const path = require('path');
const fs = require('fs');
const gutil = require('gulp-util');

const rgxp = {
    file        : /(?!.*\.cue)(?:FILE ")(.*)(?:" .*)/g,
    file2       : /.*"(.*)".*/g,
    cue_modified: /¥.cue/g
};

class cueForFb2k {
    constructor(buf, options) {
        const {base} = options;
        this.file =buf
        this._org = {
            content: String(buf.contents),
            files  : []
        };

        this.cwd = path.dirname(buf.path);
        this.base = base;

        this._cueCheck()
            ._cueConv();
    }

    _cueCheck() {
        const fileExists = rgxp.file.test(this._org.content);

        if (fileExists) {
            this._org.files = this._org.content.match(rgxp.file)
                .map((v) => {
                    return v.replace(rgxp.file2, '$1');
                })
            ;
        }
        return this;
    }

    _cueConv() {
        let {content} = this._org;
        let files = [];

        this._org.files.forEach((v) => {

            let destBasename = gutil.replaceExtension(v, '.cue' + path.extname(v));
            files.push(destBasename);
            fs.rename(path.join(this.cwd,v),path.join(this.cwd,destBasename),(err) => {
                const msg = (err) ?'error:':'renamed:';
                gutil.log(gutil.colors.green(msg), destBasename);
            })

            content = content.replace(v,destBasename);

        });

        this.file.contents = Buffer.from(content);
        this.dest = {content, files};
//        gutil.log(gutil.colors.green('debug:'), this.file);
        return this;
    }


}
module.exports = cueForFb2k;