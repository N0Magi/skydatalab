class Validator {
    constructor(cfg, needTransform = true) {
        for (const cfgKey in cfg) {
            this[cfgKey] = cfg[cfgKey];
        }
        if (this.required && !this.transform && needTransform) {
            this.transform = value => value && ('' + value).trim();
        }
    }
}
export default Validator;
