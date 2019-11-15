/*
 * 参数检查函数模块(文档参考 nodeitemConfig.js 头部注释)
 * @Author: jiasong.shao
 * @Date: 2018-03-09 11:22:32
 * @Last Modified by: yangsheng
 * @Last Modified time: 2019-06-11 11:47:56
 */

import {
    dataTypeGroup
} from './skyflowConfig';
import {
    validateNewColumnName
} from '@/utils/validate';
/**
 * 检查规则: 元件输入1的数据必须全部为float或int
 * @param {any} s1 输入1的schema
 */
export function input1stNumber(s1) {
    return {
        result: s1.every(item => dataTypeGroup.NUMBER.includes(item.ctype))
    };
}

/**
 * 检查规则: 若两个Schema不完全一致，则校验不通过
 * @param {*} s1 输入1
 * @param {*} s2 输入2
 */
export function inputSame(s1, s2) {
    return {
        result: _.isEqual(s1, s2)
    };
}

/**
 * 检查规则: 输入的新字段名是以字母开头,由字母数字组成的字符串
 * @param {*} str 待验证参数
 * @param {*} isRequired 是否必填
 * @returns {boolean} true 通过 false 没通过
 */
export function noSpecialChart(target, isRequired, name, label) {
    // 复合规则的或者空字符串通过验证
    let ret = validateNewColumnName(target) || target === '';
    // 如果是非空的,则空字符串不能通过验证
    if (isRequired) {
        ret = ret && target.trim() !== '';
    }
    return {
        result: ret,
        message: `${label}:${target}&nbsp;应该是以字母开头,由字母数字组成的字符串`
    };
}
/**
 * 默认检查函数
 * @param {*} target 待验证参数
 * @param {*} isRequired 是否必填
 */
export function defalutParamValidate(target, isRequired) {
    if (typeof target === 'number') {
        target = target + '';
    } else if (typeof target === 'string') {
        target = target.trim();
    } else if (target instanceof Date) {
        target = target.toLocaleDateString();
    } else if (typeof target === 'boolean') {
        target = target.toString();
    }
    return {
        result: isRequired ? !_.isEmpty(target) : true
    };
}

/**
 * 与输入的字段不能重复
 */
export function notSameWithInput(target, isRequired, name, label) {
    // 检查字段与输入的schema是否有重复
    let parents = this.getSelfParent();
    // 取出所有的输入schema,过滤掉空的
    let schemas = [
        ...parents.map(
            ele => (ele ? ele.getCurrentSchemaOut() : null) // eslint-disable-line
        )
    ].filter(item => item && !_.isEmpty(item));
    // 如果没有输入,则放弃检查,返回true
    if (schemas.length) {
        // 如果在输入schema中找到了同名元素,则返回false
        return {
            result: !schemas.some(
                item => !!item.find(ele => ele.cname === target)
            ),
            message: `${label}&nbsp;${target}与输入的schema字段重复`
        };
    } else {
        return {
            result: true
        };
    }
}

/**
 * 根据情况判断是否必须
 */
export function requiredByOptions(
    target,
    isRequired,
    name,
    label,
    param,
    paramsConf
) {
    let paramConf = paramsConf.find(item => item.name === name);
    let refValue = param[paramConf.showAttr];
    let requied = paramConf.showVal.includes(refValue);
    if (requied) {
        return {
            result: defalutParamValidate(target, true).result,
            message: `${label}&nbsp;缺失`
        };
    } else {
        return {
            result: true
        };
    }
}
/**
 * 检查"数据类型转换"组件,clumn只能处理一次
 */
export function singleOption(target, isRequired, name, label) {
    // 先判断是否必填
    let isEmpty = defalutParamValidate(target, true).result;
    // 判断是否重复转换
    let params = this.node.params.mixedParamBean;
    let __ret = params
        .filter(item => item[name] === target)
        .map(item => item[name]);

    if (isRequired && !isEmpty) {
        return {
            result: isEmpty,
            message: `${label}&nbsp;缺失`
        };
    } else {
        return {
            result: __ret.length === 1,
            message: `字段 ${__ret.join(',')} 被重复转换.`
        };
    }
}
