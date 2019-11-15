/**
 * 工具函数
 */

import config from './config';

/**
 * @desc 生成三次贝塞尔曲线
 * @param {Number} x1 起点x坐标
 * @param {Number} y1 起点y坐标
 * @param {Number} x2 终点x坐标
 * @param {Number} y2 终点y坐标
 */
const generateBézierControlPoints3 = (x1, y1, x2, y2) => {
    let cx1 = x1 - ((x1 + x2) / 2 - x1) / 2;
    let cy1 = y1 + ((y1 + y2) / 2 - y1) / 3;
    let cx2 = x2 + ((x1 + x2) / 2 - x1) / 2;
    let cy2 = y2 - ((y1 + y2) / 2 - y1) / 3;
    return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
};

/**
 * @desc 生成二次贝塞尔曲线
 * @param {Number} x1 起点x坐标
 * @param {Number} y1 起点y坐标
 * @param {Number} x2 终点x坐标
 * @param {Number} y2 终点y坐标
 */
const generateBézierControlPoints2 = (x1, y1, x2, y2) => {
    let cx1 = x1;
    // let cy1 = y1 + 80;
    // note: 为了拖动连线初始化时连线显示正常，设置当x1=x2,y1=y1时
    let cy1 = ((y1 === y2) && (x1 === x2)) || (((y2 - y1) > config.nHeight / 4) && ((y2 - y1) < (80 * 2)) && Math.abs(x1 - x2) < (0.75 * config.nWidth)) ? y1 + ((y1 + y2) / 2 - y1) / 3 : y1 + 80;
    // let cy1 = y1 - y2 > nHeight && y1 - y2 < 80 * 2 && Math.abs(x1 - x2)  < 0.75 * nWidth ? y1 + ((y1 + y2) / 2 - y1) / 3 : y1 + 80;
    // let cy1 = Math.abs(y2 - y1) > 160 ? (y1 + y2) / 2 : y1 + 80;
    // let cy1 = Math.abs(y2 - y1) > 100 ? y1 + ((y1 + y2) / 2 - y1) / 3 * 2 : y1 + 100;
    return `M ${x1},${y1} Q ${cx1},${cy1} ${(x1 + x2) / 2},${(y1 + y2) / 2} T ${x2},${y2}`;
};

/**
 * @desc 获取连接点x坐标
 * @param {Number} nx 节点x坐标
 * @param {Number} index [输入/输出]连接点序号
 * @param {Number} total [输入/输出]连接点总数
 */
const getPointXAxis = (nx, index, total) => nx + index / (total + 1) * config.nWidth;

/**
 * @desc 获取连接点y坐标
 * @param {Number} ny
 * @param {Boolean} isSource
 * @param {Boolean} hasDetail 是否展开详情，展开后需要加上详情框高度
 */
const getPointYAxis = (ny, isSource, hasDetail) => {
    if (isSource) {
        return ny + config.nHeight + (hasDetail ? config.detailBoxHeight : 0);
    } else {
        return ny;
    }
};

/**
 * @desc 获取满足精度范围内的辅助线的坐标集合
 * @param {Array} nodes 组件节点列表
 * @param {String} id 组件id
 * @param {Number} x 节点左上角x坐标
 * @param {Number} y 节点左上角y坐标
 */
const getGuidelines = (nodes, id, x, y) => {
    let guidelines = [];
    let precision = config.precision;
    // let precision = Number.EPSILON * Math.pow(2, 48)
    let nWidth = config.nWidth;
    let nHeight = config.nHeight;
    nodes.forEach(el => {
        if (id !== el.id) {
            if (Math.abs(x - el.x) < precision || Math.abs(x - el.x - nWidth / 2) < precision || Math.abs(x - el.x - nWidth) < precision || Math.abs(x + nWidth - el.x) < precision || Math.abs(x + nWidth / 2 - el.x) < precision) { // 纵向边线对齐
                if (y > el.y) {
                    guidelines.push({
                        source: {
                            x: Math.abs(el.x - x - nWidth / 2) < precision ? x + nWidth / 2 : Math.abs(el.x - x - nWidth) < precision ? x + nWidth : x,
                            y: y + nHeight
                        },
                        target: {
                            x: Math.abs(x - el.x - nWidth / 2) < precision ? el.x + nWidth / 2 : Math.abs(x - el.x - nWidth) < precision ? el.x + nWidth : el.x,
                            y: el.y
                        }
                    });
                } else {
                    guidelines.push({
                        source: {
                            x: Math.abs(el.x - x - nWidth / 2) < precision ? x + nWidth / 2 : Math.abs(el.x - x - nWidth) < precision ? x + nWidth : x,
                            y
                        },
                        target: {
                            x: Math.abs(x - el.x - nWidth / 2) < precision ? el.x + nWidth / 2 : Math.abs(x - el.x - nWidth) < precision ? el.x + nWidth : el.x,
                            y: el.y + config.nHeight
                        }
                    });
                }
            }
            if (Math.abs(y - el.y) < precision || Math.abs(y - el.y - nHeight / 2) < precision || Math.abs(y - el.y - nHeight) < precision || Math.abs(el.y - y - nHeight / 2) < precision || Math.abs(el.y - y - nHeight) < precision) { // 横向边线对齐
                if (x > el.x) {
                    guidelines.push({
                        source: {
                            x: x + config.nWidth,
                            y: Math.abs(el.y - y - nHeight / 2) < precision ? y + nHeight / 2 : Math.abs(el.y - y - nHeight) < precision ? y + nHeight : y
                        },
                        target: {
                            x: el.x,
                            y: Math.abs(y - el.y - nHeight / 2) < precision ? el.y + nHeight / 2 : Math.abs(y - el.y - nHeight) < precision ? el.y + nHeight : el.y
                        }
                    });
                } else {
                    guidelines.push({
                        source: {
                            x,
                            y: Math.abs(el.y - y - nHeight / 2) < precision ? y + nHeight / 2 : Math.abs(el.y - y - nHeight) < precision ? y + nHeight : y
                        },
                        target: {
                            x: el.x + config.nWidth,
                            y: Math.abs(y - el.y - nHeight / 2) < precision ? el.y + nHeight / 2 : Math.abs(y - el.y - nHeight) < precision ? el.y + nHeight : el.y
                        }
                    });
                }
            }
        }
    });
    return guidelines;
};

/**
 * @desc 找出离所选节点 x坐标最近的节点 x坐标值，以及y坐标最近的节点 y坐标值
 * @param {Array} nodes 组件节点列表
 * @param {String} id 组件id
 * @param {Number} x 节点左上角x坐标
 * @param {Number} y 节点左上角y坐标
 */
const getNearestXandY = (nodes, id, x, y) => {
    let diffX = config.autoAlignment;
    let diffY = config.autoAlignment;
    let nWidth = config.nWidth;
    let nHeight = config.nHeight;
    let result = {};
    nodes.forEach(el => {
        if (id !== el.id) {
            if (Math.abs(x - el.x) < diffX) { // x值
                diffX = Math.abs(x - el.x);
                result.x = el.x;
            } else if (Math.abs(x - el.x - nWidth / 2) < diffX) {
                diffX = Math.abs(x - el.x - nWidth / 2);
                result.x = el.x + nWidth / 2;
            } else if (Math.abs(x - el.x - nWidth) < diffX) {
                diffX = Math.abs(x - el.x - nWidth);
                result.x = el.x + nWidth;
            } else if (Math.abs(x + nWidth - el.x) < diffX) {
                diffX = Math.abs(x + nWidth - el.x);
                result.x = el.x - nWidth;
            } else if (Math.abs(x + nWidth / 2 - el.x) < diffX) {
                diffX = Math.abs(x + nWidth / 2 - el.x);
                result.x = el.x - nWidth / 2;
            }
            if (Math.abs(y - el.y) < diffY) { // y值
                diffY = Math.abs(y - el.y);
                result.y = el.y;
            } else if (Math.abs(y - el.y - nHeight / 2) < diffY) {
                diffY = Math.abs(y - el.y - nHeight / 2);
                result.y = el.y + nHeight / 2;
            } else if (Math.abs(y - el.y - nHeight) < diffY) {
                diffY = Math.abs(y - el.y - nHeight);
                result.y = el.y + nHeight;
            } else if (Math.abs(el.y - y - nHeight / 2) < diffY) {
                diffY = Math.abs(el.y - y - nHeight / 2);
                result.y = el.y - nHeight / 2;
            } else if (Math.abs(el.y - y - nHeight) < diffY) {
                diffY = Math.abs(el.y - y - nHeight);
                result.y = el.y - nHeight;
            }
        }
    });
    return result;
};

/**
 * @desc 在给定范围内自动对齐组件，并返回对齐后的组件坐标以及辅助线坐标集合
 * @param {Array} nodes 组件节点列表
 * @param {String} id 组件id
 * @param {Number} x 节点左上角x坐标
 * @param {Number} y 节点左上角y坐标
 */
const getGuidelines2 = (nodes, id, x, y) => {
    let nWidth = config.nWidth;
    let nHeight = config.nHeight;
    let result = {
        guidelines: []
    };
    let nearest = getNearestXandY(nodes, id, x, y);
    result.x = nearest.x === undefined ? x : nearest.x;
    result.y = nearest.y === undefined ? y : nearest.y;
    if (nearest.x !== undefined || nearest.y !== undefined) {
        x = result.x;
        y = result.y;
        nodes.forEach(el => {
            if (id !== el.id) {
                if (nearest.x !== undefined && (x === el.x || x === el.x + nWidth / 2 || x === el.x + nWidth || x + nWidth === el.x || x + nWidth / 2 === el.x)) { // 纵向边线对齐
                    if (y > el.y) {
                        result.guidelines.push({
                            source: {
                                x: el.x === x + nWidth / 2 ? x + nWidth / 2 : el.x === x + nWidth ? x + nWidth : x,
                                y: y + nHeight
                            },
                            target: {
                                x: x === el.x + nWidth / 2 ? el.x + nWidth / 2 : x === el.x + nWidth ? el.x + nWidth : el.x,
                                y: el.y
                            }
                        });
                    } else {
                        result.guidelines.push({
                            source: {
                                x: el.x === x + nWidth / 2 ? x + nWidth / 2 : el.x === x + nWidth ? x + nWidth : x,
                                y
                            },
                            target: {
                                x: x === el.x + nWidth / 2 ? el.x + nWidth / 2 : x === el.x + nWidth ? el.x + nWidth : el.x,
                                y: el.y + nHeight
                            }
                        });
                    }
                }
                if (nearest.y !== undefined && (y === el.y || y === el.y + nHeight / 2 || y === el.y + nHeight || el.y === y + nHeight / 2 || el.y === y + nHeight)) { // 横向边线对齐
                    if (x > el.x) {
                        result.guidelines.push({
                            source: {
                                x: x + nWidth,
                                y: el.y === y + nHeight / 2 ? y + nHeight / 2 : el.y === y + nHeight ? y + nHeight : y
                            },
                            target: {
                                x: el.x,
                                y: y === el.y + nHeight / 2 ? el.y + nHeight / 2 : y === el.y + nHeight ? el.y + nHeight : el.y
                            }
                        });
                    } else {
                        result.guidelines.push({
                            source: {
                                x,
                                y: el.y === y + nHeight / 2 ? y + nHeight / 2 : el.y === y + nHeight ? y + nHeight : y
                            },
                            target: {
                                x: el.x + nWidth,
                                y: y === el.y + nHeight / 2 ? el.y + nHeight / 2 : y === el.y + nHeight ? el.y + nHeight : el.y
                            }
                        });
                    }
                }
            }
        });
    }
    return result;
};

export default {
    generateBézierControlPoints2,
    generateBézierControlPoints3,
    getPointXAxis,
    getPointYAxis,
    getGuidelines,
    getGuidelines2,
    getNearestXandY
};
