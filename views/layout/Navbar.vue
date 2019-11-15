<template>
    <div class="navbar">
        <!-- <i
            class="iconfont iconicon-shousuo toggle-icon"
            @click="toggleSideBar"
        /> -->
        <img
            v-if="sidebar.opened"
            class="toggle-icon"
            src="@/assets/images/smallMenu.png"
            alt=""
            @click="toggleSideBar"
        >
        <img
            v-if="!sidebar.opened"
            class="toggle-icon"
            src="@/assets/images/bigMenu.png"
            alt=""
            @click="toggleSideBar"
        >
        <avatar />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import errLogStore from 'store/errLog';
import avatar from './avatar';
export default {
    components: {
        avatar
    },
    data() {
        return {
            log: errLogStore.state.errLog,
            isShow: true
        };
    },
    computed: {
        ...mapGetters(['sidebar'])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar');
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../assets/styles/base/mixin.scss";
@import "../../assets/styles/base/colors.scss";
@import "../../assets/styles/base/constants.scss";

.navbar {
    height: $ls-headerbar;
    line-height: $ls-headerbar;
    border-radius: 0px !important;
    z-index: 3;
    min-width: 800px;
    background: white;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: $ls-content-margin;
    width: 100%;
    box-shadow: 0 2px 4px 0 rgba(206,213,221,0.45);
    .toggle-icon {
        padding: 0 10px;
        cursor: pointer;
        height: 20px;
    }
}
</style>
