var utils = {
    clone : function(src, dst) {
        var defaultValue = (src instanceof Array) ? [] : {};
        var dst = dst || defaultValue;

        for (var i in src)
        {
            if (typeof src[i] === 'object')
            {
                dst[i] = (src[i].constructor === Array) ? [] : {};
                this.clone(src[i], dst[i]);
            } else {
                dst[i] = src[i];
            }
        }

        return dst;
    },

   dump : function(obj, indent, level) {
    level = (typeof level === 'undefined' && 4) || level;
    indent = indent || '';

    if (level == 0) {
        console.log(indent + '// reach max depth');
        return;
    }

    this.mDumpDepth = this.mDumpDepth || 0;
    this.mDumpDepth += 1;

    if (Array.isArray(obj)) {
        if (this.mDumpDepth == 1) {
            console.log(indent + '[');
            indent += '    ';
        }

        for (var key in obj) {
            var value = obj[key];
            if (Array.isArray(value)) {
                console.log(indent + "'" + key + "' : [");

                this.dump(value, indent + '    ', level - 1);

                console.log(indent + '],');
            } else if (typeof(value) == 'object') {
                console.log(indent +  "{");

                this.dump(value, indent + '    ', level - 1);

                console.log(indent + '},');
            } else if (typeof(value) == 'function') {
                console.log(indent + 'function(){}' + ",");
            } else if (typeof(value) == 'string') {
                console.log(indent + "'" + value + "',");
            } else if (typeof(value) == 'number') {
                console.log(indent + value + ",");
            } else if (typeof(value) == 'boolean') {
                console.log(indent + value + ",");
            }
        }

        if (this.mDumpDepth == 1) {
            indent = indent.substr(0, indent.length - 4);
            console.log(indent + ']');
        }
    } else if (typeof(obj) == 'object') {
        if (this.mDumpDepth == 1) {
            console.log(indent + '{');
            indent += '    ';
        }

        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            var value = obj[key];
            if (Array.isArray(value)) {
                console.log(indent + "'" + key + "' : [");

                this.dump(value, indent + '    ', level - 1);

                console.log(indent + '],');
            } else if (typeof(value) == 'object') {
                console.log(indent + "'" + key + "' : {");

                this.dump(value, indent + '    ', level - 1);

                console.log(indent + '},');
            } else if (typeof(value) == 'function') {
                console.log(indent + "'" + key + "' : " + 'function(){}' + ",");
            } else if (typeof(value) == 'string') {
                console.log(indent + "'" + key + "' : '" + value + "',");
            } else if (typeof(value) == 'number') {
                console.log(indent + "'" + key + "' : " + value + ",");
            } else if (typeof(value) == 'number') {
                console.log(indent + "'" + key + "' : " + value + ",");
            }
        }

        if (this.mDumpDepth == 1) {
            indent = indent.substr(0, indent.length - 4);
            console.log(indent + '}');
        }
    } else if (typeof(obj) == 'function') {
        console.log(indent + 'function(){}' + ",");
    } else if (typeof(obj) == 'string') {
        console.log(indent + "'" + obj + "'");
    } else if (typeof(obj) == 'number') {
        console.log(indent + obj);
    } else {
        console.log(indent + obj);
    }

    this.mDumpDepth -= 1;
},
}

module.exports = utils;