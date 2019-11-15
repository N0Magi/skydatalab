<template>
    <div
        class="info-right"
        v-if="result"
    >
        <div class="setting-type">
            <hr class="setting-line">
            <span>工作流基本信息</span>
        </div>
        <div>
            <span>工作流名称</span>
            <span>{{ result.name }}</span>
        </div>
        <div>
            <span>工作流描述</span>
            <span>{{ result.description || '无描述' }}</span>
        </div>
        <div>
            <span>创建人</span>
            <span>{{ result.user.fullName }}</span>
        </div>
        <div>
            <span>创建时间</span>
            <span>{{ dateFormatter(result.created_at) }}</span>
        </div>
        <div>
            <span>修改时间</span>
            <span>{{ result.modified_at ? dateFormatter(result.modified_at) : '未修改' }}</span>
        </div>
    </div>
</template>

<script>
import { dateFormatter } from '@sdx/utils/lib/helper/transform';

export default {
    name: 'Info',
    props: {
        result: {
            type: Object,
            default: null
        }
    },
    methods: {
        dateFormatter(time) {
            return dateFormatter(time);
        }
    }
};
</script>

<style lang="scss" scoped>
.info-right {
    & > div:nth-child(n + 2) {
        min-height: 74px;
        padding: 0 20px;
        span {
            display: block;
            line-height: 34px;
        }
        span:first-child {
            font-size: 14px;
            color: rgba(63, 89, 115, 1);
            padding-top: 8px;
        }
        span:last-child {
            font-size: 12px;
            word-break: break-all;
            width: 210px;
            padding-bottom: 4px;
            color: rgba(111, 131, 150, 1);
            border-bottom: 1px solid #ced6de;
        }
    }
    .setting-type {
        width: 250px;
        height: 40px;
        background: rgba(232, 237, 242, 0.91);
        display: flex;
        .setting-line {
            width: 3px;
            height: 12px;
            border-width: 0;
            background-color: rgba(81, 107, 134, 1);
            margin-left: 20px;
            margin-right: 10px;
            float: left;
            align-self: center;
        }
        span {
            font-size: 14px;
            font-weight: bold;
            color: rgba(64, 90, 116, 1);
            align-self: center;
        }
    }
}
</style>
