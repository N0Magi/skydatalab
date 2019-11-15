<template>
    <div
        class="skyflow-console"
        :class="{collapse:collapse, animate: animate}"
        :style="{transform: `translateY(${transformY}px)`}"
    >
        <div
            class="handler"
            @mousedown.prevent="onMouseDown"
            v-show="!collapse"
        />
        <div class="console-tab">
            <div
                v-for="(item, index) in consoleComps"
                :key="index"
                :class="{active: activeIndex === index}"
                class="console-item"
                @click="activeIndex = index;collapse = false"
            >
                <span>{{ item.label }}</span>
            </div>
            <!--<span class="resultExportIcon" @click="resultExportShow=true">评估结果导出</span>-->
            <!--<resultExport :resultExportShow.sync="resultExportShow"></resultExport>-->
            <i
                :class="collapse?'el-icon-arrow-up':'el-icon-arrow-down'"
                class="arrow"
                @click="collapse=!collapse"
            />
        </div>
        <div
            class="console-main"
            ref="consoleMain"
            @scroll="handleScroll"
            :style="{height: `${consoleMainHeight}px`}"
        >
            <keep-alive>
                <component
                    :is="activeComp && activeComp.comp"
                    :node="node"
                    :preview-type="node && node.previewType"
                    :execute-id="executeId"
                    :job-id="jobId"
                    :flow-state="flowState"
                    @scrollToBottom="scrollToBottom"
                    :is-reach-bottom.sync="isReachBottom"
                    :collapse="collapse"
                    :console-main-height="consoleMainHeight"
                    @workflow-start="onStart"
                    ref="comp"
                />
            </keep-alive>
        </div>
    </div>
</template>

<script>
import * as ConsoleMain from './main-components';
import resultExport from './resultExport';

export default {
    name: 'Index',
    components: {
        ...ConsoleMain,
        resultExport
    },
    data() {
        return {
            activeIndex: 0,
            resultExportShow: false, // 评估结果导出
            contentHeight: 0,
            consoleMainHeight: 295,
            isDragging: false,
            isReachBottom: false
        };
    },
    props: {
        // 画布选中组件
        node: {
            type: Object,
            default: () => ({})
        },
        nodeId: {
            type: String
        },
        expand: {
            default: false,
            type: Boolean
        },
        executeId: {
            type: String,
            default: ''
        },
        jobId: {
            type: String,
            default: ''
        },
        flowState: {
            type: Number,
            default: 0

        }
    },
    computed: {
        consoleComps() {
            const comps = [{
                comp: 'OutputPreview',
                label: '输出预览',
                flag: !_.isEmpty(this.node)
            }, {
                comp: 'CompLog',
                label: '组件日志',
                flag: !_.isEmpty(this.node)
            }, {
                comp: 'WorkFlowLog',
                label: '工作流日志',
                flag: true
            }];
            let showComps = comps.filter(item => item.flag);
            if (this.activeIndex >= showComps.length) {
                this.activeIndex = 0;
            }
            return showComps;
        },
        activeComp() {
            return this.consoleComps[this.activeIndex];
        },
        collapse: {
            get() {
                return !this.expand;
            },
            set(val) {
                this.$emit('update:expand', !val);
            }
        },
        transformY() {
            if (this.collapse) {
                return -40;
            } else {
                return -(this.consoleMainHeight + 41);
            }
        },
        animate() {
            return !this.isDragging;
        }
    },
    methods: {
        checkReachBottom() {
            let con = this.$refs.consoleMain;
            return (con.scrollTop + con.clientHeight) === con.scrollHeight;
        },
        scrollToBottom() {
            if (this.isReachBottom && this.activeComp && this.activeComp.comp !== 'OutputPreview') {
                let con = this.$refs.consoleMain;
                this.$nextTick(() => {
                    this.contentHeight = con.querySelector('div').clientHeight;
                    con.scrollTop = this.contentHeight;
                });
            }
        },
        handleScroll() {
            this.isReachBottom = this.checkReachBottom();
        },
        onMouseDown(e) {
            this.isDragging = true;
            this.startY = e.clientY;
        },
        onMouseMove(e) {
            if (this.isDragging) {
                e.preventDefault();
                this.moveY = e.clientY;
                this.consoleMainHeight -= (this.moveY - this.startY);
                this.consoleMainHeight = this.consoleMainHeight > window.innerHeight - 150 ? window.innerHeight - 150 : this.consoleMainHeight;
                this.consoleMainHeight = this.consoleMainHeight > 0 ? this.consoleMainHeight : 0;
                this.startY = this.moveY;
            }
        },
        onMouseUp(e) {
            if (this.isDragging) {
                this.upY = e.clientY;
                this.consoleMainHeight -= (this.upY - this.startY);
                this.consoleMainHeight = this.consoleMainHeight > window.innerHeight - 150 ? window.innerHeight - 150 : this.consoleMainHeight;
                this.consoleMainHeight = this.consoleMainHeight > 0 ? this.consoleMainHeight : 0;
            }
            this.isDragging = false;
        },
        listenDocumentMouseEvent() {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        },
        removeDocumentMouseEvent() {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        },
        onStart() {
            this.$refs.comp.clearLog && this.$refs.comp.clearLog();
        }
    },
    mounted() {
        this.listenDocumentMouseEvent();
    },
    beforeDestroy() {
        this.removeDocumentMouseEvent();
    }
};
</script>

<style lang="scss" scoped>
.skyflow-console {
    position: relative;
    transform: translate(0,-336px);
    z-index: 2;
    &.animate {
        transition: all ease-in 0.38s;
    }
    .console-main{
        background: #fff;
        height: 295px;
        overflow-y: auto;
    }
    &.collapse{
        transform: translate(0,-40px);
        transition: 0.38s;
    }
    .handler {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        cursor: row-resize;
        z-index: 5;
    }
    .console-tab {
        display: flex;
        height: 41px;
        background: rgba(209, 221, 230, 1);
        color: #3f5973;
        line-height: 41px;
        font-size:14px;
        font-family:siyuan-bd;
        font-weight:bold;
        .console-item {
            padding: 0 20px;
            cursor:pointer;
        }
        .active {
            color: #459cdf;
            background: #fff;
        }
        .resultExportIcon{
             position: absolute;
             right: 100px;
        }
        .arrow{
            position: absolute;
            right: 20px;
            top: 12px;
            font-size: 20px;
            cursor: pointer;
        }
    }
}
</style>
