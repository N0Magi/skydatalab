// @flow
import { SkyFormItem } from './SkyFormItem';

type SkyFormCfg = {
    list: Array<SkyFormItem>,
    readonly?: boolean,
    labelWidth?: string | number,
    inline?: boolean,
    labelPosition?: 'top' | 'left' | 'right',
    appendFooter?: boolean
};

export class SkyFormMain {
    list: Array<SkyFormItem> = [];
    readonly: boolean = false;
    labelWidth: string | number = '100px';
    inline: boolean = false;
    labelPosition: 'top' | 'left' | 'right' = 'right';
    customModel: Object = {};
    initialModel: Object = {};
    appendFooter: boolean = false;
    constructor(cfg: SkyFormCfg, customModel?: Object) {
        this.list = cfg.list;
        this.readonly = cfg.readonly || false;
        this.labelWidth = cfg.labelWidth || '100px';
        this.inline = cfg.inline || false;
        this.labelPosition = cfg.labelPosition || 'right';
        this.appendFooter = cfg.appendFooter || false;
        this.customModel = customModel || {};
        this.initialModel = this.buildInitialModel();
    }
    buildInitialModel(): Object {
        let temp = {};
        this.list.forEach(item => {
            temp[item.prop] = item.value;
        });
        return { ...temp, ...this.customModel };
    }
    push(item: SkyFormItem): void {
        this.list.push(item);
        this.initialModel[item.prop] = item.value;
    }
    pop(): SkyFormItem {
        const popItem = this.list.pop();
        delete this.initialModel[popItem.prop];
        return popItem;
    }
    insertAtIndex(item: SkyFormItem, index: number): void {
        if (index > 0 && index < this.list.length) {
            this.list.splice(index, 0, item);
            this.initialModel[item.prop] = item.value;
        } else {
            throw new Error('can\'t find index: ' + index);
        }
    }

    /**
     * 移除指定下标的表单项
     * @param index[number]
     */
    removeAtIndex(index: number): void {
        if (index > 0 && index < this.list.length) {
            const removeItemProp = this.getPropByIndex(index);
            delete this.initialModel[removeItemProp];
            this.list.splice(index, 1);
        } else {
            throw new Error('can\'t find index: ' + index);
        }
    }
    removeByProp(prop: string): void {
        const index = this.findIndexByProp(prop);
        if (index >= 0) {
            this.removeAtIndex(index);
        }
    }
    findByProp(prop: string): ?SkyFormItem {
        return this.list.find((item: SkyFormItem): boolean => item.prop === prop);
    }
    findIndexByProp(prop: string): number {
        return this.list.findIndex((item: SkyFormItem): boolean => item.prop === prop);
    }
    setValueByProp(prop: string, value: any): void {
        const formItem: ?SkyFormItem = this.findByProp(prop);
        formItem && (formItem.value = value);
    }
    getPropByIndex(index: number): string {
        return this.list[index].prop;
    }
    resetForm(): Object {
        this.list.forEach(item => {
            item.value = this.initialModel[item.prop];
        });
        return this.initialModel;
    }
    setModel(model: any): Array<SkyFormItem> {
        this.list.forEach(item => {
            item.value = typeof model[item.prop] === 'undefined' ? item.value : model[item.prop];
        });
        return this.list;
    }
}
