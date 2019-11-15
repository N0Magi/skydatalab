<template>
    <section class="app-main">
        <div class="app-main-breadcrumb">
            <SdxwBreadcrumb />
        </div>
        <div class="app-main-view">
            <!--            <feb-alive>-->
            <router-view />
            <!--            </feb-alive>-->
        </div>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'AppMain',
    computed: {
        ...mapState({
            guideVisible: state => state.app.guide.visible,
            guideShown: state => state.app.guide.neverShow
        }),
        key() {
            return this.$route.name !== undefined
                ? this.$route.name + +new Date()
                : this.$route + +new Date();
        }
    },
    mounted() {
        // 判断显示guide
        this.toggleGuide();
    },
    methods: {
        ...mapActions(['toggleGuide'])
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../assets/styles/base/mixin.scss";
    @import "../../assets/styles/base/colors.scss";
    @import "../../assets/styles/base/constants.scss";

	.app-main {
        width: 100%;
		height: calc(100% - 60px);
        flex: 1;
        .app-main-breadcrumb {
            line-height: 48px;
            height: 48px;
            padding:0 20px;
            display: flex;
            align-items: center;
            background: #e4edf9;
        }
        .app-main-view {
            overflow: auto;
            height: calc(100% - 48px);
            padding: 20px;
        }
	}
</style>
