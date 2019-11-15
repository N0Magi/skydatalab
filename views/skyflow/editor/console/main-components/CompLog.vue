<template>
    <div class="comp-log">
        <div
            class="log-container"
            :style="{'min-height': `${consoleMainHeight - 40}px`}"
        >
            <div class="comp-name">
                <span>{{ node.label }}</span>组件运行日志：
            </div>
            <div
                class="item"
                v-loading="compLogLoading"
            >
                <pre><div
                    v-for="(item, index) in compLog"
                    :key="index"
                >{{ item }}</div></pre>
                <SdxuEmpty
                    v-if="compLog.length === 0 && !compLogLoading"
                    height="354px"
                    empty-type="noData"
                    :empty-content="$t('NoData')"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getCompLog } from '@sdx/utils/lib/api/skyflow';
import { nodeState as nodeStateConf } from '../../js/skyflowConfig';

export default {
    name: 'CompLog',
    componentName: 'CompLog',
    data() {
        return {
            offset: 0,
            compLog: [],
            getCompLogInterval: null,
            compLogLoading: true
        };
    },
    props: {
        node: {
            type: Object,
            default: null
        },
        executeId: {
            type: String,
            default: ''
        },
        consoleMainHeight: {
            type: Number
        },
        jobId: {
            type: String,
            default: ''
        }
    },
    computed: {
        params() {
            return {
                task_id: this.node.nodeState.node_id,
                offset: 0
            };
        },
        nodeState() {
            return this.node.nodeState;
        }
    },
    methods: {
        handleGetCompLog() {
            if (!this.node || !this.node.nodeState || !this.executeId) {
                this.compLogLoading = false;
                return;
            }
            getCompLog({ nid: this.node.nodeState.node_id, offset: this.offset, execute_id: this.executeId, job_id: this.jobId })
                .then(data => {
                    if (data.content) this.compLog.push(data.content);
                    this.offset = data.offset;
                    this.$emit('scrollToBottom');
                    this.stopPull();
                    this.startPull();
                }).finally(() => {
                    this.compLogLoading = false;
                });
        },
        startPull() {
            if (this.node && this.node.nodeState.state && [nodeStateConf.SUCCESS, nodeStateConf.FAILED, nodeStateConf.STOPED, nodeStateConf.FORCESTOPED].indexOf(this.node.nodeState.state) === -1) {
                if (!this.getCompLogInterval) {
                    this.getCompLogInterval = setTimeout(this.handleGetCompLog.bind(this), 1000);
                }
            } else {
                this.stopPull();
            }
        },
        stopPull() {
            clearTimeout(this.getCompLogInterval);
            this.getCompLogInterval = null;
        },
        clearLog() {
            this.compLog = [];
        }
    },
    activated() {
        this.compLogLoading = true;
        this.compLog = [];
        this.offset = 0;
        this.stopPull();
        this.handleGetCompLog();
        this.startPull();
        this.unWatch = this.$watch('node', ({ nodeState }) => {
            if (nodeState && nodeState.state && [nodeStateConf.SUCCESS, nodeStateConf.FAILED, nodeStateConf.STOPED, nodeStateConf.FORCESTOPED].indexOf(nodeState.state) === -1) {
                // 启定时器
                this.startPull();
            } else {
                this.compLogLoading = false;
                this.stopPull();
            }
        }, { deep: true });
    },
    beforeDestroy() {
        this.stopPull();
        this.compLogLoading = false;
    },
    deactivated() {
        this.compLogLoading = false;
        if (this.unWatch) {
            this.unWatch();
        }
        this.stopPull();
    }

};
</script>

<style lang="scss" scoped>
    .comp-log {
        font-size: 14px;
        color: #3f5973;
        min-height: 100%;
        padding: 20px;

        .log-container {
            background: #F8F9FA;
            height: 100%
        }

        .comp-name {
            padding: 0 20px;
            height: 47px;
            line-height: 47px;
            border-bottom: 1px solid #dedede;

            span {
                color: #459cdf;
                margin-right: 6px;
            }
        }

        .item {
            color: #3F5973;
            padding: 0 20px;
            min-height: 200px;

            & > div {
                margin-bottom: 5px;
            }

        }

        pre {
            font-size: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 0;
        }
    }
</style>
