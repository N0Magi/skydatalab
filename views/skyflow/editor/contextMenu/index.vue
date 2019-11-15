<template>
    <div
        class="context-menu"
        :style="position"
        @contextmenu.prevent
    >
        <div
            class="context-menu__group"
            v-for="(value, key) in menuGroupMap"
            :key="key"
        >
            <div
                v-for="item in value"
                :key="item.name"
                @click="menuClicked(item)"
                class="context-menu__group--item"
                :class="item.disabled ? 'disabled' : ''"
            >
                <!-- <i
                    class="sf-icon"
                    :class="item.icon"
                /> -->
                <span>{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContextMenu',
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        contextX: {
            type: Number,
            default: 0
        },
        contextY: {
            type: Number,
            default: 0
        },
        owner: {}
    },
    computed: {
        position() {
            return {
                top: this.contextY + 'px',
                left: this.contextX + 'px'
            };
        },
        menuGroupMap() {
            const groupMap = {};
            this.menuList.forEach(item => {
                if (groupMap.hasOwnProperty(item.group)) {
                    groupMap[item.group].push(item);
                } else {
                    groupMap[item.group] = [item];
                }
            });
            return groupMap;
        }
    },
    methods: {
        menuClicked(item) {
            if (!item.disabled) {
                if (item.cb) {
                    item.cb(this.owner);
                } else {
                    this.$emit('clickmenu', item.name, this.owner);
                }
            }
        }
    }
};
</script>

<style lang='scss' scoped>
.context-menu {
    margin: 0;
    padding: 0;
    position: absolute;
    z-index:9;
    width: 208px;
    background: #fff;
    border:1px solid rgba(228,231,237,1);
    box-shadow:0px 2px 12px 0px rgba(0,0,0,0.06);
    font-size:14px;
    .context-menu__group {
        padding: 10px 0;
        & + .context-menu__group {
            box-shadow: 0px -1px 0px 0px rgba(228,231,237,1);
        }
        .context-menu__group--item {
            padding: 0 14px;
            width: 208px;
            height: 36px;
            line-height: 36px;
            color:rgba(96,98,102,1);
            &:hover {
                background:rgba(242,246,252,0.6);
                color: #4781F8;
                font-weight: 500;
                cursor: pointer;
            }
        }
        & > .disabled {
            cursor: not-allowed;
            color: #a3b1bf;
            &:hover {
                color: #a3b1bf;
                cursor: not-allowed;
            }
            & > span{
                color:#a3b1bf !important;
            }
        }
    }
}
</style>
