<template>
    <div class="dashboard_morebtn">
        <SdxuButton
            type="primary"
            size="regular"
            :plain="true"
            @click="$emit('getMore')"
        >
            {{ ((lang$ === 'en') && (1500 > clientWidth )) ? '' : $t('dashboard.more') }}
            <i class="iconfont iconicon-arrow-right" />
        </SdxuButton>
    </div>
</template>

<script>
import { getClientWidth } from '@sdx/utils/lib/helper/dom';
import { debounce } from '../../helper/common-fun';
export default {
    name: 'MoreBtn',
    data() {
        return {
            clientWidth: 1500
        };
    },
    methods: {
        getClientWidth
    },
    mounted() {
        this.clientWidth = getClientWidth();
        this.__resizeHanlder = debounce(() => {
            this.clientWidth = getClientWidth();
        }, 300);
        window.addEventListener('resize', this.__resizeHanlder);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHanlder);
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
.dashboard_morebtn {
    .iconfont {
        font-size: 12px;
    }
    .sdxu-button__main {
        font-size: 12px;
        color: #5C89FF;
    }
}
</style>