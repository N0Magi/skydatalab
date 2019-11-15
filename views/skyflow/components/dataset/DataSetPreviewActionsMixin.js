import Clickoutside from '../../../../directives/clickoutside';
import tableLoadmore from '../../../../directives/tableLoadmore';
export default {
    data() {
        const self = this;
        const filterOptions = {
            label: '过滤',
            value: 'FILTER',
            children: [
                {
                    value: 'GT',
                    label: '>',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('FILTER', 'GT', value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                },
                {
                    value: 'LT',
                    label: '<',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('FILTER', 'LT', value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                },
                {
                    value: 'ET',
                    label: '=',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('FILTER', 'ET', value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                }
            ]
        };
        return {
            menuDataNum: [
                {
                    label: '分析',
                    value: 'DESCRIBE',
                    cancelable: true
                },
                {
                    label: '正向排序',
                    value: 'ASCSORT'
                },
                {
                    label: '反向排序',
                    value: 'DESCSORT'
                },
                {
                    label: '隐藏此列',
                    value: 'DROPCOLUMN'
                },
                {
                    label: '克隆此列',
                    value: 'CLONE'
                },
                {
                    label: '重命名此列',
                    value: 'RENAME',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('RENAME', null, value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                },
                {
                    ...filterOptions
                },
                {
                    label: '数据转换',
                    value: 'TRANSFORM',
                    children: [
                        // {
                        //     label: 'impute',
                        //     value: 'impute'
                        // },
                        {
                            label: '空值替换',
                            value: 'NULLTRANSFORM',
                            children: [
                                {
                                    type: 'vNode',
                                    value: '',
                                    vNode(h) {
                                        let value = this.value || '';
                                        const event = {
                                            on: {
                                                click: () => {
                                                    self.menu.excuteAction('TRANSFORM', 'NULLTRANSFORM', value);
                                                }
                                            }
                                        };
                                        const inputEvent = {
                                            on: {
                                                input(e) {
                                                    value = e;
                                                }
                                            }
                                        };
                                        return (
                                            <div
                                                style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                                <el-input type="text" {...inputEvent} style="width:130px"/>
                                                <el-button type="primary" size="small" {...event}
                                                    style="margin-left: 10px;">确定
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            ]
                        }
                        // {
                        //     label: 'Vectorize',
                        //     value: 'Vectorize'
                        // },
                        // {
                        //     label: 'Ceiling',
                        //     value: 'Ceiling'
                        // },
                        // {
                        //     label: 'Floor',
                        //     value: 'Floor'
                        // },
                        // {
                        //     label: 'Round',
                        //     value: 'Round'
                        // },
                        // {
                        //     label: 'ToDegrees',
                        //     value: 'ToDegrees'
                        // }
                    ]
                }
            ],
            menuDataString: [
                // {
                //     label: '分析',
                //     value: 'DESCRIBE',
                //     cancelable: true
                // },
                {
                    label: '正向排序',
                    value: 'ASCSORT'
                },
                {
                    label: '反向排序',
                    value: 'DESCSORT'
                },
                {
                    label: '隐藏此列',
                    value: 'DROPCOLUMN'
                },
                {
                    label: '克隆此列',
                    value: 'CLONE'
                },
                {
                    label: '重命名此列',
                    value: 'RENAME',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('RENAME', null, value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                },
                {
                    label: '过滤',
                    value: 'FILTER',
                    children: [
                        {
                            type: 'vNode',
                            value: '',
                            vNode(h) {
                                let value = this.value || '';
                                const event = {
                                    on: {
                                        click: () => {
                                            self.menu.excuteAction('FILTER', null, value);
                                        }
                                    }
                                };
                                const inputEvent = {
                                    on: {
                                        input(e) {
                                            value = e;
                                        }
                                    }
                                };
                                return (
                                    <div
                                        style="display: flex;width:240px;align-items: center;justify-content: space-between;">
                                        <span>包含</span>
                                        <el-input type="text" {...inputEvent} style="width:130px"/>
                                        <el-button type="primary" size="small" {...event}
                                            style="margin-left: 10px;">确定
                                        </el-button>
                                    </div>
                                );
                            }
                        }
                    ]
                },
                {
                    label: '数据转换',
                    value: 'TRANSFORM',
                    children: [
                        {
                            label: '转换为小写',
                            value: 'LOWERCASE'
                        },
                        {
                            label: '转换为大写',
                            value: 'UPPERCASE'
                        },
                        {
                            label: 'Trim',
                            value: 'TRIM'
                        },
                        {
                            label: '空值替换',
                            value: 'NULLTRANSFORM',
                            children: [
                                {
                                    type: 'vNode',
                                    value: '',
                                    vNode(h) {
                                        let value = this.value || '';
                                        const event = {
                                            on: {
                                                click: () => {
                                                    self.menu.excuteAction('TRANSFORM', 'NULLTRANSFORM', value);
                                                }
                                            }
                                        };
                                        const inputEvent = {
                                            on: {
                                                input(e) {
                                                    value = e;
                                                }
                                            }
                                        };
                                        return (
                                            <div
                                                style="display: flex;width:200px;align-items: center;justify-content: space-between;">
                                                <el-input type="text" {...inputEvent} style="width:130px"/>
                                                <el-button type="primary" size="small" {...event}
                                                    style="margin-left: 10px;">确定
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    },
    directives: {
        Clickoutside,
        loadmore: tableLoadmore
    }
};
