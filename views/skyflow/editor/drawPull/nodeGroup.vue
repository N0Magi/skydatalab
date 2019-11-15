<template>
    <g
        class="node-area"
        :id="id"
    />
</template>

<script>
import * as d3 from 'd3';

import config from '../js/config';
import {
    iconsMap,
    componentsIcon,
    componentType,
    nodeState,
    nodeStateIconConf,
    nodeResultStateIconConf
} from '../js/skyflowConfig';
import { TASK_KIND } from '../util/const';
import { dateFormatter } from '@sdx/utils/src/helper/transform';

const TYPES = {
    MAIN: 'main',
    THUMB: 'thumb'
};

export default {
    name: 'NodeGroup',
    props: {
        id: {
            type: String,
            required: true
        },
        nodes: {
            type: Array,
            required: true
        },
        type: {
            type: String,
            default: TYPES.MAIN
        },
        isEditable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        nodeList() {
            let nodesCopy = _.cloneDeep(this.nodes);
            const activeNode = nodesCopy.find(item => item.active);
            if (activeNode) {
                let i = nodesCopy.findIndex(item => item.active);
                nodesCopy.splice(i, 1);
                nodesCopy.push(activeNode);
            }
            return nodesCopy;
        }
    },
    methods: {
        getIconByName(name) {
            let component = componentsIcon.find(el => el.name === name);
            return component && component.icon
                ? component.icon
                : iconsMap.defaultCompIcon;
        },
        getCompTypeLabel(name) {
            const comp = componentType.find(el => el.name === name);
            return (comp && comp.label) || '';
        },
        init() {
            // 初始化时，清空之前绘制的图形
            d3.select(`#${this.id}`)
                .selectAll('.node')
                .remove();
            const nodeGroup = d3
                .select(`#${this.id}`)
                .selectAll('g.node')
                .data(this.nodeList)
                .enter()
                .append('g')
                .attr('class', () => (this.isEditable ? 'node' : 'node prohibit-drag'))
                .attr('transform', node => `translate(${node.x}, ${node.y})`)
                .attr('id', node => {
                    if (this.type === TYPES.MAIN) {
                        return node.id;
                    } else {
                        return '';
                    }
                });
            this.initPoint(nodeGroup);
            this.initDetailInfo(nodeGroup);
            this.initNode(nodeGroup);
            this.initIcon(nodeGroup);
            this.initNodeText(nodeGroup);
            this.initStateIcon(nodeGroup);
            this.initDetailButton(nodeGroup);
            this.initRunning(nodeGroup);
        },
        initNode(nodeGroup) {
            // 节点
            // 四周阴影
            nodeGroup
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', config.nWidth)
                .attr('height', config.nHeight)
                .attr('filter', node =>
                    node.showDetail ? '' : 'url(#node-shadow-blur)'
                )
                .attr('fill', 'rgba(63,89,115,0.4)');
            nodeGroup
                .append('rect')
                .attr('class', 'node-rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', config.nWidth)
                .attr('height', config.nHeight)
            // 未选中: '#459CDF' 未运行选中/成功选中: '#0C3AFF'  失败选中：'#AE0126'
                .attr('stroke', node =>
                    [nodeState.FAILED, nodeState.STOPED, nodeState.FORCESTOPED].includes(
                        node.state
                    )
                        ? node.active
                            ? '#AE0126'
                            : '#FB4F4F'
                        : node.active
                            ? '#0C3AFF'
                            : '#459CDF'
                )
                .attr('stroke-width', node =>
                    node.state === nodeState.RUNNING ? 0 : 2
                )
            // 失败/终止: '#FB4F4F' 成功: '#459CDF' 未运行: '#F7FAFC'
                .attr('fill', node =>
                    [nodeState.FAILED, nodeState.STOPED, nodeState.FORCESTOPED].includes(
                        node.state
                    )
                        ? '#FB4F4F'
                        : nodeState.SUCCESS === node.state
                            ? '#459CDF'
                            : '#F7FAFC'
                );
        },
        initNodeText(nodeGroup) {
            // 节点文字
            nodeGroup
                .append('foreignObject')
                .attr('x', 30)
                .attr('width', 130)
                .attr('height', 32)
                .append('xhtml:div')
                .attr('class', 'node-text')
                .attr('title', node => node.label)
                .style('font-size', '14px')
                .style('color', node =>
                    [
                        nodeState.FAILED,
                        nodeState.STOPED,
                        nodeState.FORCESTOPED,
                        nodeState.SUCCESS
                    ].includes(node.state)
                        ? '#F1FEFE'
                        : node.active
                            ? '#0C3AFF'
                            : '#459CDF'
                )
                .text(node => node.label);
        },
        initPoint(nodeGroup) {
            // 连接点
            const _this = this;
            nodeGroup.each(function(node) {
                d3.select(this)
                    .selectAll('circle.node-point')
                    .data(node.points)
                    .enter()
                    .append('circle')
                    .attr('class', point => {
                        let cls = '';
                        _this.isEditable
                            ? (cls += 'node-point')
                            : (cls += 'prohibit-operation');
                        return point.isSource
                            ? cls + ' source-point'
                            : cls + ' target-point';
                    })
                    .attr('id', point => {
                        if (_this.type === TYPES.MAIN) {
                            return point.id;
                        } else {
                            return '';
                        }
                    })
                    .attr(
                        'cx',
                        point => (point.index / (point.total + 1)) * config.nWidth
                    )
                    .attr('cy', point =>
                        point.isSource
                            ? node.showDetail
                                ? config.nHeight + config.detailBoxHeight + 1
                                : config.nHeight + 1
                            : -1
                    )
                    .attr('stroke', '#25405B')
                    .attr('stroke-width', 1)
                    .attr('r', 8)
                    .attr('fill', 'white');
            });
        },
        initIcon(nodeGroup) {
            // 节点图标
            nodeGroup
                .append('use')
                .attr('x', 10)
                .attr('y', 9)
            // 未运行 未选中: 'node-formal' 选中: 'node-active' 成功/失败: 'node-finish'
                .attr('class', node =>
                    [
                        nodeState.FAILED,
                        nodeState.STOPED,
                        nodeState.FORCESTOPED,
                        nodeState.SUCCESS
                    ].includes(node.state)
                        ? 'icon node-finish'
                        : node.active
                            ? 'icon node-active'
                            : 'icon node-formal'
                )
                .attr('width', 14)
                .attr('height', 14)
                .attr('xlink:href', node => `#${this.getIconByName(node.name)}`);
        },
        initStateIcon(nodeGroup) {
            // 节点提示图标
            nodeGroup
                .append('use')
                .attr('x', config.nWidth - 42)
                .attr('y', 9)
                .attr('class', node =>
                    node.state === nodeState.NOTREADY ? 'tip-btn' : 'tip-btn icon'
                )
            // .attr('class', node => node.state === nodeState.NOTREADY ? 'tip-btn' : 'icon tip-btn')
                .attr('width', 14)
                .attr('height', 14)
                .attr('xlink:href', node => {
                    if (
                        [
                            nodeState.SUCCESS,
                            nodeState.FAILED,
                            nodeState.NOTREADY,
                            nodeState.STOPED,
                            nodeState.FORCESTOPED
                        ].includes(node.state)
                    ) {
                        return `#${nodeResultStateIconConf[node.state]}`;
                    }
                    return false;
                });

            // 添加一个矩形框的目的是为了撑住这个按钮
            nodeGroup
                .append('rect')
                .attr('class', 'tip-btn-rect')
                .attr('x', config.nWidth - 43)
                .attr('y', 8)
                .attr('width', 16)
                .attr('height', 16)
                .attr('fill', 'rgba(64, 155, 226, 0)')
                .style('display', node => {
                    if (
                        ![
                            nodeState.SUCCESS,
                            nodeState.FAILED,
                            nodeState.NOTREADY,
                            nodeState.STOPED,
                            nodeState.FORCESTOPED
                        ].includes(node.state)
                    ) {
                        return 'none';
                    }
                    return 'inherit';
                });
        },
        initDetailButton(nodeGroup) {
            // 节点详情按钮
            nodeGroup
                .append('use')
            // 未运行 未选中: 'node-formal' 选中: 'node-active' 成功/失败: 'node-finish'
                .attr('class', node =>
                    [
                        nodeState.FAILED,
                        nodeState.STOPED,
                        nodeState.FORCESTOPED,
                        nodeState.SUCCESS
                    ].includes(node.state)
                        ? 'icon node-finish'
                        : node.active
                            ? 'icon node-active'
                            : 'icon node-formal'
                )
                .attr('x', config.nWidth - 25)
                .attr('y', 6)
                .attr('width', 20)
                .attr('height', 20)
                .attr('xlink:href', node => {
                    if (node.showDetail) {
                        return '#' + iconsMap.closeDetail; // -
                    } else {
                        return '#' + iconsMap.openDetail; // +
                    }
                });
            // 添加一个矩形框的目的是为了撑住这个按钮
            nodeGroup
                .append('rect')
                .attr('class', 'detail-btn')
                .attr('x', config.nWidth - 23)
                .attr('y', 8)
                .attr('width', 16)
                .attr('height', 16)
                .attr('fill', 'rgba(64, 155, 226, 0)');
        },
        initDetailInfo(nodeGroup) {
            const _this = this;
            // 节点运行信息
            nodeGroup.each(function(node) {
                if (node.showDetail) {
                    const detailGroup = d3
                        .select(this)
                        .append('g')
                        .attr('class', 'node-detail');
                    // 外框阴影
                    detailGroup
                        .append('rect')
                        .attr('width', config.nWidth)
                        .attr('height', config.detailBoxHeight + config.nHeight)
                        .attr('filter', 'url(#node-shadow-blur)')
                        .attr('fill', 'rgba(63,89,115,0.4)');
                    // 外框
                    detailGroup
                        .append('rect')
                        .attr('width', config.nWidth)
                        .attr('height', config.detailBoxHeight + config.nHeight)
                        .attr(
                            'stroke',
                            [
                                nodeState.FAILED,
                                nodeState.STOPED,
                                nodeState.FORCESTOPED
                            ].includes(node.state)
                                ? node.active
                                    ? '#AE0126'
                                    : '#FB4F4F'
                                : node.active
                                    ? '#0C3AFF'
                                    : '#459CDF'
                        )
                        .attr('stroke-width', node.state === nodeState.RUNNING ? 0 : 2)
                        .attr('fill', 'white');

                    let tableTemplte = `<tr>
                        <td class='detail-item-label'>组件类型：</td>
                        <td class='detail-item-value'>${(node.type &&
                          _this.getCompTypeLabel(node.type)) ||
                          ''}</td>
                    </tr><tr>
                        <td class='detail-item-label'>组件名称：</td>
                        <td class='detail-item-value detail-item--comp-name'>${node.label ||
                          ''}</td>
                    </tr><tr>
                        <td class='detail-item-label'>运行框架：</td>
                        <td class='detail-item-value'>${(node.taskKind !==
                          null &&
                          node.taskKind !== undefined &&
                          TASK_KIND[node.taskKind]) ||
                          ''}</td>
                    </tr><tr>
                        <td></td>
                        <td></td>
                    </tr><tr>
                        <td class='detail-item-label'>开始时间：</td>
                        <td class='detail-item-value'>${(node.executeDetails &&
                          node.executeDetails.startTime && dateFormatter(node.executeDetails.startTime)) ||
                          '--:--:--'}</td>
                    </tr><tr>
                        <td class='detail-item-label'>结束时间：</td>
                        <td class='detail-item-value'>${(node.executeDetails &&
                          node.executeDetails.stopTime && dateFormatter(node.executeDetails.stopTime)) ||
                          '--:--:--'}</td>
                    </tr><tr>
                        <td class='detail-item-label'>运行时长：</td>
                        <td class='detail-item-value'>${(node.executeDetails &&
                          node.executeDetails.runningTime) ||
                          '--'}</td>
                    </tr><tr>
                        <td class='detail-item-label'>运行状态：</td>
                        <td class='detail-item-value'><svg width='14' height='14'><use width='14' height='14' xlink:href='#${
    nodeStateIconConf[node.state]
}'></svg></td>
                    </tr>`;

                    detailGroup
                        .append('foreignObject')
                        .attr('y', config.nHeight)
                        .attr('width', config.nWidth)
                        .attr('height', config.detailBoxHeight)
                        .append('xhtml:table')
                        .style('width', config.nWidth + 'px')
                        .html(tableTemplte);
                }
            });
        },
        initRunning(nodeGroup) {
            nodeGroup.each(function(node) {
                if (node.state === nodeState.RUNNING) {
                    d3.select(this)
                        .append('rect')
                        .attr('class', 'node-running')
                        .attr('width', config.nWidth)
                        .attr(
                            'height',
                            () =>
                                config.nHeight + (node.showDetail ? config.detailBoxHeight : 0)
                        )
                        .attr('stroke', 'url(#node-running)')
                        .attr('stroke-width', 2)
                        .attr('stroke-dasharray', '5,5')
                        .attr('fill', 'none');
                }
            });
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        nodes() {
            this.init();
        }
    }
};
</script>

<style lang='scss'>
.node-area {
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: rgba(232, 239, 239, 1);
    overflow: hidden;
  }
  .node-finish {
    fill: #f1fefe;
  }
  .node-active {
    fill: #0c3aff;
  }
  .node-formal {
    fill: #459cdf;
  }
  .tip-btn {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    overflow: hidden;
  }
  .tip-btn-rect {
    cursor: default;
    outline: none;
  }
  .node {
    cursor: move;
    .node-text {
      height: 32px;
      font-size: 14px;
      font-family: siyuan-bd;
      font-weight: bold !important;
      line-height: 32px;
      // 超过限制宽度,显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .source-point {
      cursor: crosshair;
    }
    .target-point {
      cursor: default;
    }
    .node-point:hover {
      fill: #5eb3c8;
      stroke: #1168af;
      r: 10;
    }
    .prohibit-operation {
      cursor: default;
      &:hover {
        fill: white;
        stroke: #25405b;
      }
    }
    .node-detail {
      table {
        padding: 10px;
        tr {
          height: 10px;
          color: #2d455d;
          font-size: 12px;
          font-family: siyuan-lt;
          .detail-item-label {
            width: 65px;
            font-weight: bold !important;
          }
          .detail-item-value {
            max-height: 15px;
            font-weight: 400;
            i {
              font-size: 12px;
            }
            // 超过限制宽度,显示省略号
            overflow: hidden;
            word-break: break-all; // 允许在单词中换行
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .detail-item--comp-name {
            max-height: 28px;
            /* 名称超过两行显示... */
            -webkit-line-clamp: 2;
          }
        }
      }
    }
    .detail-btn:hover {
      cursor: pointer;
    }
    .node-running {
      stroke-dashoffset: 200;
      animation: dash-box 5s linear infinite;
      -webkit-animation: dash-box 5s linear infinite;
      @keyframes dash-box {
        to {
          stroke-dashoffset: 0;
        }
      }
    }
  }

  .prohibit-drag {
    cursor: no-drop;
  }
}
</style>
