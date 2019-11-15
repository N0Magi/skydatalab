/*
 * @Author: jiasong.shao
 * @Date: 2018-01-03 11:30:15
 * @Last Modified by: yangsheng
 * @Last Modified time: 2019-06-11 11:51:03
 */

class UUID {
    static getUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

export default UUID;
