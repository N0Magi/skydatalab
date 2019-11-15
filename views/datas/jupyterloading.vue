<template>
    <div
        class="jupyter-loading"
        v-loading="needPull"
    />
</template>
<script>
import { getTaskDetail } from '@sdx/utils/lib/api/project';
import { getJupyterUrl } from './rely/dataSourceApi';
export default {
    name: 'JupyterLoading',
    data() {
        return {
            external_url: 'url' // 跳转url
        };
    },
    computed: {
        // 是否需要状态拉取
        needPull() {
            return !this.external_url;
        }
    },
    methods: {
        getTaskUrl(id) {
            getTaskDetail(id)
                .then(data => {
                    this.external_url = data.external_url;
                    if (data.external_url) {
                        getJupyterUrl({ dataset: this.$route.params.dataset })
                            .then(res => {
                                let url = `${this.external_url}/notebooks/${res.data.jupyterNobebook}`;
                                window.location.href = url;
                            });
                    }
                });
        },
        startPull() {
            this.pull = window.setInterval(() => {
                this.getTaskUrl(this.$route.params.id);
            }, 5000);
        },
        stopPull() {
            window.clearInterval(this.pull);
            this.pull = undefined;
        }
    },
    created() {
        this.getTaskUrl(this.$route.params.id);
    },
    beforeDestroy() {
        this.stopPull();
    },
    watch: {
        // 如果 state 是 need_pull 状态,则表示需要实时拉取任务状态
        needPull(nval) {
            if (nval) {
                this.startPull();
            } else {
                this.stopPull();
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jupyter-loading {
    height: 100vh;
    line-height: 5vh;
}
</style>
