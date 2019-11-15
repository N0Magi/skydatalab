<template>
    <div
        class="recent-updates"
        v-loading="loading"
    >
        <sdxu-content-panel
            :title="title"
            size="small"
        >
            <more-btn
                class="morebtn"
                @getMore="getTaskMore"
            />
            <div
                class="content"
                v-if="nameTimes && nameTimes.length"
            >
                <div
                    class="item"
                    v-for="(item, index) in nameTimes.slice(0, 5)"
                    :key="index"
                >
                    <span
                        :title="item.name"
                        @click="getDetail(type, item.uuid)"
                    >{{ item.name }}</span>
                    <span>{{ getDateDiff(item.time) }}</span>
                </div>
            </div>
            <SdxuEmpty
                v-if="nameTimes.length === 0 && !loading"
                empty-type=""
                :empty-content="$t('NoData')"
                size="small"
            />
        </sdxu-content-panel>
    </div>
</template>

<script>
import MoreBtn from './MoreBtn';
import { getDateDiff } from '@sdx/utils/lib/helper/transform';
export default {
    name: 'RecentUpdates',
    props: {
        title: {
            type: String,
            default: ''
        },
        nameTimes: {
            type: Array,
            default: () => []
        },
        path: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: ''
        }
    },
    components: {
        MoreBtn
    },
    methods: {
        getTaskMore() {
            this.$router.push(this.path);
        },
        getDetail(type, uuid) {
            if (type === 'project') {
                this.$router.push(`/sdxv-project-manage/project-detail/${uuid}`);
            } else if (type === 'skyflow') {
                window.open(`/#/editor/${uuid}`);
            } else if (type === 'model') {
                this.$router.push(`/sdxv-model-manage/versionList/${uuid}`);
            } else if (type === 'dataset') {
                this.$router.push(`/datasManage/dataView/?dataset=${uuid}`);
            }
        },
        // 注册
        getDateDiff
    }
};
</script>
<style lang="scss" scoped>
.recent-updates {
    & /deep/ {
        .sdxu-content-panel__main {
            margin-top: 0;
        }
        .sdxu-content-panel {
            padding: 20px;
            height: 236px;
            margin-bottom: 20px;
            position: relative;
        }
        .morebtn {
            position: absolute;
            top: 10px;
            right: -2px;
        }
        .content {
            .item {
                height: 40px;
                height: 36px;
                display: flex;
                justify-content: space-between;
                span:first-child{
                    font-size:14px;
                    color:#606266;
                    font-family:SourceHanSansCN-Normal;
                    max-width: 78%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }
                span:first-child:hover{
                    color:#5C89FF;
                }
                span:last-child{
                    font-size:12px;
                    color:#909399;
                }
            }
        }
    }
}

.recent-updates .is-lang-en {
    .content {
        .item {
            span:first-child {
                max-width: 68%;
            }
        }
    }
}
</style>

