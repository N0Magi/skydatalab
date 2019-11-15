<template>
    <div class="flow-function clearfix">
        <div class="back_logo">
            <!-- <i class='sf-icon sf-fanhui'></i> -->
            <span class="logo">
                {{ flowName }}
            </span>
        </div>
        <div class="tools-container">
            <span
                v-for="item in stepOperation"
                :key="item.name"
                :class="{'operation-prohibit': !judgeButtonOperationable (item.name)}"
                @click="judgeButtonOperationable (item.name) ? handleOperationClick(item.name) : false"
            >
                <i
                    class="sf-icon"
                    :class="item.icon"
                />
                <div>{{ item.label }}</div>
            </span>
            <hr class="operate-line">
            <span
                v-for="item in saveOperation"
                :key="item.name"
                :class="{'operation-prohibit': !judgeButtonOperationable (item.name)}"
                @click="judgeButtonOperationable (item.name) ? handleOperationClick(item.name) : false"
            >
                <i
                    class="sf-icon"
                    :class="item.icon"
                />
                <div>{{ item.label }}</div>
            </span>
            <hr class="operate-line">
            <span
                v-for="item in execOperation"
                :key="item.name"
                :class="{'operation-prohibit': !judgeButtonOperationable (item.name)}"
                @click="judgeButtonOperationable (item.name) ? handleOperationClick(item.name) : false"
            >
                <i
                    class="sf-icon"
                    :class="item.icon"
                />
                <div>{{ item.label }}</div>
            </span>
            <hr class="operate-line">
            <span>
                <span
                    v-for="item in viewOperation"
                    style="margin: 0 1px;align-self: flex-start"
                    :key="item.name"
                    :class="{'operation-prohibit': !judgeButtonOperationable (item.name)}"
                    @click="judgeButtonOperationable (item.name) ? handleOperationClick(item.name) : false"
                >
                    <i
                        class="sf-icon"
                        :class="item.icon"
                    />
                    <div
                        class="zoom-value"
                        v-if="item.name === 'zoom'"
                    >
                        {{ zoom + "%" }}
                    </div>
                </span>
            </span>
        </div>
        <div
            v-if="isExecute"
            class="execute_tag"
        >
            <div class="execute_title">
                执行记录页面
            </div>
            <div class="execute_time">
                执行开始时间: {{ executeStartTime }}
            </div>
        </div>
        <!-- 弹框 -->
        <component
            class="modal"
            v-if="detailDialogVisible"
            :is="modalName"
            :detail-dialog-visible.sync="detailDialogVisible"
            :execute-setting="executeSetting"
            @confirm="$emit('operate', $event)"
        />
    </div>
</template>

<script>
import {
    stepOperation,
    saveOperation,
    execOperation,
    viewOperation
} from '../js/skyflowConfig';
import * as modalDialog from './modalDialog';
export default {
    name: 'FlowFunction',
    components: {
        ...modalDialog
    },
    props: {
        skyflowId: {
            type: String,
            required: true
        },
        flowName: {
            type: String,
            default: ''
        },
        zoom: {
            type: Number,
            required: true
        },
        forwardAble: {
            type: Boolean,
            default: false
        },
        backAble: {
            type: Boolean,
            default: false
        },
        isRunning: {
            type: Boolean,
            default: false
        },
        isResume: {
            type: Boolean,
            default: false
        },
        isReady: {
            type: Boolean,
            default: false
        },
        isCurrentUser: {
            type: Boolean,
            default: true
        },
        isExecute: {
            type: Boolean,
            default: false
        },
        isCrontab: {
            type: Boolean,
            default: false
        },
        isStream: {
            type: Boolean,
            default: false
        },
        executeSetting: {
            type: Object,
            default: null
        },
        executeStartTime: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            stepOperation,
            saveOperation,
            viewOperation,
            modalName: '',
            detailDialogVisible: false
        };
    },
    computed: {
        execOperation() {
            const filterSet = new Set(['warning', 'record']);
            if (this.isResume) {
                filterSet.add('run');
                filterSet.add('stop');
            } else if (this.isRunning) {
                filterSet.add('resume');
                filterSet.add('edit');
                filterSet.add('run');
            } else {
                filterSet.add('stop');
                filterSet.add('resume');
                filterSet.add('edit');
            }
            if (this.isExecute) {
                // 执行记录不显示定时设置、多实例设置
                filterSet.add('timing');
                filterSet.add('muti-instance');
            }
            if (this.isStream) {
                filterSet.add('timing');
                filterSet.add('muti-instance');
                filterSet.add('exec-setting');
            }
            return execOperation.filter(el => !filterSet.has(el.name));
        }
    },
    methods: {
        handleOperationClick(name) {
            switch (name) {
                    case 'forward':
                    case 'back':
                    case 'save':
                    case 'run':
                    case 'stop':
                    case 'zoomin':
                    case 'zoomout':
                        this.$emit('operate', { event: name });
                        break;
                    case 'save-as':
                    case 'clear':
                    case 'timing':
                    case 'exec-setting':
                    case 'muti-instance':
                    case 'record':
                    case 'resume':
                    case 'edit':
                        this.setModalName(name);
                        break;
                    case 'warning':
                    case 'zoom':
                    default:
                    // pass
                        break;
            }
        },
        judgeButtonOperationable(name) {
            let able = true;
            switch (name) {
                    case 'forward':
                        able =
            this.isCurrentUser &&
            this.forwardAble &&
            !this.isResume &&
            !this.isCrontab;
                        break;
                    case 'back':
                        able =
            this.isCurrentUser &&
            this.backAble &&
            !this.isResume &&
            !this.isCrontab;
                        break;
                    case 'stop':
                        able =
            this.isCurrentUser &&
            this.isRunning &&
            !this.isResume &&
            !this.isCrontab;
                        break;
                    case 'run':
                    case 'timing':
                        able =
            this.isCurrentUser &&
            !this.isRunning &&
            this.isReady &&
            !this.isResume &&
            !this.isCrontab;
                        break;
                    case 'edit':
                    case 'resume':
                        able = this.isCurrentUser && this.isResume && !this.isCrontab;
                        break;
                    case 'save':
                    case 'save-as':
                    case 'clear':
                    case 'exec-setting':
                    case 'muti-instance':
                        able =
            this.isCurrentUser &&
            !this.isRunning &&
            !this.isResume &&
            !this.isCrontab;
                        break;
                    case 'warning':
                    case 'record':
                    // 去掉
                        break;
                    case 'zoomin':
                        able = this.zoom > 50;
                        break;
                    case 'zoomout':
                        able = this.zoom < 200;
                        break;
                    case 'zoom':
                    default:
                        able = true;
            }
            return able;
        },
        setModalName(name) {
            this.modalName = name;
            this.detailDialogVisible = true;
        }
    }
};
</script>

<style lang='scss' scoped>
.flow-function {
  position: relative;
  * {
    margin: 0;
    padding: 0;
    // 文字不可选中
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  width: 100%;
  height: 100%;
  background: rgba(192, 205, 217, 1);
  box-shadow: 0px 3px 3px -1px rgba(172, 186, 200, 0.29);
  color: rgba(63, 89, 115, 1);
  display: flex;
  .back_logo {
    width: 250px;
    padding-left: 18px;
    font-size: 14px;
    float: left;
    align-self: center;
    & > i {
      margin-right: 3px;
      font-size: 20px;
    }
    & > span {
      height: 28px;
      font-size: 14px;
      font-family: siyuan-bd;
      font-weight: bold !important;
      line-height: 28px;
      /* 名称超过两行显示... */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: block;
    }
  }
  .execute_tag {
    padding: 14px;
    .execute_title {
      font-size: 14px;
      font-weight: bold !important;
      margin-bottom: 5px;
    }
    .execute_time {
      font-size: 10px;
    }
  }
  .tools-container {
    justify-content: center;
    display: flex;
    align-items: center;
    align-self: center;
    overflow: hidden;
    width: calc(100% - 250px - 250px);
    & > span {
      width: 9%;
      &:last-child {
        display: flex;
        justify-content: center;
      }
    }
    & > span {
      list-style: none;
      text-align: center;
      float: left;
      cursor: pointer;
      & > span {
        list-style: none;
        text-align: center;
        float: left;
        cursor: pointer;
      }
      & > i,
      & > span > i {
        font-size: 18px;
      }
      & > div,
      & > span > div {
        font-size: 12px;
        font-family: siyuan-rg;
        color: rgba(63, 89, 115, 1);
        line-height: 16px;
        margin-top: 6px;
        width: auto;
        white-space: nowrap;
      }
      &:hover,
      & > span:hover {
        color: rgba(69, 156, 223, 1);
      }
      &:last-child:hover {
        color: rgba(63, 89, 115, 1);
      }
      & > .zoom-value,
      & > span > .zoom-value {
        width: 32px;
      }
    }
    & > .operation-prohibit {
      color: #a3b1bf;
      cursor: not-allowed;
      &:hover {
        color: #a3b1bf;
      }
    }
  }
  hr.operate-line {
    width: 1px;
    height: 24px;
    background: rgba(63, 89, 115, 0.2421);
    margin: 0 15px;
    border-width: 0;
    align-self: center;
  }
}
</style>
