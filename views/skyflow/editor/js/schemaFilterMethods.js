import { dataTypeGroup } from './skyflowConfig';

/**
 * 默认过滤函数,直接返回输出
 * @param {*} schema 输入schema
 */
export function schemaFilterDefault(schema) {
    return (schema && _.cloneDeep(schema)) || [];
}

/**
 * 数据表连接的过滤函数,返回两个输入的交集
 * @param {*} s1 输入1
 * @param {*} s2 输入2
 */
export function schemaFilterJoin(s1, s2) {
    if (s1 && s2) {
        s1 = _.cloneDeep(s1);
        s2 = _.cloneDeep(s2);
        return _.intersectionWith(s1, s2, _.isEqual);
    } else {
        return [];
    }
}

/**
 * 只返回数据类为数字的字段
 * @param {*} s 输入schema
 */
export function schemaFilterOnlyNumber(s) {
    if (s) {
        s = _.cloneDeep(s);
        return s.filter(item => dataTypeGroup.NUMBER.includes(item.ctype));
    } else {
        return [];
    }
}

/**
 * 只返回数据类型为整形或字符串的字段
 * @param {*} s 输入schema
 */
export function schemaFilterStrInt(s) {
    if (s) {
        s = _.cloneDeep(s);
        return s.filter(item => dataTypeGroup.INT_AND_STR.includes(item.ctype));
    } else {
        return [];
    }
}
