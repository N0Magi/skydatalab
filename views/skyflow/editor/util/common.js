export const timeFormat = function(millisecond, str = '') {
    // 根据毫秒数转换成对应的时间格式：-d-h-m-s-ms
    if (!millisecond) return str;
    if (millisecond > 86400000) {
    // 1000 * 60 * 60 * 24
        return timeFormat(
            millisecond % 86400000,
            str + Math.floor(millisecond / 86400000) + 'd'
        );
    } else if (millisecond > 3600000) {
    // 1000 * 60 * 60
        return timeFormat(
            millisecond % 3600000,
            str + Math.floor(millisecond / 3600000) + 'h'
        );
    } else if (millisecond > 60000) {
    // 1000 * 60
        return timeFormat(
            millisecond % 60000,
            str + Math.floor(millisecond / 60000) + 'm'
        );
    } else if (millisecond > 1000) {
        return timeFormat(
            millisecond % 1000,
            str + Math.floor(millisecond / 1000) + 's'
        );
    } else {
        return str + millisecond + 'ms';
    }
};