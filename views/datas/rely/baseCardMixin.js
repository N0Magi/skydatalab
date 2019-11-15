import baseCard from './baseCard';
import { startTask, removeTask, stopTask } from './dataApi';
import { TASK_KIND } from './CONSTS';
import co from 'co';
export default {
    components: { baseCard },
    props: {
        task: {
            type: Object,
            default: null
        },
        cooperate: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        // 处理按钮事件,如果是统一处理,则调用该mixin的方法,如果需要特殊处理,请在对应的card中覆盖对应的方法
        handleBtnClick(type, taskType) {
            // 调用相应的处理函数
            return new Promise((resolve, reject) => {
                if (this[type]) {
                    const ret = this[type](taskType);
                    if (ret instanceof Promise) {
                        ret.then(resolve, reject);
                    } else {
                        resolve();
                    }
                } else {
                    reject();
                    console.error('card action not found ' + type);
                }
            });
        },
        // 启动任务
        start() {
            return new Promise((resolve, reject) => {
                startTask({ _id: this.task._id })
                    .then(() => {
                        resolve();
                        this.$emit('refresh');
                    })
                    .catch(err => {
                        reject();
                    });
            });
        },
        // 停止任务
        kill() {
            return new Promise((resolve, reject) => {
                co(function*(ctx) {
                    yield ctx.$confirm('此操作将终止该任务, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    });
                    yield stopTask({ _id: ctx.task._id });
                    resolve();
                    ctx.$emit('refresh');
                }, this).catch(err => {
                    reject();
                    if (err === 'cancel') {
                        this.$message.info('已取消操作');
                    }
                });
            });
        },
        // 删除任务
        remove() {
            return new Promise((resolve, reject) => {
                co(function*(ctx) {
                    yield ctx.$confirm(
                        '此操作将永久删除该任务, 是否继续?',
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    );
                    yield removeTask({ _id: ctx.task._id });
                    resolve();
                    ctx.$emit('refresh');
                }, this).catch(err => {
                    reject();
                    if (err === 'cancel') {
                        this.$message.info('已取消操作');
                    }
                });
            });
        },
        // 进入详情页
        detail(taskType) {
            // skyflow进入画布
            if (this.task.kind === 15) {
                window.open(`/#/editor/${this.task.skyflow_id}/${this.task._id}`);
            } else if (taskType === 'task') {
                // 跳转数据集
                this.$router.push(
                    `/taskResource/taskInfo/${TASK_KIND[this.task.kind]}/${
                        this.task._id
                    }`
                );
            } else {
                this.$router.push(
                    `/projectManage/taskInfo/${TASK_KIND[this.task.kind]}/${
                        this.task._id
                    }`
                );
            }
            return Promise.resolve();
        },
        // 编辑任务
        edit(taskType) {
            if (this.task.dataFlag) {
                this.$router.push(
                    `/datasManage/modifyTask/${TASK_KIND[this.task.kind]}/${
                        this.task._id
                    }`
                );
            } else if (taskType === 'task') {
                this.$router.push(
                    `/taskResource/modifyTask/${TASK_KIND[this.task.kind]}/${
                        this.task._id
                    }/${this.task.project}`
                );
            } else {
                this.$router.push(
                    `/projectManage/modifyTask/${TASK_KIND[this.task.kind]}/${
                        this.task._id
                    }/${this.task.project}/${this.cooperate}`
                );
            }
            return Promise.resolve();
        }
    }
};
