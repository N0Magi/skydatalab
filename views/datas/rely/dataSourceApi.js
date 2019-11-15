
import httpService from '../../../helper/httpService';
import { Notification } from 'element-ui';

/**
 * 获取数据源列表
 *
 * @param Object params={}
 * @returns Array
 */

export function getSourceList(params = {}) {
    return httpService.get('/data-manager/api/v1/datasource/', { ...params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
/**
 * 添加数据源
 *
 * @param Object dataSource={}
 * @returns
 */
export function addDataSource(dataSource = {}) {
    return httpService.post('/data-manager/api/v1/datasource/create', dataSource).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 修改数据源
 *
 * @param Object dataSource={}
 * @returns
 */
export function updateDataSource(dataSource = {}) {
    return httpService.post('/data-manager/api/v1/datasource/update', dataSource).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 删除数据源
 *
 * @param {{_id:string}} simpleParams 删除对象(只要一个ds id)
 * @returns
 */
export function deleteDataSource(simpleParams) {
    return httpService.post('/data-manager/api/v1/datasource/rm', simpleParams).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function removeDataSource(simpleParams) {
    return httpService.post('/data-manager/api/v1/datasource/delete', simpleParams).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
/**
 * 查找数据源
 *
 * @param {{_id:string}} params 查询对象(只要一个ds id)
 * @returns
 */
export function getDataSourceDetail(params = {}) {
    return httpService.get('/data-manager/api/v1/datasource/get', { params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 查询数据源标签选项
 */
export function getDataSourceOptions() {
    return httpService.get('/data-manager/api/v1/datasource/options').then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 数据集查询
 */
export function getDataset(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/', { ...params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 数据元查询
 */
export function getDatasetInfo(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/info', { params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
/**
 * 数据下载
 */
export function getDataPath(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/download', { params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
/**
 * 数据集数据预览
 */
export function getPreviewData(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/preview_data', { params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
/**
 * 数据集更新
 */
export function updataDataset(params) {
    return httpService.post('/data-manager/api/v1/dataset/update', params).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 数据元查询
 */
export function removeDatasetItem(params) {
    return httpService.post('/data-manager/api/v1/dataset/rm', params).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
export function generateSchema(data) {
    return httpService.post('/data-manager/api/v1/dataset/schema', data).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res.data);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function testDbConnection(data) {
    return httpService.post('/data-manager/api/v1/dataset/db_test', data).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function createDatasetPreProcess(data) {
    return httpService.post('/data-manager/api/v1/dataset/create/preProcess', data).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res.data);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function createDataset(data) {
    return httpService.post('/data-manager/api/v1/dataset/create', data).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function fetchDBTables(data) {
    return httpService.get('/data-manager/api/v1/dataset/db_table/option', {
        params: data
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function uploadSchemaFile(path) {
    return httpService.post('/data-manager/api/v1/dataset/schema/upload', {
        schema_file_path: path
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res.data);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function isDatasetNameExist(name) {
    return httpService.get('/data-manager/api/v1/dataset/exist', {
        name
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 创建数据源
 * @param params
 * @returns {*}
 */
export function createDataSource(params) {
    return httpService.post('/data-manager/api/v1/datasource/create', {
        ...params
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 获取数据源详情
 * @param datasource
 * @returns {*}
 */
export function dataSourceInfo(datasource) {
    return httpService.get('/data-manager/api/v1/datasource/info', {
        datasource
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function dataSourceUpdate(params) {
    return httpService.post('/data-manager/api/v1/datasource/update', {
        ...params
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 测试数据库连接
 * @param params
 * @returns {*}
 */
export function testDataSourceConnection(params) {
    return httpService.post('/data-manager/api/v1/datasource/test', { ...params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({
                title: '错误',
                message: res.msg
            });
            reject(res);
        }
    }));
}

/**
 * 获取数据源列表
 * @param params
 * @returns {*}
 */
export function getDataSourceList(params) {
    return httpService.get('/data-manager/api/v1/datasource', {
        params: {
            name: params.name,
            kind: params.kind,
            page: params.page || 1,
            page_size: params.page_size || 5
        }
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 获取数据源列表作为下拉框选项
 * @param kind
 * @returns {*}
 */
export function getDataSourceOptionsNew(kind) {
    return httpService.get('/data-manager/api/v1/datasource/options', {
        params: {
            kind
        }
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

export function fetchDbTablesBySource(datasource) {
    return httpService.get('/data-manager/api/v1/datasource/dbTables', {
        datasource
    }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res.data);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 数据集标签
 */
export function getDataTag() {
    return httpService.get('/data-manager/api/v1/dataset/tag/options').then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * 数据集和数据文件预览
 */
export function getDatasetPreview(params = {}) {
    return httpService.post('/data-manager/api/v1/dataset/preview', { ...params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}

/**
 * jupyter 跳转地址
 */
export function getJupyterUrl(params = {}) {
    return httpService.post('/data-manager/api/v1/dataset/jupyter', { ...params }).then(res => new Promise((resolve, reject) => {
        if (res.success) {
            resolve(res);
        } else {
            Notification.error({ title: '错误', message: res.msg }); reject(res);
        }
    }));
}
