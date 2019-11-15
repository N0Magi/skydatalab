import httpService from '../../../helper/httpService';
import { Notification } from 'element-ui';
import { getTaskList } from '@sdx/utils/lib/api/project';

export function getSourceList(params = {}) {
    return httpService
        .get('/api/v1/datasource/', {
            params
        }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function addDataSource(dataSource = {}) {
    return httpService.post('/api/v1/datasource/create', dataSource).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function updateDataSource(dataSource = {}) {
    return httpService.post('/api/v1/datasource/update', dataSource).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function deleteDataSource(simpleParams) {
    return httpService.post('/api/v1/datasource/rm', simpleParams).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function removeDataSource(simpleParams) {
    return httpService.post('/api/v1/datasource/delete', simpleParams).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function getDataSourceDetail(params = {}) {
    return httpService.get('/api/v1/datasource/get', { params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDataSourceOptions() {
    return httpService.get('/api/v1/datasource/options').then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDataset(params = {}) {
    return httpService.get('/api/v1/dataset/', { params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDatasetInfo(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/info', { ...params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function getDataPath(params = {}) {
    return httpService.get('/api/v1/dataset/download', { params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function getPreviewData(params = {}) {
    return httpService.get('/data-manager/api/v1/dataset/preview_data', { params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function updataDataset(params) {
    return httpService.post('/api/v1/dataset/update', params).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function removeDatasetItem(params) {
    return httpService.post('/api/v1/dataset/rm', params).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}
export function generateSchema(data) {
    return httpService.post('/api/v1/dataset/schema', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function testDbConnection(data) {
    return httpService.post('/api/v1/dataset/db_test', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function createDatasetPreProcess(data) {
    return httpService.post('/api/v1/dataset/create/preProcess', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function createDataset(data) {
    return httpService.post('/api/v1/dataset/create', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function fetchDBTables(data) {
    return httpService.get('/api/v1/dataset/db_table/option', {
        params: data
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function uploadSchemaFile(path) {
    return httpService.post('/api/v1/dataset/schema/upload', {
        schema_file_path: path
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function isDatasetNameExist(name) {
    return httpService.get('/api/v1/dataset/exist', {
        params: {
            name
        }
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function createDataSource(params) {
    return httpService.post('/api/v1/datasource/create', {
        ...params
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function dataSourceInfo(datasource) {
    return httpService.get('/api/v1/datasource/info', {
        params: {
            datasource
        }
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function dataSourceUpdate(params) {
    return httpService.post('/api/v1/datasource/update', {
        ...params
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function testDataSourceConnection(params) {
    return httpService.post('/api/v1/datasource/test', { ...params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDataSourceList(params) {
    return httpService.get('/api/v1/datasource', {
        params: {
            name: params.name,
            kind: params.kind,
            page: params.page || 1,
            page_size: params.page_size || 5
        }
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDataSourceOptionsNew(kind) {
    return httpService.get('/api/v1/datasource/options', {
        params: {
            kind
        }
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

export function fetchDbTablesBySource(datasource) {
    return httpService.get('/api/v1/datasource/dbTables', {
        datasource
    }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDataTag() {
    return httpService.get('/api/v1/dataset/tag/options').then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getDatasetPreview(params = {}) {
    return httpService.post('/data-manager/api/v1/dataset/preview', { ...params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}


export function getJupyterUrl(params = {}) {
    return httpService.post('/api/v1/dataset/jupyter', { ...params }).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

/**
 * 查询服务列表
 * @param {{name:string,page:number,page_size:number,order:string,order_by:string}} params 查询参数
 */
export function getServices(params) {
    return getTaskList({
        type: 'DATA_SERVICE',
        start: 1,
        count: -1
    });
}

/**
 * 启动 任务
 * @param {{_id:string}} data 参数对象
 */
export function startTask(data) {
    return httpService.post('/v2/task/start', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

/**
 * 删除 任务
 * @param {{_id:string}} data 参数对象
 */
export function removeTask(data) {
    return httpService.post('/v2/task/rm', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

/**
 * 停止 任务
 * @param {{_id:string}} data 参数对象
 */
export function stopTask(data) {
    return httpService.post('/v2/task/stop', data).then(res => new Promise((resolve, reject) => { if (res.success) { resolve(res); } else { Notification.error({ title: '错误', message: res.msg }); reject(res); } }));
}

/**
 * @param {path} params 查询参数
 */
export function cephLs(params) {
    return httpService.get('/v2/ceph/ls/', { params }).then(res => {
        if (res.data.success) {
            return Promise.resolve(res.data.data);
        } else {
            return Promise.reject(decodeURI(res.data.msg));
        }
    });
}

export function hdfsLs(source, path = '/', only_dir = false) {
    return httpService.get('/api/v1/datasource/hdfs/ls', {
        params: {
            datasource: source,
            path,
            only_dir
        }
    });
}

/**
 * 检查文件是否可以下载
 * @param {string} queryStr 查询参数
 */
export function checkDownload(queryStr) {
    return fetch.get(`/v2/ceph/check_download?${queryStr}`).then(commonThen);
}

/**
 * 下载压缩包
*/
export function getZip(_id) {
    return fetch.get(`/v2/ceph/get/zip?_id=${_id}`).then(commonThen);
}
export function getZipId(queryStr) {
    return fetch.get(`/v2/ceph/get?${queryStr}`).then(commonThen);
}
