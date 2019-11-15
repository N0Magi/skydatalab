<script>
export default {
    name: 'CascadeDropdown',
    data() {
        return {
            activeMenus: []
        };
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        },
        activeOptions: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        excuteAction(...value) {
            this.activeMenus = value;
            this.$emit('pick', this.activeMenus);
        }
    },
    mounted() {
        this.options.forEach(item => item.childVisible = false);
    },
    watch: {
        visible() {
            this.activeMenus = [];
        }
    },
    render(h) {
        let depth = 1;
        const self = this;
        const { visible } = this;
        const calcPosClass = () => {
            const rect = self.$el && self.$el.getBoundingClientRect();
            let posClass = '';
            if (rect) {
                if ((window.innerWidth - rect.left) < (rect.width * 3 + 80)) {
                    posClass = 'reverse';
                }
            }
            return posClass;
        };
        const createVnode = vNode => (
            <ul class={['cascade-dropdown', 'child-vnode', `${calcPosClass()}`]}>
                <li class="cascade-dropdown-item vnode">
                    {vNode}
                </li>
            </ul>
        );
        const cascadeDropdown = (options, depth, isChild) => (
            <ul class={['cascade-dropdown', `depth-${depth} ${calcPosClass()} ${isChild && 'child' || ''}`]}
                v-show={visible} ref="menus">
                {
                    options.map((item, index) => {
                        const event = {
                            on: {
                                click(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isChild) {
                                        self.activeMenus = [];
                                    }
                                    if (item.children && item.children.length > 0) {
                                        if (item.depth === self.activeMenus.length) {
                                            self.activeMenus[self.activeMenus.length - 1] = item.value;
                                        } else {
                                            if (item.depth < self.activeMenus.length) {
                                                self.activeMenus = self.activeMenus.slice(0, item.depth - 1);
                                                self.activeMenus.push(item.value);
                                            } else {
                                                self.activeMenus.push(item.value);
                                            }
                                        }
                                        self.$forceUpdate();
                                    } else {
                                        if (item.depth === self.activeMenus.length) {
                                            self.activeMenus[self.activeMenus.length - 1] = item.value;
                                        } else {
                                            if (item.depth < self.activeMenus.length) {
                                                self.activeMenus = self.activeMenus.slice(0, item.depth - 1);
                                                self.activeMenus.push(item.value);
                                            } else {
                                                self.activeMenus.push(item.value);
                                            }
                                        }
                                        self.$forceUpdate();
                                        self.$emit('pick', self.activeMenus);
                                    }
                                }
                            }
                        };
                        let childrenVisible = false;
                        if (item.children && item.children.length > 0) {
                            if (item.value === self.activeMenus[depth - 1]) {
                                childrenVisible = true;
                            }
                        }
                        item.depth = depth;
                        const isMenuActive = !!self.activeOptions.find(o => {
                            if (o[depth - 1]) {
                                return o[depth - 1] === item.value;
                            } else {
                                return false;
                            }
                        }) && item.cancelable;
                        const menuClass = isMenuActive ? 'active' : '';
                        return (
                            <li { ...event } class={['cascade-dropdown-item', `${menuClass}`]} key={index}>
                                <span class="menu-label">
                                    <i class="el-icon-check" v-show={isMenuActive}/>
                                    {item.label}
                                </span>
                                {
                                    item.children && item.children.length > 0 && <i class="el-icon-arrow-right"/>
                                }
                                {
                                    childrenVisible && (item.children[0].type === 'vNode' ? createVnode(item.children[0].vNode(h), depth + 1) : cascadeDropdown(item.children, depth + 1, true))
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
        return (
            cascadeDropdown(_.cloneDeep(this.options), depth)
        );
    }
};
</script>

<style lang="scss" scoped>
    .cascade-dropdown {
        position: absolute;
        background: #fff;
        font-size: 12px;
        list-style: none;
        padding: 0;
        margin: 10px 0;
        width: 140px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        .cascade-dropdown-item {
            position: relative;
            border: 1px solid #dedede;
            width: 100%;
            height: 30px;
            line-height: 30px;
            padding: 0 10px 0 30px;
            span {
                cursor: default;
            }
            .el-icon-arrow-right {
                position: absolute;
                right: 5px;
                top: 8px;
                font-size: 14px;
                color: #ccc;
            }
            &.vnode {
                width: auto;
                height: auto;
                background: #fff;
                display: inline-block;
                padding: 10px;
                & /deep/ .el-input {
                    input {
                        height: 32px;
                        line-height: 32px;
                    }
                }
            }
            &.active {
                span.menu-label {
                    position: relative;
                    i.el-icon-check {
                        position: absolute;
                        left: -22px;
                        top: -3px;
                        width: 20px;
                        height: 20px;
                        font-size: 16px;
                    }
                }
            }
            &:hover {
                background: #f2f2f2;
            }
            & + .cascade-dropdown-item {
                border-top: none;
            }
            .cascade-dropdown {
                z-index: 5;
                &.child {
                    position: absolute;
                    left: 100%;
                    top: 0;
                    width: 100%;
                    height: auto;
                    margin: 0;
                    &.reverse {
                        left: -100%;
                    }
                }
                &.child-vnode {
                    position: absolute;
                    left: 100%;
                    top: 0;
                    width: auto;
                    height: auto;
                    margin: 0;
                    transform: translateX(0);
                    &.reverse {
                        left: 0;
                        transform: translateX(-100%);
                    }
                }
            }
        }
    }
</style>
