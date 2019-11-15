<template>
    <div
        v-droppable="dropableConfig"
        class="graph-flow"
    >
        <svg id="drawPull">
            <defs>
                <node-running id="node-running" />
                <node-shadow id="node-shadow" />
                <arrow-marker id="arrow-marker" />
                <arrow-marker
                    id="arrow-marker-weaken"
                    color="#BEC8D2"
                />
                <grid-cell id="grid-cell" />
                <shadow-blur id="node-shadow-blur" />
            </defs>
            <g id="graphArea">
                <grid
                    :gridInfo="gridInfo"
                    fill="url(#grid-cell)"
                />
                <link-group
                    id="linkGroup"
                    :links="links"
                    marker-mid="url(#arrow-marker)"
                />
                <node-group
                    id="nodeGroup"
                    :nodes="nodes"
                    :isEditable="isEditable"
                />
                <path id="instruction-line" />
            </g>
        </svg>
        <tooltips
            v-show="tipMessage.length"
            :tip-position="tipPosition"
            :tip-message="tipMessage"
        />
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as defs from './defs';
import grid from './grid';
import nodeGroup from './nodeGroup';
import linkGroup from './linkGroup';
import tooltips from './tooltips';

import config from '../js/config';
import utils from '../js/utils';
import UUID from '../js/UUID';
import { nodeState } from '../js/skyflowConfig';

const flowGlobal = {
    zoom: null,
    sourcePoint: null,
    targetPoint: null,
    dragLine: null,
    updateNode: false,
    updateLink: false,
    defaultGridWidth: 3000,
    defaultGridHeight: 3000,
    pointsHasHighLight: false
};

export default {
    name: 'DrawPull',
    components: {
        ...defs,
        grid,
        nodeGroup,
        linkGroup,
        tooltips
    },
    props: {
        nodes: {
            type: Array,
            default: () => []
        },
        links: {
            type: Array,
            default: () => []
        },
        isEditable: {
            // 控制是否可编辑
            type: Boolean,
            default: true
        },
        zoom: {
            type: Number,
            default: 100
        },
        contextMenuVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeNode: null,
            contextMenuNodeId: '',
            svgWidth: 0,
            svgHeight: 0,
            translate: {
                x: 0,
                y: 0
            },
            tipPosition: {
                x: 0,
                y: 0
            },
            tipMessage: [],
            isGrabbing: false // 控制拖动画布时鼠标样式
        };
    },
    computed: {
        dropableConfig() {
            return {
                handler: this.dropHandler
            };
        },
        nodeMap() {
            const nodeMap = {};
            this.nodes.forEach(node => {
                nodeMap[node.id] = node;
            });
            return nodeMap;
        },
        scale() {
            return this.zoom / 100;
        },
        gridWidth() {
            return Math.max(this.svgWidth, flowGlobal.defaultGridWidth);
        },
        gridHeight() {
            return Math.max(this.svgHeight, flowGlobal.defaultGridHeight);
        },
        gridInfo() {
            let { x, y } = this.translate;
            let s = this.scale;
            let gw = this.gridWidth;
            let gh = this.gridHeight;
            let gcw = config.cellWidth;
            let gch = config.cellHeight;
            return {
                x: (-Math.ceil(x / gcw) * gcw) / s,
                y: (-Math.ceil(y / gch) * gch) / s,
                width: Math.max(gw / s, gw),
                height: Math.max(gh / s, gh)
            };
        }
    },
    methods: {
    /**
     * @description 添加流程节点(拼装一个节点所需的所有参数)
     * @param data 节点数据
     * @param ev 原生事件对象
     */
        addNode(data, ev) {
            // 通过 acceptToken 判断是否是从侧边拖入的
            if (
                data &&
        data.acceptToken &&
        data.acceptToken === 'sjs-draggable-item'
            ) {
                // 获取画布拖动缩放，对组件的位置进行换算
                let x =
          ((ev.offsetX || ev.layerX) - data._offsetX - this.translate.x) /
          this.scale;
                let y =
          ((ev.offsetY || ev.layerY) - data._offsetY - this.translate.y) /
          this.scale;
                let id = UUID.getUUID();
                // 获取组件配置
                let points = this.genEndPointList(
                    data.inputParams,
                    data.outputParams,
                    x,
                    y,
                    id
                );
                // 从拖拽来的数据中摘取有用信息,组成node参数,添加一个节点(通知父元素,在nodes数组中添加一个元素)
                const newNode = {
                    id, // 节点的唯一ID
                    label: data.label, // 用来显示的名称
                    name: data.name, // 用来获取配置的name
                    columnSchema: [], // 存放当前节点所需要的schema
                    outputSchema: data.outputSchema || [], // 组件的输出schema，数据集组件需要，其他组件也可以存
                    dataSetId: data.dataSetId || '',
                    inputSchema: [], // 组件接收到的schema {point_id: [], point_id: []}
                    schemaFilterMethod: data.schemaFilterMethod || 'schemaFilterDefault', // 用于计算当前节点所需要的schema的函数名称
                    state: nodeState.NOTREADY, // 组件状态
                    isFinished: false, // 标记组件是否已经运行成功过
                    x, // 定位 left
                    y, // 定位 top
                    type: data.type, // 节点类型
                    taskKind: data.taskKind, // 任务类型
                    active: false, // 是否当前节点
                    params: !_.isEmpty(data.params)
                        ? data.params
                        : this.genParamsObject(data.paramsConf), // 组件参数对象
                    paramsConf: data.paramsConf, // 组件参数配置
                    envValues: data.envValues, // 环境变量
                    code: data.code || '', // 自定义组件: 自定义代码
                    points, // 组件连接点配置
                    validateResult: [], // 参数检查结果
                    resource: data.resource, // 资源配置
                    dockerImage: data.dockerImage, // 运行环境
                    inputParams: data.inputParams, // 输入参数信息
                    outputParams: data.outputParams, // 输出参数信息
                    showDetail: false,
                    executeDetails: {}, // 执行详细信息
                    isCustom: data.isCustom || false, // 自定义组件
                    isModel: data.isModel || false, // 模型组件
                    sinkOption: data.sinkOption, // 数据集存储路径信息
                    runFile: data.runFile || '', // 组件执行文件
                    rules: data.rules || {}, // 组件参数校验规则{inputRules:[], paramsRules: []}
                    mainClass: data.mainClass || '', // spark组件的主类
                    user: data.user || '', // 组件用户uuid
                    runFileHostPath: data.runFileHostPath || '', // 运行文件完整地址
                    canEdit: data.canEdit || false // 是否可以编辑执行代码
                };
                // 清除当前激活节点
                this.activeNode = null;
                this.$emit('changeActiveNode', '');
                this.$emit('changeNodeActiveStatus');
                // note: 操作可撤销, 加入操作队列
                this.$emit('addOperation', {
                    operate: 'addNode',
                    revoke: 'removeNode',
                    value: newNode,
                    revokeValue: newNode
                });
                this.$emit('addNode', newNode);
            }
        },
        /**
     * @description 根据input和output配置生成连接点数组
     */
        genEndPointList(inputParams, outputParams, nodeX, nodeY, nodeId) {
            let inputCount = (Array.isArray(inputParams) && inputParams.length) || 0;
            let outputCount =
        (Array.isArray(outputParams) && outputParams.length) || 0;
            let inputEndpointConf = inputParams.map((item, index) => {
                let x = (1 / (inputCount + 1)) * (index + 1) * config.nWidth;
                return {
                    id: UUID.getUUID(),
                    nodeId,
                    x: x + nodeX,
                    y: nodeY,
                    index: index + 1,
                    total: inputCount,
                    isSource: false,
                    scope: item.ptype,
                    stype: item.stype,
                    dragAllowedWhenFull: true,
                    name: item.name,
                    envName: item.envName || ''
                };
            });
            let outputEndpointConf = outputParams.map((item, index) => {
                let x = (1 / (outputCount + 1)) * (index + 1) * config.nWidth;
                return {
                    id: UUID.getUUID(),
                    nodeId,
                    x: x + nodeX,
                    y: nodeY + config.nHeight,
                    index: index + 1,
                    total: outputCount,
                    maxConnections: -1,
                    isSource: true,
                    scope: item.ptype,
                    stype: item.stype,
                    dragAllowedWhenFull: true,
                    name: item.name,
                    envName: item.envName || ''
                };
            });
            return [...inputEndpointConf, ...outputEndpointConf];
        },
        /**
     * @description 生成参数对象
     */
        genParamsObject(paramsConf) {
            let ret = {};
            if (!!paramsConf && paramsConf.length) {
                paramsConf.forEach(item => {
                    ret[item.name] =
            item.uiType === 'mixedParamBean'
                ? [this.genParamsObject(item.paramsConf)]
                : item.defaultValue === undefined
                    ? ''
                    : item.defaultValue;
                });
            }
            return ret;
        },
        dropHandler(el, data, ev) {
            // 检查拖拽来源并添加节点
            this.addNode(data, ev);
        },
        bindSvgEvent() {
            const _this = this;
            const drawPull = d3.select('#drawPull');
            // 绑定事件前，先清除事件，防止重复绑定
            drawPull.on('.zoom', null).on('click', null);
            // 绑定事件
            flowGlobal.zoom = d3
                .zoom()
                .scaleExtent(config.scaleRange)
            // 位移范围为可移动范围的左上角和右下角两个点的坐标
                .on('zoom', () => {
                    d3.select('#graphArea').attr('transform', () => {
                        let transform = d3.event.transform;
                        _this.translate = transform;
                        _this.$emit('zoomChange', transform.k);
                        return transform;
                    });
                    _this.updateContextMenuVisible(false);
                });
            drawPull.call(flowGlobal.zoom).on('dblclick.zoom', null); // 禁用双击放大
            // .on('wheel.zoom', null) // 禁用滚轮放大
            drawPull.on('click', () => {
                _this.activeNode = null;
                if (_this.contextMenuVisible) {
                    _this.updateContextMenuVisible(false);
                }
                _this.$emit('changeActiveNode', '');
                _this.$emit('changeNodeActiveStatus');
            });
            flowGlobal.zoom &&
        flowGlobal.zoom.scaleTo(d3.select('#drawPull'), this.scale);
        },
        bindNodesEvent() {
            const _this = this;
            const nodeGroup = d3.select('#nodeGroup');
            // 绑定事件前，先清除事件，防止重复绑定
            nodeGroup
                .selectAll('.node')
                .on('focus', null)
                .on('click', null)
                .on('contextmenu', null)
                .on('blur', null)
                .on('.drag', null)
                .on('keyup', null);
            // 绑定事件
            nodeGroup
                .selectAll('.node')
                .on('mousedown', node => {
                    if (d3.event.which !== 3) {
                        _this.activeNode = node;
                    }
                })
                .on('click', node => {
                    d3.event.stopPropagation();
                    if (_this.contextMenuVisible) {
                        _this.updateContextMenuVisible(false);
                    }
                    _this.$emit('changeActiveNode', node.id);
                    _this.$emit('changeNodeActiveStatus', node.id);
                })
                .on('blur', node => {
                    if (_this.contextMenuVisible && node.id !== _this.contextMenuNodeId) {
                        _this.updateContextMenuVisible(false);
                    }
                })
                .on('contextmenu', node => {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    const menuInfo = {
                        x: d3.event.pageX,
                        y: d3.event.pageY,
                        id: node.id
                    };
                    this.contextMenuNodeId = node.id;
                    // _this.$emit('changeActiveNode', node.id);
                    // _this.$emit('changeNodeActiveStatus', node.id);
                    _this.$emit('showContextMenu', menuInfo);
                });
            if (this.isEditable) {
                nodeGroup.selectAll('.node')
                    .on('keyup', node => {
                        let event = d3.event;
                        if (event.code === 'Delete' && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                            _this.$emit('deleteNode', node);
                        }
                    })
                    .call(this.nodeDrag());
            }
        },
        bindNodeChildElementEvent() {
            const _this = this;
            const nodeGroup = d3.select('#nodeGroup');
            // 绑定详情按钮点击事件
            nodeGroup.selectAll('.node').each(function(node) {
                const detailBtn = d3.select(this).select('.detail-btn');
                const tipBtn = d3.select(this).select('.tip-btn-rect');
                // 绑定事件前，清空之前绑定事件
                tipBtn.on('mouseover', null).on('mouseout', null);
                detailBtn.on('click', null);
                detailBtn.on('click', () => {
                    // note: 操作可撤销, 加入操作队列
                    _this.$emit('addOperation', {
                        operate: 'toggleDetail',
                        revoke: 'toggleDetail',
                        value: node.id,
                        revokeValue: node.id
                    });
                    _this.$emit('toggleDetail', node.id);
                });
                tipBtn
                    .on('mouseover', function() {
                        const overNode = d3.select(this.parentNode);
                        const overNodeTranslate = _this.getTranslate(
                            overNode.attr('transform')
                        );
                        _this.tipPosition = {
                            x:
                (Number(overNodeTranslate[0]) + config.nWidth) * _this.scale +
                _this.translate.x +
                250,
                            y:
                (Number(overNodeTranslate[1]) + config.nHeight / 2) *
                  _this.scale +
                _this.translate.y +
                60
                        };
                        if (nodeState.FAILED === node.state) {
                            _this.tipMessage = Object.assign(
                                [],
                                [
                                    {
                                        result: false,
                                        message: node.failMessage || '运行失败'
                                    }
                                ]
                            );
                        } else if (nodeState.STOPED === node.state) {
                            _this.tipMessage = Object.assign(
                                [],
                                [{ result: false, message: '已停止' }]
                            );
                        } else if (nodeState.SUCCESS === node.state) {
                            _this.tipMessage = Object.assign(
                                [],
                                [{ result: false, message: '运行成功' }]
                            );
                        } else {
                            _this.tipMessage = Object.assign([], node.validateResult);
                        }
                    })
                    .on('mouseleave', () => {
                        _this.tipMessage = [];
                    })
                    .on('blur', () => {
                        _this.tipMessage = [];
                    });
            });
        },
        nodeDrag() {
            const _this = this;
            let startX = 0;
            let startY = 0;
            let g = null;

            function dragStart() {
                startX = d3.event.x;
                startY = d3.event.y;
                g = d3.select(this);
                _this.updateContextMenuVisible(false);
            }
            function dragMove() {
                let eventX = d3.event.x;
                let eventY = d3.event.y;
                g.attr('transform', () => `translate(${eventX}, ${eventY})`);
                // 动态绘制连线
                g.selectAll('.node-point').each(function(circle) {
                    let point = d3.select(this);
                    let cx = utils.getPointXAxis(eventX, circle.index, circle.total);
                    let cy = utils.getPointYAxis(
                        eventY,
                        circle.isSource,
                        _this.activeNode.showDetail
                    );
                    let id = point.attr('id');
                    // 动态绘制连线
                    d3.select('#linkGroup')
                        .selectAll('path.link')
                        .each(function(link) {
                            let reDraw = false;
                            if (link.source.id === id) {
                                link.source.x = cx;
                                link.source.y = cy;
                                reDraw = true;
                            } else if (link.target.id === id) {
                                link.target.x = cx;
                                link.target.y = cy;
                                reDraw = true;
                            }
                            if (reDraw) {
                                let path = d3.select(this);
                                path.attr('d', d => {
                                    let x1 = d.source.x;
                                    let y1 = d.source.y;
                                    let x2 = d.target.x;
                                    let y2 = d.target.y;
                                    return utils.generateBézierControlPoints2(x1, y1, x2, y2);
                                });
                            }
                        });
                });
            }
            function dragEnd() {
                // 更新nodeData位置信息
                let g = d3.select(this);
                let eventX = d3.event.x;
                let eventY = d3.event.y;
                let id = g.attr('id');
                // note: 没有改变位置时，不需要更新位置
                if (startX !== eventX || startY !== eventY) {
                    let nodeNewPosition = {
                        id,
                        x: eventX,
                        y: eventY,
                        active: true
                    };
                    _this.$emit('changeActiveNode', _this.activeNode.id);
                    _this.$emit('changeNodeActiveStatus', _this.activeNode.id);
                    // note: 操作可撤销
                    _this.$emit('addOperation', {
                        operate: 'updateNodesAndLinks',
                        revoke: 'updateNodesAndLinks',
                        value: Object.assign({}, nodeNewPosition, {
                            active: false
                        }),
                        revokeValue: { id, x: startX, y: startY, active: false }
                    });
                    _this.$emit('updateNodesAndLinks', nodeNewPosition);
                }
            }
            return d3
                .drag()
                .on('start', dragStart)
                .on('drag', dragMove)
                .on('end', dragEnd);
        },
        bindNodePointEvent() {
            // 连线相关
            const _this = this;
            // 绑定事件前，先清除事件，防止重复绑定
            d3.select('#nodeGroup')
                .selectAll('circle.node-point')
                .on('mousedown', null)
                .on('mouseup', null)
                .on('contextmenu', null);
            // 绑定事件
            d3.select('#nodeGroup')
                .selectAll('circle.node-point')
                .on('mousedown', function(point) {
                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                    if (d3.event.which === 1) { // 鼠标左键
                        _this.updateContextMenuVisible(false);
                        // 判断连接点类型
                        if (point.isSource) {
                            // 判断是否已经连线
                            // if (_this.links.find(link => link.source.id === point.id)) {
                            //     return;
                            // }
                            flowGlobal.sourcePoint = point;
                            flowGlobal.dragLine
                                .attr('stroke', '#BEC8D2')
                                .attr('stroke-width', config.strokeWidth)
                                .attr('marker-mid', 'url(#arrow-marker-weaken)')
                                .attr('stroke-dasharray', '2,2')
                                .attr('d', () => {
                                    let x1 = point.x;
                                    let y1 = point.y;
                                    let x2 = x1;
                                    let y2 = y1;
                                    return utils.generateBézierControlPoints2(x1, y1, x2, y2);
                                })
                                .attr('fill', 'none');
                        } else {
                            // 判断是否已经存在连线了
                            let oldLink = _this.links.find(link => link.target.id === point.id);
                            if (oldLink) {
                                // 获取targetNode
                                let targetNode = _this.nodeMap[point.nodeId];
                                let [x, y] = d3.mouse(this);
                                flowGlobal.sourcePoint = oldLink.source;
                                // 删除显示原连线
                                d3.select(
                                    '#link_' + oldLink.source.id + '_' + oldLink.target.id
                                ).remove();
                                flowGlobal.dragLine
                                    .attr('stroke', '#BEC8D2')
                                    .attr('stroke-width', config.strokeWidth)
                                    .attr('marker-mid', 'url(#arrow-marker-weaken)')
                                    .attr('stroke-dasharray', '2,2')
                                    .attr('d', () => {
                                        let sourceNode = _this.nodeMap[flowGlobal.sourcePoint.nodeId];
                                        let x1 = utils.getPointXAxis(
                                            sourceNode.x,
                                            flowGlobal.sourcePoint.index,
                                            flowGlobal.sourcePoint.total
                                        );
                                        let y1 = utils.getPointYAxis(
                                            sourceNode.y,
                                            flowGlobal.sourcePoint.isSource,
                                            sourceNode.showDetail
                                        );
                                        let x2 = x + targetNode.x;
                                        let y2 = y + targetNode.y;
                                        return utils.generateBézierControlPoints2(x1, y1, x2, y2);
                                    })
                                    .attr('fill', 'none');
                                // note: 操作可撤销
                                _this.$emit('addOperation', {
                                    operate: 'removeLink',
                                    revoke: 'addLink',
                                    value: oldLink,
                                    revokeValue: oldLink
                                });
                                _this.$emit('removeLink', oldLink);
                            }
                        }
                    }
                })
                .on('mouseup', d => {
                    flowGlobal.dragLine.attr('stroke-width', 0);
                    if (flowGlobal.sourcePoint) {
                        flowGlobal.targetPoint = d;
                        const targetPoint = flowGlobal.targetPoint;
                        const sourcePoint = flowGlobal.sourcePoint;
                        // 判断目标连接点是否是输出节点（bottom）
                        if (targetPoint.isSource) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '输出节点不能连接输出节点'
                            });
                            return;
                        }
                        // 判断是否在同一个节点上
                        if (targetPoint.nodeId === sourcePoint.nodeId) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '同一节点的输入输出不能相互连接'
                            });
                            return;
                        }
                        // 判断目标连接点上是否已经存在连线了
                        if (
                            _this.links.findIndex(
                                link =>
                                    link.source.id === sourcePoint.id &&
                  link.target.id === targetPoint.id
                            ) > -1
                        ) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '连线已经存在'
                            });
                            return;
                        }
                        // 输入节点只能接受一个输入值
                        if (
                            _this.links.findIndex(link => link.target.id === targetPoint.id) >
              -1
                        ) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '输入接口只能接受一个输入值'
                            });
                            return;
                        }
                        const sourceNode = _this.nodeMap[sourcePoint.nodeId];
                        if (
                            !_this.testIsConnectable(
                                sourcePoint,
                                targetPoint,
                                sourceNode.type
                            )
                        ) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '输入输出数据类型不同，不能相互连接'
                            });
                            return;
                        }
                        // 添加新连线
                        const newLink = {
                            source: sourcePoint,
                            target: targetPoint
                        };
                        // note: 闭环检测
                        if (_this.closedLoopDetection(newLink, newLink.source.nodeId)) {
                            _this.$notify.warning({
                                title: '警告',
                                message: '不允许连线成环'
                            });
                            return;
                        }
                        // note: 操作可撤销
                        _this.$emit('addOperation', {
                            operate: 'addLink',
                            revoke: 'removeLink',
                            value: newLink,
                            revokeValue: newLink
                        });
                        _this.$emit('addLink', newLink);
                    }
                });
        },
        bindSvgMouseEvent() {
            // 连线相关
            const _this = this;
            // 绑定事件前，先清除事件，防止重复绑定
            d3.select('#drawPull')
                .on('mousemove', null)
                .on('mouseup', null);
            // 画布上监听鼠标移动事件
            d3.select('#drawPull')
                .on('mousemove', function() {
                    d3.event.preventDefault();
                    if (flowGlobal.sourcePoint) {
                        let [x, y] = d3.mouse(this);
                        flowGlobal.dragLine
                            .attr('stroke', '#BEC8D2')
                            .attr('stroke-width', config.strokeWidth)
                            .attr('marker-mid', 'url(#arrow-marker-weaken)')
                            .attr('stroke-dasharray', '2,2')
                            .attr('d', () => {
                                let sourceNode = _this.nodeMap[flowGlobal.sourcePoint.nodeId];
                                let x1 = utils.getPointXAxis(
                                    sourceNode.x,
                                    flowGlobal.sourcePoint.index,
                                    flowGlobal.sourcePoint.total
                                );
                                let y1 = utils.getPointYAxis(
                                    sourceNode.y,
                                    flowGlobal.sourcePoint.isSource,
                                    sourceNode.showDetail
                                );
                                let x2 = (x - _this.translate.x) / _this.scale;
                                let y2 = (y - _this.translate.y - 3) / _this.scale;
                                return utils.generateBézierControlPoints2(x1, y1, x2, y2);
                            })
                            .attr('fill', 'none');
                        // note: 可连接点高亮提示
                        // 在这里添加点高亮的原因:
                        // 1. 当从存在连线的目标端点拖连线时，会先删除该连线，这样会触发schema推导，导致高亮的连接点被还原
                        // 2. 防止多次调用handleHighLightPoint方法，这里加上pointsHasHighLight控制
                        !flowGlobal.pointsHasHighLight &&
              _this.handleHighLightPoint(flowGlobal.sourcePoint);
                    }
                })
                .on('mouseup', () => {
                    // 移除没有连接到连接点的线
                    if (flowGlobal.sourcePoint) {
                        flowGlobal.dragLine.attr('marker-mid', null);
                        flowGlobal.dragLine.attr('stroke-width', 0);
                        _this.cancleHighLightPoint(flowGlobal.sourcePoint);
                    }
                    flowGlobal.sourcePoint = null;
                    flowGlobal.targetPoint = null;
                });
        },
        getTranslateAndScale(transform) {
            return {
                translate: this.getTranslate(transform),
                scale: this.getScale(transform)
            };
        },
        getTranslate(transform) {
            let matchArr =
        transform &&
        /translate/.test(transform) &&
        transform.match(/translate\(([^)]+)\)/);
            let translate = (matchArr && matchArr[1].split(',')) || [0, 0];
            return translate;
        },
        getScale(transform) {
            let matchArr =
        transform &&
        /scale/.test(transform) &&
        transform.match(/scale\(([^)]+)/);
            let scale = (matchArr && matchArr[1]) || 1;
            return scale;
        },
        handleHighLightPoint(sourcePoint) {
            // 连接点高亮提示
            const _this = this;
            const sourceNode = this.nodeMap[sourcePoint.nodeId];
            d3.select('#nodeGroup')
                .selectAll('circle.node-point')
                .each(function(point) {
                    if (
                        !point.isSource &&
            _this.testIsConnectable(sourcePoint, point, sourceNode.type)
                    ) {
                        d3.select(this)
                            .attr('r', 10)
                            .attr('stroke', '#01DA75')
                            .attr('stroke-width', 2);
                    }
                });
            flowGlobal.pointsHasHighLight = true;
        },
        cancleHighLightPoint(sourcePoint) {
            // 取消可连接点高亮提示
            const _this = this;
            const sourceNode = this.nodeMap[sourcePoint.nodeId];
            d3.select('#nodeGroup')
                .selectAll('circle.node-point')
                .each(function(point) {
                    if (
                        !point.isSource &&
            _this.testIsConnectable(sourcePoint, point, sourceNode.type)
                    ) {
                        d3.select(this)
                            .attr('r', 8)
                            .attr('stroke', '#25405B')
                            .attr('stroke-width', 1);
                    }
                });
            flowGlobal.pointsHasHighLight = false;
        },
        closedLoopDetection(link, id) {
            // 新添加的连线，连线的sourceId
            // 闭环检测
            let isCloseLoop = false;
            const filterLinks = this.links.filter(
                el => el.source.nodeId === link.target.nodeId
            );
            if (filterLinks.length > 0) {
                for (let i = 0, len = filterLinks.length; i < len; i++) {
                    const childTargetId = filterLinks[i].target.nodeId;
                    if (childTargetId === id) {
                        isCloseLoop = true;
                        break;
                    } else {
                        if (this.closedLoopDetection(filterLinks[i], id)) {
                            isCloseLoop = true;
                            break;
                        }
                    }
                }
            }
            return isCloseLoop;
        },
        testIsConnectable(sourcePoint, targetPoint, sourceType) {
            // 判断输入输出是否可以连接
            return (
                (sourceType === 'DataSet' && sourcePoint.stype === 'OTHER') ||
        targetPoint.stype.includes(sourcePoint.stype)
            );
        },
        init() {
            if (this.isEditable) {
                flowGlobal.dragLine = d3.select('#instruction-line');
                this.bindNodePointEvent();
                this.bindSvgMouseEvent();
            }
            this.bindSvgEvent();
            this.bindNodesEvent();
            this.bindNodeChildElementEvent();
        },
        updateContextMenuVisible(val) {
            if (this.contextMenuNodeId) {
                this.$emit('update:contextMenuVisible', val);
                this.contextMenuNodeId = '';
            }
        }
    },
    mounted() {
        this.init();
        const drawPullSvg = document.getElementById('drawPull');
        this.svgWidth = (drawPullSvg && drawPullSvg.clientWidth) || 0;
        this.svgHeight = (drawPullSvg && drawPullSvg.clientHeight) || 0;

        // 设置当前焦点节点
        this.activeNode = this.nodes.find(node => node.active);
        if (this.activeNode) {
            document.getElementById(this.activeNode.id).focus();
        }
    },
    updated() {
        if (this.isEditable && flowGlobal.updateNode) {
            // 更新node dom后，重新绑定事件
            this.bindNodePointEvent();
            flowGlobal.updateNode = false;
        }
        this.bindNodesEvent();
        this.bindNodeChildElementEvent();
        flowGlobal.pointsHasHighLight = false;

        // 设置当前焦点节点
        this.activeNode = this.nodes.find(node => node.active);
        if (this.activeNode) {
            document.getElementById(this.activeNode.id).focus();
        }
    },
    watch: {
        nodes() {
            flowGlobal.updateNode = true;
        },
        links() {
            flowGlobal.updateLink = true;
        },
        zoom() {
            flowGlobal.zoom &&
        flowGlobal.zoom.scaleTo(d3.select('#drawPull'), this.scale);
        }
    }
};
</script>

<style lang='scss' scoped>
.graph-flow {
  width: 100%;
  height: 100%;
  #drawPull {
    width: 100%;
    height: 100%;
    background: rgba(246, 248, 251, 1);
    /* cursor: -webkit-grab; */
    & /deep/ .node:focus {
      outline: none;
    }
  }
  svg {
    fill: "#F6F8FB";
  }
}

.sjs-droppable-dragover {
  cursor: copy;
}
</style>
