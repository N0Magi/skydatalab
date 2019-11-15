// @flow

type Option = {
    label: string,
    value: any
}

type inputTypeEnum = 'INPUT' |
    'SELECT' |
    'TEXTAREA' |
    'PASSWORD' |
    'DATETIME' |
    'SWITCH' |
    'LOCAL_UPLOAD' |
    'CEPH_FILE' |
    'ALL_UPLOAD'
    ;

type SkyFormItemCfg = {
    prop: string,
    label: string | (model: any) => string,
    labelTip?: string | Function,
    value: any,
    inputType?: inputTypeEnum | (model: Object) => inputTypeEnum,
    editable?: boolean,
    validator?: Array<Object>,
    options?: Array<Option> | string | Promise<any> | () => Promise<any>,
    placeholder?: string,
    vNode?: Function,
    widgetParams?: Object,
    renderIgnore?: boolean | (model: Object) => boolean,
    hide?: boolean | (model: Object, prop: string) => boolean,
    tooltip?: string;
    tooltipVisible?: boolean | (model: Object, prop: string) => boolean;
    formatter?: ?Function;
}

export class SkyFormItem {
    prop: string; // 在model中的属性，对应ElFormItem中的prop
    label: string | (model: any) => string; // 显示的标签，对应ElFormItem中的label
    labelTip: string | Function = undefined; // 传入字符串或函数时，在右上角显示i图标，鼠标悬浮后展示labelTip定义的内容，可为Render函数
    value: any; // 属性对应的值，对应ElFormItem中的value
    // 输入类型，设置后如无vNode函数，即使用组件默认的组件渲染，目前支持的默认输入类型请查看InputWidgets下SkyFormWidgetInputTypeMap配置
    inputType: inputTypeEnum | () => inputTypeEnum = 'INPUT';
    editable: boolean = true; // 是否支持编辑，为false时为只读模式
    validator: Array<Object> = []; // 校验函数，对应ElForm中的rules配置
    options: Array<Option> | string | Promise<any> | () => Promise<any> = []; // SELECT类型的选项，支持传接口地址或label,value键值对的对象
    placeholder: string = ''; // 占位文字
    vNode: Function = () => undefined; // 自定义渲染函数，可以使用jsx自定义输入方式或其他内容
    widgetParams: Object = {}; // 使用系统默认的组件传参，一些组件比较复杂，可以通过该参数传参
    renderIgnore: boolean | (model: Object) => boolean = false; // 是否忽略对该属性的表单渲染，适用于直接使用slot的场景，主要用于同步model以实现表单校验,不推荐使用slot场景，仅在一些特别复杂的场景使用
    hide: boolean | (model: Object, prop: string) => boolean = false; // 是否隐藏，用于有条件地控制某个表单项显示或隐藏，默认不隐藏
    tooltip: string = ''; // 表单项对应的提示内容
    tooltipVisible: boolean | (model: Object, prop: string) => boolean = false; // 设置表单项对应的提示是否显示
    formatter: ?Function = undefined; // 只读模式下，对数据展示进行格式化处理
    constructor(cfg: SkyFormItemCfg) {
        this.prop = cfg.prop;
        this.label = cfg.label;
        this.labelTip = cfg.labelTip || undefined;
        this.value = cfg.value;
        this.inputType = cfg.inputType || 'INPUT';
        this.editable = cfg.editable === undefined ? true : cfg.editable;
        this.validator = cfg.validator || [];
        this.options = cfg.options || [];
        this.placeholder = cfg.placeholder || '';
        this.vNode = cfg.vNode || '';
        this.widgetParams = cfg.widgetParams || {};
        this.renderIgnore = cfg.renderIgnore || false;
        this.hide = cfg.hide || false;
        this.tooltip = cfg.tooltip || '';
        this.tooltipVisible = cfg.tooltipVisible || false;
        this.formatter = typeof cfg.formatter === 'function' ? cfg.formatter : undefined;
    }
}
