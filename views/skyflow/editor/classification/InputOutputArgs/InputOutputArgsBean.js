export class InputOutputArgsBean {
    constructor(params = {}, argList) {
        this.value = params.value || '';
        this.desc = params.desc || '';
        this.ptype = params.ptype || 'DATAFRAME-FILE';
        this.multi = params.multi || false;
        this.stype = params.stype || (params.multi ? [] : '');
        this.argList = argList;
    }

    initRules() {
        return {
            value: [
                {
                    required: true, message: '请输入参数名', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                },
                { pattern: /^[a-zA-Z_][a-zA-Z_0-9]{0,99}$/, message: '参数名以字母或下划线开头，由数字、字母或下划线组成，且少于100字符', trigger: 'blur' },
                { validator: this.repeatRuleValidator.bind(this), trigger: 'blur' }
            ],
            ptype: [
                { required: true, message: '请选择输入类型', trigger: 'change' }
            ],
            stype: [
                { required: true, message: '请选择输入子类型', trigger: 'change' }
            ]
        };
    }

    repeatRuleValidator(value, rule, cb) {
        if (this.checkArgNameRepeat()) {
            cb('参数名称不可重复');
        } else {
            cb();
        }
    }

    /**
     * 检查参数名称是否重复
     * @returns {boolean}
     */
    checkArgNameRepeat() {
        if (this.argList) {
            return new Set(this.argList.map(item => item.value)).size !== this.argList.length;
        } else {
            return false;
        }
    }
}
