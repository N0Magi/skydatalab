<template>
    <div class="sdx-slidebar">
        <div class="logo">
            <div
                class="inner"
                :class="{hideLogo:!sidebar.opened}"
            >
                <!-- <wscn-icon-svg
                    iconClass="iconicon-Logo"
                    class="logo-icon"
                /> -->
                <img
                    class="logo-icon"
                    src="@/assets/images/login/SkydataLab.png"
                >
                <i class="iconfont iconico-logoo logo-icon-mini" />
            </div>
        </div>
        <ElScrollbar
            class="sdx--slidebar--scrollbar"
            wrap-class="layout-aside-wrap"
        >
            <SdxMenu :menu-data="permissionRoutes" />
        </ElScrollbar>
    </div>
</template>

<script>
import { leftmenu, manageMenus } from '../../config/menuConfig';
import SdxMenu from '../../components/SdxMenu/index.vue';

export default {
    name: 'Sidebar',
    data() {
        return {
            permissionRoutes: []
        };
    },
    components: {
        SdxMenu
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        }
    },
    mounted() {
        let manageMenusBak = JSON.parse(JSON.stringify(manageMenus));
        let leftmenuBak = JSON.parse(JSON.stringify(leftmenu));
        // if (this.$route.meta.system === 'manage') {
        //     this.permissionRoutes = manageMenusBak.filter(item => {
        //         if (item.auth) {
        //             return this.$auth(item.auth, 'MENU');
        //         } else {
        //             if (item.children) {
        //                 item.children = item.children.filter(child => {
        //                     if (child.auth) {
        //                         return this.$auth(child.auth, 'MENU');
        //                     } else {
        //                         return true;
        //                     }
        //                 });
        //                 return item.children.length > 0;
        //             }
        //             return true;
        //         }
        //     });
        // } else {
        this.permissionRoutes = leftmenuBak.filter(item => {
            if (item.auth) {
                return this.$auth(item.auth, 'MENU');
            } else {
                if (item.children) {
                    item.children = item.children.filter(child => {
                        if (child.auth) {
                            return this.$auth(child.auth, 'MENU');
                        } else {
                            return true;
                        }
                    });
                    return item.children.length > 0;
                }
                return true;
            }
        });
        // }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../assets/styles/base/colors";
    @import "../../assets/styles/base/constants";
    @import "../../assets/styles/base/mixin";
.sdx-slidebar {
    height: 100%;
    width: $ls-siderbar;
    overflow: hidden;
    .logo {
        background: $menu-bg-dark;
        position: relative;
        width: 100%;
        height: $ls-headerbar;
        text-align: center;
        transition: all 0.1s ease-out;
        .inner {
            /*background: url('../../assets/images/logonew.png') no-repeat;*/
            /*background-size:cover;*/
            width: 100%;
            height: 100%;
            position: relative;
            text-align: center;
            line-height: $ls-headerbar;;
            .logo-icon {
                width: 100%;
                padding: 0 15px;
                position: absolute;
                left: 0;
                top: 0;
            }
            img{
                width: 90%;
                margin-top: 20px;
            }
            .logo-icon-mini {
                display: inline-block;
                font-size: 30px;
                position: absolute;
                left: 50%;
                top: 0;
                transform: translate(155px, 0);
                color: $blue;
                transition: transform ease-in .1s;
            }
        }
    }
    .sdx--slidebar--scrollbar {
        flex: 1;
        height: calc(100% - 60px);
        position: relative;
        & /deep/ .layout-aside-wrap {
            height: 100%;
            overflow-x: hidden;
        }
    }
}
</style>
