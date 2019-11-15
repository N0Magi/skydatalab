<template>
    <div
        class="skyflow-editor"
        @contextmenu="handleEditorContextMenu"
        @click="handleEditorClick"
    >
        <div class="header">
            <function-bar
                :is-crontab="isCrontab"
                :is-running="isRunning"
                :is-resume="isResume"
                :is-ready="isReady"
                :is-current-user="isCurrentUser"
                :is-execute="!!executeId"
                :is-stream="isStream"
                :zoom="zoom"
                :forward-able="!!revokeQueue.length"
                :back-able="!!operationQueue.length"
                :skyflow-id="skyflowId"
                :flow-name="baseInfo && baseInfo.name"
                :execute-setting="executeSetting"
                :executeStartTime="executeStartTime"
                @operate="handleFunctionOperation"
            />
        </div>
        <div class="main clearfix">
            <div
                class="left"
                v-if="isCurrentUser"
            >
                <component-classification
                    :is-editable="isEditable"
                    ref="classification"
                    :processType="processType"
                    v-loading="!processType"
                />
            </div>
            <div
                class="middle"
                :style="svgWidth"
            >
                <draw-pull
                    :nodes="nodes"
                    :links="links"
                    :is-editable="isEditable"
                    :zoom="zoom"
                    :context-menu-visible.sync="contextMenuVisible"
                    @addNode="addNode"
                    @addLink="addLink"
                    @removeLink="removeLink"
                    @updateNodesAndLinks="updateNodesAndLinks"
                    @changeActiveNode="changeActiveNode"
                    @zoomChange="handleZoomChange"
                    @toggleDetail="toggleDetail"
                    @showContextMenu="showContextMenu"
                    @addOperation="handleAddOperationQueue"
                    @deleteNode="removeNodeAndLink"
                />
                <Console
                    :node-id="activeNodeId"
                    :node="activeNode"
                    :expand.sync="expandConsoleLog"
                    :execute-id="executeId"
                    :job-id="jobId"
                    :flow-state="typeof flowState===&quot;number&quot;?flowState:-1"
                />
            </div>
            <div
                class="right"
                id="componentSetting"
            >
                <component-setting
                    v-if="activeNode"
                    :is-editable="isEditable"
                    :node-id="activeNodeId"
                    :node="activeNode"
                    :is-change-setting.sync="isChangeSetting"
                />
                <info
                    v-if="!activeNode"
                    :result="baseInfo"
                />
            </div>
        </div>
        <context-menu
            v-if="contextMenuVisible && menuList.length"
            :menu-list="menuList"
            :context-x="contextX"
            :context-y="contextY"
            @clickmenu="handleMenuclick"
        />
        <!-- 点击右键选项 弹框 -->
        <component
            v-if="contextName && contextDialogVisible"
            :is="contextName"
            :node="currentOperationalNode"
            :execute-id="executeId"
            :context-dialog-visible.sync="contextDialogVisible"
            @confirm="handleContextDialog"
        />
        <SdxwCodeEditor
            :visible.sync="codeEditorVisible"
            :code="currentCode"
            @confirm="handleSaveCode"
        />
    </div>
</template>

<script>
import functionBar from './functionBar/';

import drawPull from './drawPull';
import componentClassification from './classification/';
import componentSetting from './setting/';
import contextMenu from './contextMenu/';
import * as contextDialog from './contextMenu/dialog/';
import info from './setting/info';
import Console from './console';

import utils from './js/utils';
import UUID from './js/UUID';
import { timeFormat } from './util/common';
import * as schemaFilterMethods from './js/schemaFilterMethods';
import * as nodeCheckMethods from './js/nodeCheckMethods';
import { contextMenuIcon, nodeState, resourceInfo } from './js/skyflowConfig';
import emitter from 'element-ui/lib/mixins/emitter';
import SdxwCodeEditor from '@sdx/widget/lib/code-editor';

import {
    getflowInfo,
    computeSchema,
    saveModelJson,
    saveExecuteModelJson,
    createExecution,
    stopExecuteWorkflow,
    addFavorite,
    setExecuteType,
    setInstance,
    modelSaveas,
    setCrontabs,
    getExecuteListState,
    startExecuteRecord,
    resumeExecuteRecord,
    checkRunningInstance,
    getWorkflowSnapshot
} from '@sdx/utils/lib/api/skyflow';
// import { getResources } from '@sdx/utils/src/api/skyflow';
import { mapState, mapActions } from 'vuex';
import { dateFormatter } from '@sdx/utils/lib/helper/transform';

let nodeStatusInterval = null;

export default {
    name: 'Editor',
    mixins: [emitter],
    components: {
        functionBar,
        drawPull,
        componentClassification,
        componentSetting,
        contextMenu,
        Console,
        SdxwCodeEditor,
        ...contextDialog,
        info
    },
    data() {
        return {
            skyflowId: this.$route.params.id,
            executeId: this.$route.params.executeId || '',
            jobId: this.$route.params.jobId || '',
            flowState: nodeState.READY,
            contextMenuVisible: false,
            currentOperationalNode: null,
            activeNodeId: '',
            activeNode: null,
            zoom: 100,
            nodes: [],
            links: [],
            baseInfo: null,
            operationQueue: [], // 操作队列
            revokeQueue: [], // 撤销队列
            menuInfo: null,
            contextName: '',
            contextDialogVisible: false,
            contextX: 0,
            contextY: 0,
            menuList: [],
            isCurrentUser: true,
            failedNeedResume: true, // 失败或终止后，是否继续运行
            isChangeSetting: false,
            isReady: false, // 参数校验状态
            isCrontab: false, // 是否是定时任务
            stateNodeList: null,
            expandConsoleLog: false, // 展开组件日志
            executeSetting: {
                // 执行设置信息
                switch: false,
                begin_execute_time: '',
                interval: 1,
                max_execute_times: 1,
                handle_type: 0,
                timeout: 1,
                execute_type: 0,
                rerun_instance: 1,
                manual_instance: 1,
                crontab_instance: 1,
                timeUnit: 'minute',
                timeValue: 1
            },
            currentCode: '', // 当前组件自定义code
            codeEditorVisible: false, // 代码编辑器弹框
            executeStartTime: '', // 执行开始时间
            processType: '' // 工作流类型: PATCH | STREAM
        };
    },
    computed: {
        ...mapState({
            currentUser: state => state.user && state.user.token && state.user.token.user || {}
        }),
        modelJson() {
            return {
                nodes: this.nodes,
                links: this.links,
                zoom: this.zoom
            };
        },
        isRunning() {
            // 启动中也属于运行一部分
            return [
                nodeState.RUNNING,
                nodeState.STARTING,
                nodeState.CRONRUNNING
            ].includes(this.flowState);
        },
        isResume() {
            return (
                [nodeState.FAILED, nodeState.STOPED].includes(this.flowState) &&
        this.failedNeedResume
            );
        },
        isEditable() {
            return (
                !this.isRunning &&
        this.isCurrentUser &&
        !this.isResume &&
        !this.isCrontab
            );
        },
        isStream() {
            return this.processType === 'STREAM';
        },
        svgWidth() {
            return this.isCurrentUser
                ? { width: 'calc(100% - 250px - 250px)' }
                : { width: 'calc(100% - 250px)' };
        }
    },
    methods: {
        ...mapActions(['getResourceRole']),
        ...nodeCheckMethods,
        ...schemaFilterMethods,
        addNode(node) {
            //  画布中-添加组件
            this.nodes.push(node);
            this.handleComponentParamsValidate();
        },
        removeNode(node) {
            // 画布中-删除组件
            // 判断删除的节点是否是当前节点
            if (node.id === this.activeNodeId) {
                this.changeActiveNode();
            }
            let index = this.nodes.findIndex(el => el.id === node.id);
            this.nodes.splice(index, 1);
        },
        removeNodeAndLink(node) {
            // 画布中-删除组件以及相关连线
            if (node) {
                const deleteLinks = [];
                const links = [];
                this.links.forEach(link => {
                    if (
                        link.source.nodeId !== node.id &&
            link.target.nodeId !== node.id
                    ) {
                        links.push(link);
                    } else {
                        deleteLinks.push(link);
                    }
                });
                // note: 操作可撤销
                this.handleAddOperationQueue({
                    operate: 'removeNodeAndLink',
                    revoke: 'addNodeAndLink',
                    value: node,
                    revokeValue: { node, links: deleteLinks }
                });
                this.updateLinks(links);
                this.removeNode(node);
            }
        },
        addNodeAndLink({ node, links }) {
            //  画布中-恢复删除的组件以及相关连线，用于恢复按钮
            this.addNode(Object.assign(node, { active: false }));
            const newLinks = this.links.concat(links);
            this.updateLinks(newLinks);
        },
        updateNodes(nodes) {
            // 画布中-更新组件nodes信息
            this.nodes = Array.concat([], nodes);
        },
        addLink(link) {
            // 画布中-添加连线
            this.links.push(link);
            this.isEditable && this.handleSchemaDerivation();
        },
        removeLink(link) {
            // 画布中-删除连线
            let i = this.links.findIndex(
                el => el.source.id === link.source.id && el.target.id === link.target.id
            );
            this.links.splice(i, 1);
            this.isEditable && this.handleSchemaDerivation();
        },
        updateLinks(links, isInit = false) {
            // 画布中-更新links信息
            this.links = Array.concat([], links);
            // 如果是初始化更新links，则不触发schema推导，只进行参数校验，主要确定this.isReady状态
            isInit
                ? this.handleComponentParamsValidate(isInit)
                : this.isEditable && this.handleSchemaDerivation();
        },
        updateNodesAndLinks(obj) {
            // 画布中-更新节点和连线信息，用于更新组件位置
            let nodeData = this.nodes;
            let linkData = this.links;
            let pointsUpdateList = {};
            let updateNode = nodeData.find(el => el.id === obj.id);
            if (updateNode) {
                updateNode.x = obj.x;
                updateNode.y = obj.y;
                updateNode.active = obj.active;
                // 更新points坐标
                updateNode.points.forEach(el => {
                    el.x = utils.getPointXAxis(obj.x, el.index, el.total);
                    el.y = utils.getPointYAxis(obj.y, el.isSource, updateNode.showDetail);
                    pointsUpdateList[el.id] = el;
                });
                // 更新link
                linkData.forEach(el => {
                    if (pointsUpdateList.hasOwnProperty(el.source.id)) {
                        el.source = pointsUpdateList[el.source.id];
                    } else if (pointsUpdateList.hasOwnProperty(el.target.id)) {
                        el.target = pointsUpdateList[el.target.id];
                    }
                });
                this.nodes = Array.concat([], nodeData);
                this.links = Array.concat([], linkData);
            }
        },
        toggleDetail(id) {
            // 画布中-toggle组件详情框
            this.nodes.forEach(el => {
                if (el.id === id) {
                    el.showDetail = !el.showDetail;
                    this.updateNodesAndLinks({ id, x: el.x, y: el.y, active: true });
                }
            });
        },
        changeActiveNode(nodeId) {
            // 画布中-切换激活的组件
            this.activeNode = null;
            this.$nextTick(() => {
                if (nodeId) {
                    this.activeNode = this.nodes.find(node => node.id === nodeId);
                    this.activeNode.nodeState =
            this.activeNode &&
            this.activeNode.id &&
            this.stateNodeList &&
            this.stateNodeList[this.activeNode.id];
                    if (
                        !this.isEditable &&
            [
                nodeState.STOPED,
                nodeState.SUCCESS,
                nodeState.RUNNING,
                nodeState.FAILED
            ].includes(this.activeNode.state)
                    ) {
                        this.expandConsoleLog = true;
                    }
                } else {
                    this.activeNode = null;
                }
                console.log('activeNode ', this.activeNode);
            });
            // 没有切换激活组件，不更新状态
            this.activeNodeId !== nodeId && this.changeNodeActiveStatus(nodeId);
            this.activeNodeId = nodeId || '';
            // 触发schema推导
            if (this.isChangeSetting && this.activeNodeId && this.isEditable) {
                this.handleSchemaDerivation();
                this.isChangeSetting = false;
            }
        },
        changeNodeActiveStatus(id) {
            // 画布中-更新激活组件的active字段
            // 不传id，表示所有节点失去焦点
            if (id) {
                this.nodes.forEach(node => {
                    if (node.id === id) {
                        node.active = true;
                    } else {
                        node.active = false;
                    }
                });
            } else {
                this.nodes.forEach(node => {
                    node.active = false;
                });
            }
            this.nodes = Array.concat([], this.nodes);
        },
        handleSchemaDerivation() {
            //  画布中-schema推导
            if (this.links.length > 0) {
                computeSchema(this.modelJson).then(data => {
                    this.nodes.forEach(node => {
                        node.inputSchema = data[node.id] || [];
                        // 根据schemaFilter处理inputSchema，赋值给columnSchema
                        const inputPoints = node.points
                            .filter(point => !point.isSource)
                            .sort((a, b) => a.index - b.index);
                        if (inputPoints.length) {
                            node.columnSchema = this[node.schemaFilterMethod](
                                ...inputPoints.map(item => node.inputSchema[item.id] || [])
                            );
                        }
                    });
                    this.updateNodes(this.nodes);
                    this.$nextTick(() => {
                        this.handleComponentParamsValidate();
                    });
                });
            } else {
                this.handleComponentParamsValidate();
            }
        },
        handleAddOperationQueue(operation) {
            // 将操作添加到队列中，可供撤销
            this.operationQueue.push(operation);
            this.revokeQueue = [];
        },
        handleBack() {
            // 功能区-撤销
            const lastOperation = this.operationQueue.pop();
            this.changeActiveNode();
            this[lastOperation.revoke](lastOperation.revokeValue);
            this.revokeQueue.push(lastOperation);
        },
        handleForward() {
            // 功能区-恢复
            const lastRevoke = this.revokeQueue.pop();
            this.changeActiveNode();
            this[lastRevoke.operate](lastRevoke.value);
            this.operationQueue.push(lastRevoke);
        },
        handleClearOperationQueue() {
            // 清空操作队列，不能撤销和恢复
            this.operationQueue = [];
            this.revokeQueue = [];
        },
        handleModelSave() {
            // 功能区-保存画布信息（nodes、links、zoom）
            // 根据是否存在executeId来判断，是保存到工作流还是执行记录
            const saveModel = this.executeId
                ? saveExecuteModelJson({
                    model_json: this.modelJson,
                    execute_id: this.executeId
                })
                : saveModelJson({
                    model_json: this.modelJson,
                    skyflow_id: this.skyflowId
                });
            saveModel.then(data => {
                this.$notify({
                    title: '保存成功',
                    message: this.executeId
                        ? '最新画布保存在当前的执行记录中'
                        : '最新画布保存在当前的工作流中',
                    type: 'success'
                });
            });
        },
        handleModelSaveAs(params) {
            // 功能区-画布另存为
            modelSaveas({ model_json: this.modelJson, processType: this.processType, ...params }).then(data => {
                this.$notify({
                    title: '另存为成功',
                    type: 'success'
                });
            });
        },
        handleClear() {
            // 功能区-清空画布
            this.changeActiveNode();
            // note: 操作可撤销
            this.handleAddOperationQueue({
                operate: 'handleClear',
                revoke: 'handleRevoke',
                value: {},
                revokeValue: { nodes: this.nodes, links: this.links }
            });
            this.nodes = [];
            this.links = [];
        },
        handleRevoke(model) {
            // 恢复画布，用于清空画布后，点击撤销按钮
            this.updateNodes(model.nodes);
            this.updateLinks(model.links);
        },
        handleRun() {
            // 功能区-运行
            if (this.testIsExistMutiBranch()) {
                this.$notify.warning({
                    title: '警告',
                    message: '不能同时运行多条分支'
                });
                return;
            }
            if (!this.handleComponentParamsValidate()) {
                this.$notify.warning({
                    title: '警告',
                    message: '画布中组件参数未配置完成'
                });
                return;
            }
            // 根据是否存在executeId来判断，是保存到工作流还是执行记录
            const saveModel = this.executeId
                ? saveExecuteModelJson({
                    model_json: this.modelJson,
                    execute_id: this.executeId
                })
                : saveModelJson({
                    model_json: this.modelJson,
                    skyflow_id: this.skyflowId
                });
            // 先调用保存接口
            saveModel.then(data => {
                this.$notify({
                    title: '保存成功',
                    message: this.executeId
                        ? '最新画布保存在当前的执行记录中'
                        : '最新画布保存在当前工作流中',
                    type: 'success'
                });
                checkRunningInstance(this.skyflowId).then(data => {
                    if (data && data.allow) {
                        // 根据是否存在executeId来判断，是创建执行记录还是运行执行记录
                        const startFlow = this.executeId
                            ? startExecuteRecord(this.executeId)
                            : createExecution(this.skyflowId);
                        startFlow.then(data => {
                            this.$notify({
                                title: '开始运行',
                                message: '点击单个组件可以查看组件的运行日志和运行结果预览',
                                type: 'success'
                            });
                            // 通知日志组件清空历史日志
                            this.broadcast('CompLog', 'workflow-start');
                            this.broadcast('WorkFlowLog', 'workflow-start');
                            this.executeId = data.execute_id;
                            this.flowState = nodeState.RUNNING;
                            this.$router.replace({
                                path: `/editor/${this.skyflowId}/${this.executeId}`
                            });
                            // watch this.isRunning
                        });
                    } else {
                        this.$notify.warning({
                            title: '警告',
                            message: `当前工作流下已有${(data && data.running_instances) ||
                0}个执行记录处于运行中，已达到[多实例设置]中[执行实例数]的设置值，请稍后再试`
                        });
                    }
                });
            });
        },
        testIsExistMutiBranch() {
            // 测试画布中是否存在多条分支
            // 任意找一个数据源
            const dataSourceComp = this.nodes.find(
                node => !node.inputParams || node.inputParams.length === 0
            );
            // 根据这个数据源遍历出该数据源所在分支的所有组件
            const compSet = this.getLinkedNode(new Set([dataSourceComp.id]));
            // 判断是否有不在该Set中的组件，有: 表示存在多个分支
            return this.nodes.some(node => !compSet.has(node.id));
        },
        getLinkedNode(compSet) {
            // 递归获取连线的节点id Set
            let set = new Set([]);
            this.links.forEach(link => {
                if (
                    compSet.has(link.source.nodeId) &&
          !compSet.has(link.target.nodeId)
                ) {
                    set.add(link.target.nodeId);
                    compSet.add(link.target.nodeId);
                } else if (
                    compSet.has(link.target.nodeId) &&
          !compSet.has(link.source.nodeId)
                ) {
                    set.add(link.source.nodeId);
                    compSet.add(link.source.nodeId);
                }
            });
            return set.size ? this.getLinkedNode(compSet) : compSet;
        },
        handleGetRunningStateInterval(executeId) {
            // 轮询请求状态
            // 轮询请求状态, 每1s
            nodeStatusInterval = setInterval(() => {
                getExecuteListState([executeId])
                    .then(data => {
                        const executeInfo = data.find(
                            item => item.execution_id === executeId
                        );
                        this.executeStartTime =
              (executeInfo &&
                executeInfo.execution_state &&
                dateFormatter(executeInfo.execution_state.startTime)) ||
              '';
                        this.stateNodeList = executeInfo.nodes_state;
                        if (this.activeNode) {
                            this.activeNode.nodeState = this.stateNodeList[
                                this.activeNode.id
                            ];
                        }
                        this.flowState =
              (executeInfo &&
                executeInfo.execution_state &&
                executeInfo.execution_state.state) ||
              nodeState.READY;
                        this.handleNodesStatusUpdate(
                            (executeInfo && executeInfo.nodes_state) || null
                        );
                        if (nodeState.FAILED === this.flowState) {
                            clearInterval(nodeStatusInterval);
                            nodeStatusInterval = null;
                            this.failedNeedResume = true;
                            this.$notify.error({
                                title: '运行失败'
                            });
                        } else if (nodeState.STOPED === this.flowState) {
                            clearInterval(nodeStatusInterval);
                            nodeStatusInterval = null;
                            this.failedNeedResume = true;
                            this.$notify({
                                title: '运行终止',
                                type: 'warning'
                            });
                        } else if (nodeState.SUCCESS === this.flowState) {
                            clearInterval(nodeStatusInterval);
                            nodeStatusInterval = null;
                            this.$notify({
                                title: '运行成功',
                                type: 'success'
                            });
                        }
                    })
                    .catch(e => {
                        if (nodeStatusInterval) {
                            clearInterval(nodeStatusInterval);
                            nodeStatusInterval = null;
                            this.flowState = nodeState.FAILED;
                            this.failedNeedResume = true;
                        }
                    });
            }, 1000);
        },
        handleStop() {
            // 功能区-停止
            stopExecuteWorkflow(this.executeId).then(data => {
                this.flowState = nodeState.STOPED;
                this.failedNeedResume = true;
            });
        },
        handleResume() {
            // 功能区-继续运行
            checkRunningInstance(this.skyflowId)
                .then(data => {
                    if (data && data.allow) {
                        resumeExecuteRecord(this.executeId)
                            .then(data => {
                                this.$notify({
                                    title: '恢复运行',
                                    message: '点击单个组件可以查看组件的运行日志和运行结果预览',
                                    type: 'success'
                                });
                                this.flowState = nodeState.RUNNING;
                            })
                            .catch(e => {
                                console.error(e);
                                this.$notify.error({
                                    title: '运行失败',
                                    message: e
                                });
                            });
                    } else {
                        this.$notify.warning({
                            title: '警告',
                            message: `当前工作流下已有${(data && data.running_instances) ||
                0}个执行记录处于运行中，已达到[多实例设置]中[执行实例数]的设置值，请稍后再试`
                        });
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.$notify.error({
                        title: '获取工作流执行信息失败',
                        message: e
                    });
                });
        },
        handleExecSetting(params) {
            // 功能区-执行设置
            setExecuteType({ skyflow_id: this.skyflowId, ...params }).then(data => {
                this.$notify({
                    title: '设置成功',
                    type: 'success'
                });
            });
        },
        handleMutiInstance(params) {
            // 功能区-多实例设置
            setInstance({ skyflow_id: this.skyflowId, ...params }).then(data => {
                this.$notify({
                    title: '设置成功',
                    type: 'success'
                });
            });
        },
        handleTiming(params) {
            // 功能区-定时设置
            // 根据是否存在executeId来判断，是保存到工作流还是执行记录
            const saveModel = this.executeId
                ? saveExecuteModelJson({
                    model_json: this.modelJson,
                    execute_id: this.executeId
                })
                : saveModelJson({
                    model_json: this.modelJson,
                    skyflow_id: this.skyflowId
                });
            // 先调用保存接口
            saveModel.then(data => {
                this.$notify({
                    title: '保存成功',
                    message: this.executeId
                        ? '最新画布保存在当前的执行记录中'
                        : '最新画布保存在当前工作流中',
                    type: 'success'
                });
                setCrontabs({ skyflow_id: this.skyflowId, ...params }).then(data => {
                    this.$notify({
                        title: '设置成功',
                        type: 'success'
                    });
                });
            });
        },
        handleZoomIn() {
            // 功能区-画布缩小
            this.zoom = this.zoom - 5 < 50 ? 50 : this.zoom - 5;
        },
        handleZoomOut() {
            // 功能区-画布放大
            this.zoom = this.zoom + 5 > 200 ? 200 : this.zoom + 5;
        },
        handleZoomChange(k) {
            // 画布中-改变画布缩放
            this.zoom = Math.round(k * 100);
        },
        showContextMenu(menu) {
            // 画布右键组件时 筛选展示的菜单
            const node = this.nodes.find(el => el.id === menu.id);
            const filterItem = new Set([]);
            // 用户自定义组件: 收藏、代码编辑
            if (!node.isCustom) {
                filterItem.add('star');
                filterItem.add('edit-code');
            }
            // 不可编辑：画布正在运行、在别人画布、失败、定时任务
            if (!this.isEditable) {
                filterItem.add('copy');
                filterItem.add('rename');
                filterItem.add('delete');
                filterItem.add('edit-code');
            }
            // 非(结果导出组件、数据集组件)，运行成功后都有导出选项
            if (
                ['ModelExport', 'DataExport', 'DataSet'].includes(node.type) ||
        !node.isFinished
            ) {
                filterItem.add('export');
            }
            // 组件运行完成且是模型组件
            if (!(node.isModel && node.nodeState && node.nodeState.state === nodeState.SUCCESS)) {
                filterItem.add('model');
            }
            this.currentOperationalNode = node;
            this.menuList = contextMenuIcon.filter(el => !filterItem.has(el.name));
            this.contextX = menu.x;
            this.contextY = menu.y;
            this.contextMenuVisible = true;
        },
        handleSaveCode(code) {
            this.nodes.forEach(node => {
                if (node.id === this.currentOperationalNode.id) {
                    node.code = code;
                }
            });
            this.updateNodes(this.nodes);
        },
        handleComponentRename(params) {
            // 画布组件右键-重命名
            this.nodes.forEach(node => {
                if (node.id === this.currentOperationalNode.id) {
                    node.label = params.name;
                }
            });
            this.updateNodes(this.nodes);
        },
        handleComponentStar(params) {
            // 画布组件右键-收藏
            const node = _.cloneDeep(this.currentOperationalNode);
            const starNodeInfo = {
                label: params.name,
                name: node.name,
                type: node.type,
                taskKind: node.taskKind,
                paramsConf: node.paramsConf,
                params: node.params, // 收藏传入params值
                envValues: node.envValues,
                resource: node.resource,
                dockerImageId: node.dockerImage && node.dockerImage._id,
                inputParams: node.inputParams,
                outputParams: node.outputParams,
                isCustom: node.isCustom,
                runFile: node.runFile,
                user: node.user
            };
            addFavorite({
                component_json: starNodeInfo,
                dockerImageId: node.dockerImage && node.dockerImage._id,
                name: params.name,
                dockerImageName: node.dockerImage && node.dockerImage.name
            }).then(() => {
                this.$notify({
                    title: '收藏成功',
                    type: 'success'
                });
                // 收藏组建成功后，当前为收藏tab项则刷新左侧组件库
                if (
                    this.$refs.classification &&
          this.$refs.classification.currentLabel === 'favorite'
                ) {
                    this.$refs.classification.fetchFavorite();
                }
            });
        },
        handleEditorContextMenu() {
            // 监听整个画布的右键事件，用于隐藏画布右键菜单
            if (this.contextMenuVisible) {
                this.contextMenuVisible = false;
            }
        },
        handleEditorClick(event) {
            // 监听整个画布页面的点击，判断是否点击了配置页面setting
            // 当配置变更且点击配置页面外时，触发schema推导
            if (
                this.isEditable &&
        this.isChangeSetting &&
        !this.testClickInSettingPage(event.pageX, event.pageY)
            ) {
                this.handleSchemaDerivation();
                this.isChangeSetting = false;
            }
        },
        testClickInSettingPage(x, y) {
            // 判断是否点击setting页面
            // 判断坐标是否在配置页面
            const settingDom = document.getElementById('componentSetting');
            return (
                x > settingDom.offsetLeft &&
        x < settingDom.offsetLeft + settingDom.offsetWidth &&
        y > settingDom.offsetTop &&
        y < settingDom.offsetTop + settingDom.offsetHeight
            );
        },
        handleComponentParamsValidate(isInit = false) {
            // 组件参数校验
            console.time('参数校验耗时');
            let needUpdate = false;
            let isReady = true;
            this.nodes.forEach(node => {
                let ret = [];
                let rules = node.rules || {};
                let paramsConf = node.paramsConf;
                let params = node.params;
                const inputPoints = node.points
                    .filter(point => !point.isSource)
                    .sort((a, b) => a.index - b.index);
                // 判断输入是否完整：1.先判断输入schema数量是否对应 2.再判断输入是否符合规则
                if (
                    !inputPoints.every(
                        point => !!this.links.find(link => link.target.id === point.id)
                    )
                ) {
                    ret.push({
                        result: false,
                        message: '组件输入&nbsp;缺失'
                    });
                }
                // 校验参数
                if (rules.paramRules) {
                    for (let name in params) {
                        const conf = paramsConf.find(item => item.name === name);
                        if (conf && conf.uiType === 'mixedParamBean') {
                            const mixParamsConf = conf.paramsConf;
                            params[name].forEach(param => {
                                for (let c_name in param) {
                                    const mixConf = mixParamsConf.find(
                                        item => item.name === c_name
                                    );
                                    if (
                                        rules.paramRules.hasOwnProperty(c_name) &&
                    (!(mixConf.showAttr && mixConf.showVal) ||
                      (mixConf.showAttr &&
                        mixConf.showVal &&
                        mixConf.showVal.includes(param[mixConf.showAttr])))
                                    ) {
                                        rules.paramRules[c_name].forEach(item => {
                                            let result = this[
                                                item.validator || 'defalutParamValidate'
                                            ](
                                                param[c_name],
                                                item.required,
                                                c_name,
                                                mixConf.label,
                                                param,
                                                mixConf
                                            );
                                            ret.push(
                                                Object.assign(
                                                    {
                                                        message:
                              item.message || `${mixConf.label}&nbsp;缺失`
                                                    },
                                                    result
                                                )
                                            );
                                        });
                                    }
                                }
                            });
                        } else {
                            if (
                                rules.paramRules.hasOwnProperty(name) &&
                (!(conf.showAttr && conf.showVal) ||
                  (conf.showAttr &&
                    conf.showVal &&
                    conf.showVal.includes(params[conf.showAttr])))
                            ) {
                                rules.paramRules[name].forEach(item => {
                                    let result = this[item.validator || 'defalutParamValidate'](
                                        params[name],
                                        item.required,
                                        name,
                                        conf.label,
                                        params,
                                        paramsConf
                                    );
                                    ret.push(
                                        Object.assign(
                                            {
                                                message: item.message || `${conf.label}&nbsp;缺失`
                                            },
                                            result
                                        )
                                    );
                                });
                            }
                        }
                    }
                }
                // 校验资源
                if (node.resource) {
                    for (let key in node.resource) {
                        if (node.resource.hasOwnProperty(key)) {
                            const resInfo = resourceInfo.find(res => res.name === key);
                            if (resInfo && ['cpu', 'mem'].includes(resInfo.type)) {
                                if (!node.resource[key]) {
                                    ret.push(
                                        Object.assign(
                                            {
                                                message: `${resInfo.label}&nbsp;未分配`
                                            },
                                            false
                                        )
                                    );
                                }
                            }
                        }
                    }
                }
                let state = node.state;
                if (ret.filter(item => !item.result).length) {
                    state = nodeState.NOTREADY;
                    isReady = false;
                } else {
                    state = nodeState.READY;
                }
                // 状态改变或者检查结果改变的时候触发更新
                if (node.state !== state || !_.isEqual(ret, node.validateResult)) {
                    needUpdate = true;
                    node.validateResult = ret;
                    node.state = state;
                }
            });
            // 如果是初始化，这里不更新nodes状态，只要更新this.isReady值就行了
            !isInit && needUpdate && this.updateNodes(this.nodes);
            this.isReady = isReady;
            console.timeEnd('参数校验耗时');
            return isReady;
        },
        handleNodesStatusUpdate(statesMap) {
            // 组件运行状态更新
            if (statesMap) {
                this.nodes.forEach(node => {
                    const stateInfo = statesMap[node.id];
                    if (stateInfo) {
                        node.state =
              stateInfo.state === undefined ? nodeState.READY : stateInfo.state;
                        if (nodeState.SUCCESS === stateInfo.state) {
                            node.isFinished = true;
                        } else if (nodeState.FAILED === stateInfo.state) {
                            node.isFinished = false;
                            // 封装错误信息
                            node.failMessage = stateInfo.message || '';
                        } else {
                            node.isFinished = false;
                        }
                        node.executeDetails = Object.assign({}, node.executeDetails, {
                            startTime: stateInfo.startTime || '',
                            stopTime: stateInfo.stopTime || '',
                            runningTime: timeFormat(
                                Date.parse(stateInfo.stopTime) - Date.parse(stateInfo.startTime)
                            ),
                            inputSize: '',
                            outputSize: ''
                        });
                    }
                });
                this.updateNodes(this.nodes);
            }
        },
        handleFunctionOperation(operation) {
            // 画布上方按钮功能区点击
            switch (operation.event) {
                    case 'forward':
                        this.handleForward();
                        break;
                    case 'back':
                        this.handleBack();
                        break;
                    case 'edit':
                        this.failedNeedResume = false;
                        // 这里等校验是为了恢复各个节点的显示状态
                        this.handleComponentParamsValidate();
                        break;
                    case 'save':
                        this.handleModelSave();
                        break;
                    case 'run':
                        this.handleRun();
                        break;
                    case 'stop':
                        this.handleStop();
                        break;
                    case 'resume':
                        this.handleResume();
                        break;
                    case 'zoomin':
                        this.handleZoomIn();
                        break;
                    case 'zoomout':
                        this.handleZoomOut();
                        break;
                    case 'save-as':
                        this.handleModelSaveAs(operation.data);
                        break;
                    case 'clear':
                        this.handleClear();
                        break;
                    case 'timing':
                        this.handleTiming(operation.data);
                        break;
                    case 'exec-setting':
                        this.handleExecSetting(operation.data);
                        break;
                    case 'muti-instance':
                        this.handleMutiInstance(operation.data);
                        break;
                    case 'record':
                        break;
                    case 'warning':
                    case 'zoom':
                    default:
            }
        },
        handleMenuclick(operationName) {
            // 画布中组件右键点击
            const node = this.currentOperationalNode;
            switch (operationName) {
                    case 'copy':
                        {
                            const copyNode = _.cloneDeep(node);
                            const newNodeId = UUID.getUUID();
                            copyNode.points.forEach(el => {
                                el.id = UUID.getUUID();
                                el.nodeId = newNodeId;
                                el.x += 20;
                                el.y += 20;
                            });
                            const newNode = Object.assign({}, copyNode, {
                                id: newNodeId,
                                x: copyNode.x + 20,
                                y: copyNode.y + 20,
                                active: false,
                                executeDetails: {},
                                columnSchema: [],
                                inputSchema: [],
                                state: nodeState.NOTREADY,
                                isFinished: false,
                                validateResult: []
                            });
                            // note: 操作可撤销
                            this.handleAddOperationQueue({
                                operate: 'addNode',
                                revoke: 'removeNode',
                                value: newNode,
                                revokeValue: newNode
                            });
                            this.addNode(newNode);
                        }
                        break;
                    case 'delete':
                        {
                            const tNode = Object.assign({}, node, { active: false });
                            this.removeNodeAndLink(tNode);
                        }
                        break;
                    case 'rename':
                    case 'star':
                        this.contextName = operationName;
                        this.contextDialogVisible = true;
                        break;
                    case 'export':
                        this.contextName = operationName;
                        this.contextDialogVisible = true;
                        break;
                    case 'edit-code':
                        if (node.canEdit) {
                            this.codeEditorVisible = true;
                            this.currentCode = node && node.code || '';
                        } else {
                            this.$sdxuMessageBox.warning({
                                title: '警告',
                                content: '当前组件的代码文件的格式不支持代码编辑。您可以在组件的编辑操作中上传新的代码文件。'
                            });
                        }
                        break;
                    case 'model':
                        this.contextName = 'deployModel';
                        this.contextDialogVisible = true;
                        break;
            }
            this.contextMenuVisible = false;
        },
        handleContextDialog(operation) {
            // 画布组件右键点击后弹框处理
            switch (operation.event) {
                    case 'rename':
                        this.handleComponentRename(operation.data);
                        break;
                    case 'star':
                        this.handleComponentStar(operation.data);
                        break;
                    default:
            }
        },
        transformParams(nodeId) {
            const node = this.nodes.find(node => node.id === nodeId);
            console.log(node);
            function parse(val, type) {
                const parseMethods = {
                    Float: parseFloat,
                    Integer: parseInt,
                    Double: parseFloat,
                    Number: val => +val,
                    String: val => val + ''
                };
                if (!parseMethods[type]) {
                    return val;
                }
                return parseMethods[type](val);
            }
            if (node) {
                let params = node.params;
                let confs = node.paramsConf;
                let parsedParam = {};
                Object.keys(params).forEach(item => {
                    const conf = confs.find(c => c.name === item);
                    if (conf) {
                        parsedParam[item] = parse(params[item], conf.ptype);
                    }
                });
                node.params = parsedParam;
            }
        }
    },
    created() {
        (this.executeId
            ? getWorkflowSnapshot(this.executeId, this.jobId)
            : getflowInfo(this.skyflowId)
        )
            .then(data => {
                const model = data.model_json;
                this.baseInfo = Object.assign(
                    {},
                    {
                        name: data.name,
                        description: data.description,
                        user: data.user,
                        created_at: data.created_at,
                        modified_at: data.modified_at
                    }
                );
                this.executeSetting = {
                    handle_type: data.handle_type || 1,
                    timeout: data.timeout || 1,
                    execute_type: data.execute_type || 0,
                    rerun_instance: data.rerun_instance || 1,
                    manual_instance: data.manual_instance || 1,
                    crontab_instance: data.crontab_instance || 1
                };
                this.isCrontab = !!data.crontab;
                this.flowState = data.state || nodeState.READY;
                this.processType = data.processType || 'PATCH';
                // 判断是否在别人画布中
                this.isCurrentUser = this.currentUser.uuid === data.userId;
                this.zoom = (model && model.zoom) || 100;
                this.updateNodes((model && model.nodes) || []);
                this.updateLinks((model && model.links) || [], true);
                if (data.nodes_status) {
                    this.stateNodeList = data.nodes_status;
                    // 更新上次的运行状态
                    this.handleNodesStatusUpdate(this.stateNodeList);
                }
                this.executeStartTime = dateFormatter(data.running_at) || '';
                this.activeNode =
          (this.nodes && this.nodes.find(node => node.active)) || null;
                this.activeNodeId = (this.activeNode && this.activeNode.id) || '';
                if (this.activeNode) {
                    this.activeNode.nodeState =
            (this.stateNodeList && this.stateNodeList[this.activeNodeId]) ||
            null;
                }
            })
            .catch(e => {
                console.error(e);
                this.processType = 'PATCH';
                this.$notify.error({
                    title: '获取画布信息失败'
                });
            });
    },
    watch: {
        activeNodeId(val, oldval) {
            // 切换节点时，对数据做类型转换
            if (oldval) {
                this.transformParams(oldval);
            }
            // 切换节点，触发schema推导
            if (this.isChangeSetting && this.activeNodeId && this.isEditable) {
                this.handleSchemaDerivation();
                this.isChangeSetting = false;
            }
        },
        isRunning() {
            if (
                this.isRunning &&
        this.executeId &&
        !nodeStatusInterval &&
        !this.isCrontab
            ) {
                this.handleClearOperationQueue();
                this.handleGetRunningStateInterval(this.executeId);
            }
        },
        contextDialogVisible(val) {
            if (!val && this.currentOperationalNode) {
                this.currentOperationalNode = null;
            }
        }
    }
};
</script>

<style lang='scss' scoped>
.skyflow-editor {
  position: relative;
  overflow: auto;
  * {
    margin: 0;
    padding: 0;
  }
  input {
    &::placeholder {
      color: rgba(120, 140, 161, 1);
    }
  }
  .header {
    width: 100%;
    height: 60px;
    min-width: 1366px;
    min-height: 60px;
  }
  .main {
    width: 100%;
    height: calc(100vh - 61px);
    min-width: 1366px;
    min-height: 650px;
    overflow: hidden;
  }
  .left {
    position: relative;
    width: 250px;
    height: 100%;
    float: left;
  }
  .left::after {
    content: " ";
    position: absolute;
    z-index: 3;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    box-shadow: 1px 0px 2px 0px rgba(134, 150, 166, 0.25);
  }
  .middle {
    height: 100%;
    float: left;
    overflow: hidden;
  }
  .right {
    position: relative;
    width: 250px;
    height: 100%;
    float: left;
  }
  .right::after {
    content: " ";
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    box-shadow: -1px 0px 2px 0px rgba(134, 150, 166, 0.25);
  }
  .clearfix::after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
}
</style>
