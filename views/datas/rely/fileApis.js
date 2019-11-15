/*
 * 文件相关的 API (老版本的API,返回值不规范,所以返回值需要个别处理)
 * @Author: jiasong.shao
 * @Date: 2018-04-03 20:46:20
 * @Last Modified by: xiaofei.wu
 * @Last Modified time: 2019-06-12 19:21:38
 */

/**
 * @typedef path
 * @property {string} path - 查询路径
 * @property {boolean} only_dir -是否只展示文件夹
 * @property {srting} ref -必须包含的文件名(文件数量过多,从搜索跳转过来时需要)
 * @property {number} page_size -查询数量
 * @property {number} page -分页
 *
 * @typedef file
 * @property {string} path 文件路径
 * @property {boolean} type 是否是文件夹,true 是文件夹,false 不是文件夹
 *
 * @typedef mkpath
 * @property {string} path 文件夹路径
 *
 * @typedef mcoption
 * @property {Array<mkpath>} src 操作文件对象列表
 * @property {string} target 目标路径
 *
 * @typedef renameOption
 * @property {string} src 被操作路径 src
 * @property {string} target 修改为路径 target
 *
 * @typedef searchParams
 * @property {string} path 搜索位置
 * @property {string} pattern 搜索条件
 * @property {number} timeout 后台超时时间
 * @property {number} page_size 查询数量
 * @property {number} page 分页
 */

import httpService from '../../../helper/httpService';

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
/**
 * @param {path} params 查询参数
 */
export function cephLsTask(params) {
    return httpService.get('/v2/ceph/ls_task/', { params }).then(res => {
        if (res.data.success) {
            return Promise.resolve(res.data.data);
        } else {
            return Promise.reject(decodeURI(res.data.msg));
        }
    });
}
/**
 *
 * 删除文件(异步)
 * @param {paths:Array<String>} paths 需要删除的文件对象数组
 */
export function cephRm(paths) {
    return httpService
        .post('/v2/cephfs/remove/task/create', { paths, auto_start: true });
}

/**
 * 获取删除文件任务列表
 * @param {{page:number,page_size:number,need_pull:boolean}} params 查询参数
 */
export function getDelTaskList(
    params = { page: 1, page_size: 100, need_pull: true }
) {
    return httpService.get('/v2/cephfs/remove/task/', { params });
}

/**
 * 获取异步共享的文件列表
 * @param params
 * @returns {*}
 */
export function getShareTaskList(
    params = { page: 1, page_size: 100, need_pull: true }
) {
    return httpService.get('/v2/ceph/fileshare/task/ls', { params });
}

/**
 * 新建文件夹
 * @param {mkpath} data 需要新建的文件夹对象
 */
export function cephMkdir(data) {
    return httpService.post('/v2/ceph/mkdir', data);
}

/**
 * 移动文件夹
 * @param {{src:string[],target:string}} data 移动/复制文件选项
 */
export function cephMoveTo(data) {
    return httpService.post('/v2/ceph/move', data);
}

/**
 * 移动文件夹
 * @param {{src:string[],target:string,auto_start:boolean}} data 移动/复制文件选项
 */
export function cephCopyTo(data) {
    return httpService.post('/v2/cephfs/copy/task/create', data);
}

/**
 * 运行拷贝任务
 * @param {string} _id 拷贝任务的Id,通过 cephCopyTo这个方法创建的拷贝任务,会返回ID
 */
export function cephStartCopyTask(_id) {
    return httpService.post('/v2/cephfs/copy/task/start', { _id });
}

/**
 * 获取拷贝任务列表
 * @param {{page:number,page_size:number,need_pull:boolean}} params 查询参数
 */
export function getCopyTaskList(
    params = { page: 1, page_size: 100, need_pull: true }
) {
    return httpService.get('/v2/cephfs/copy/task/', { params });
}

/**
 * 停止拷贝任务
 * @param {string} _id 拷贝任务的Id
 */
export function stopCopyTask(_id) {
    return httpService.post('/v2/cephfs/copy/task/stop', { _id });
}

/**
 * 根据 type来操作移动或者复制文件
 * @param {string} type copy 复制文件,move 移动文件
 * @param {mcoption} data 移动.复制文件选项
 */
export function cephCopyOrMoveTo(type, data) {
    if (type === 'copy') {
        return cephCopyTo({ ...data, auto_start: true });
    } else if (type === 'move') {
        return cephMoveTo(data);
    } else {
        return Promise.reject(`没有找到${type}对应的操作`);
    }
}

/**
 * 重命名文件/文件夹
 * @param {renameOption} data 重命名参数
 */
export function cephRename(data) {
    return httpService.post('/v2/ceph/rename', data);
}

/**
 * 搜索文件(一分钟超时限制)
 * @param {searchParams} params 搜索参数
 */
export function cephSearch(params) {
    return httpService
        .get('/v2/ceph/search', { params }, { timeout: 120 * 1000 });
}

/**
 * 搜索文件异步轮询接口
 */
export function searchPullLoop(searchId) {
    return httpService
        .get('/v2/ceph/search/result', {
            params: {
                _id: searchId
            }
        }, { timeout: 120 * 1000 });
}

/**
 * 预览压缩文件详情
 * @param {mkpath} params 参数对象
 */
export function cephLsZip(params) {
    return httpService
        .get('/v2/ceph/ls_zip', {
            params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
}

// /**
//  * 解压文件
//  * @param {mkpath} params 参数对象
//  */
// export function cephUnzip(params) {
//     return fetch
//         .get('/v2/ceph/unzip', {
//             params /* ,
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json'
//             } */
//         })
//
// }

/**
 * 解压文件，获取id
 * @param {mkpath} params 参数对象
 */
export function cephUnzipId(params) {
    return httpService
        .get('/v2/ceph/unzip', {
            params
        });
}


/**
 * 解压文件
 * @param {mkpath} params 参数对象
 */
export function cephUnzip(params) {
    return httpService
        .get('/v2/ceph/unzip/state', {
            params
        });
}

/**
 * 检查文件是否可以下载
 * @param {string} queryStr 查询参数
 */
export function checkDownload(queryStr) {
    return httpService.get(`/v2/ceph/check_download?${queryStr}`);
}
/**
 * 下载压缩包
*/
export function getZip(_id) {
    return httpService.get(`/v2/ceph/get/zip?_id=${_id}`);
}
export function getZipId(queryStr) {
    return httpService.get(`/v2/ceph/get?${queryStr}`);
}


export function groupShare(path, is_admin) {
    return httpService.post('/v2/ceph/group_share', {
        path,
        is_admin
    });
}

export function publicShare(path, is_admin) {
    return httpService.post('/v2/ceph/group_public', {
        path,
        is_admin
    });
}

export function fileShareQueryLoop(id) {
    return httpService.get(`/v2/ceph/fileshare/task?_id=${id}`);
}

export function allUserFolders(order = 'asc') {
    return httpService.get('/v2/user/ls', {
        params: {
            page: 1,
            page_size: 9999,
            order_by_name: order
        }
    });
}

export function userFiles(path) {
    return cephLs({
        path,
        page_size: 1000,
        is_admin: true
    });
}

export function hdfsLs(source, path = '/', only_dir = false) {
    return httpService.get('/v2/datasource/hdfs/ls', {
        params: {
            datasource: source,
            path,
            only_dir
        }
    });
}
