/*
 * task相关的API
 * @Author: jiasong.shao
 * @Date: 2018-05-10 10:54:35
 * @Last Modified by: xiaofei.wu
 * @Last Modified time: 2019-06-12 19:20:39
 */

/**
 * @typedef python
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {string} source_code
 * @property {string} args
 * @property {String[]} [datasources]
 * @property {{EXECUTOR:number}} instance
 * @property {{ EXECUTOR_CPU_CORES: number, EXECUTOR_GPUS: number, EXECUTOR_MEMORY_GB: number }} resource
 *
 * @typedef spark
 * @property {srting} [_id]
 * @property {srting} docker_image
 * @property {string} project
 * @property {srting} name
 * @property {srting} description
 * @property {srting} source_code
 * @property {srting} main_class
 * @property {srting} args
 * @property {String[]} [datasources]
 * @property {[{ key: string, value: string }]} spark_params,
 * @property {{EXECUTOR:number}} instance
 * @property { {SPARK_DRIVER_CORES: number, SPARK_DRIVER_MEMORY: number, SPARK_EXECUTOR_MEMORY: number, SPARK_EXECUTOR_CORES: number }} resource
 *
 * @typedef skyflow
 * @property {srting} [_id]
 * @property {srting} docker_image
 * @property {string} project
 * @property {srting} name
 * @property {srting} description
 * @property {{EXECUTOR:number}} instance
 * @property { {SPARK_DRIVER_CORES: number, SPARK_DRIVER_MEMORY: number, SPARK_EXECUTOR_MEMORY: number, SPARK_EXECUTOR_CORES: number }} resource
 *
 * @typedef tensorflow
 * @property {srting} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {string} source_code
 * @property {string} args
 * @property {String[]} [datasources]
 * @property {{EXECUTOR:number}} instance
 * @property { {EXECUTOR_CPU_CORES:number, EXECUTOR_GPUS:number, EXECUTOR_MEMORY_GB:number }} resource
 *
 * @typedef tensorflowDist
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {string} source_code
 * @property {string} args
 * @property {String[]} [datasources]
 * @property {{WORKER:number, PS:number}} instance
 * @property {{ TF_PS_CPU_CORES:number, TF_PS_GPUS:number, TF_PS_MEMORY_GB:number, TF_WORKER_CPU_CORES:number, TF_WORKER_GPUS:number, TF_WORKER_MEMORY_GB:number }} resource
 *
 * @typedef tensorflowAutoDist
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {string} source_code
 * @property {string} args
 * @property {string} ps_run_dir
 * @property {String[]} [datasources]
 * @property {{EXECUTOR:number}} instance
 * @property {{ TF_MASTER_CPU_CORES:number, TF_MASTER_MEMORY_GB:number, TF_PS_CPU_CORES:number, TF_PS_MEMORY_GB:number, TF_WORKER_CPU_CORES:number, TF_WORKER_GPUS:number, TF_WORKER_MEMORY_GB:number }} resource
 *
 * @typedef tensorboard
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {string} source_code
 * @property {string} tf_log_dir
 * @property {{EXECUTOR:number}} instance
 * @property {{ EXECUTOR_CPU_CORES:number, EXECUTOR_GPUS:number, EXECUTOR_MEMORY_GB:number }} resource
 *
 * @typedef jupyter
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {{EXECUTOR:number}} instance
 * @property {{ EXECUTOR_CPU_CORES:number, EXECUTOR_GPUS:number, EXECUTOR_MEMORY_GB:number }} resource
 *
 * @typedef h2o
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {{EXECUTOR:number}} instance
 * @property {{	EXECUTOR_CPU_CORES:number, EXECUTOR_GPUS:number, EXECUTOR_MEMORY_GB:number }} resource
 *
 * @typedef nvidiaDigit
 * @property {string} [_id]
 * @property {string} docker_image
 * @property {string} project
 * @property {string} name
 * @property {string} description
 * @property {{EXECUTOR:number}} instance
 * @property {{ EXECUTOR_CPU_CORES:number, EXECUTOR_GPUS:number, EXECUTOR_MEMORY_GB:number }} resource
 */

import httpService from '../../../helper/httpService';
/**
 * 查询Task列表
 * @param {{project:string,name:string,page:number,page_size:number}} params 查询参数
 */
export function getTask(params) {
    return httpService.get('/v2/task/', { params });
}
/**
 * 新建模型部署任务
 * @param {model} model model实例对象
 */
export function createModelTask(model) {
    return httpService.post('/v2/serving_task/tensorflow/create', model);
}
/**
 * 更新模型部署任务
 * @param {model} model model实例对象
 */
export function updateModelTask(model) {
    return httpService.post('/v2/task/update', model);
}
/**
 * 新建python任务
 * @param {python} python python实例对象
 */
export function createPython(python) {
    return httpService.post('/v2/task/python/create', python);
}

/**
 * 更新python任务
 * @param {python} python python实例对象
 */
export function updatePython(python) {
    return httpService.post('/v2/task/python/update', python);
}

/**
 * 更新spark任务
 * @param {spark} spark spark实例对象
 */
export function createSpark(spark) {
    return httpService.post('/v2/task/spark/create', spark);
}

/**
 * 更新spark任务
 * @param {spark} spark spark实例对象
 */
export function updateSpark(spark) {
    return httpService.post('/v2/task/spark/update', spark);
}

/**
 * 更新tensorflow任务
 * @param {tensorflow} tensorflow tensorflow实例对象
 */
export function createTensorflow(tensorflow) {
    return httpService
        .post('/v2/task/tensorflow/create', tensorflow)
    ;
}

/**
 * 更新tensorflow任务
 * @param {tensorflow} tensorflow tensorflow实例对象
 */
export function updateTensorflow(tensorflow) {
    return httpService
        .post('/v2/task/tensorflow/update', tensorflow)
    ;
}

/**
 * 更新tensorflowDist任务
 * @param {tensorflowDist} tensorflowDist tensorflowDist实例对象
 */
export function createTensorflowDist(tensorflowDist) {
    return httpService
        .post('/v2/task/tensorflow_dist/create', tensorflowDist)
    ;
}

/**
 * 更新tensorflowDist任务
 * @param {tensorflowDist} tensorflowDist tensorflowDist实例对象
 */
export function updateTensorflowDist(tensorflowDist) {
    return httpService
        .post('/v2/task/tensorflow_dist/update', tensorflowDist)
    ;
}

/**
 * 创建tensorflowAutoDist任务
 * @param {tensorflowAutoDist} tensorflowAutoDist tensorflowAutoDist实例对象
 */
export function createTensorflowAutoDist(tensorflowAutoDist) {
    return httpService
        .post('/v2/task/tensorflow_auto_dist/create', tensorflowAutoDist)
    ;
}

/**
 * 更新tensorflowAutoDist任务
 * @param {tensorflowAutoDist} tensorflowAutoDist tensorflowAutoDist实例对象
 */
export function updateTensorflowAutoDist(tensorflowAutoDist) {
    return httpService
        .post('/v2/task/tensorflow_auto_dist/update', tensorflowAutoDist)
    ;
}

/**
 * 创建tensorboard任务
 * @param {tensorboard} tensorboard tensorboard实例对象
 */
export function createTensorBoard(tensorboard) {
    return httpService
        .post('/v2/task/tensorboard/create', tensorboard)
    ;
}

/**
 * 更新tensorboard任务
 * @param {tensorboard} tensorboard tensorboard实例对象
 */
export function updateTensorBoard(tensorboard) {
    return httpService
        .post('/v2/task/tensorboard/update', tensorboard)
    ;
}

/**
 * 更新jupyter任务
 * @param {jupyter} jupyter jupyter实例对象
 */
export function createJupyter(jupyter) {
    return httpService.post('/v2/task/jupyter/create', jupyter);
}

/**
 * 更新jupyter任务
 * @param {jupyter} jupyter jupyter实例对象
 */
export function updateJupyter(jupyter) {
    return httpService.post('/v2/task/jupyter/update', jupyter);
}

/**
 * 更新h2o任务
 * @param {h2o} h2o h2o实例对象
 */
export function createH2o(h2o) {
    return httpService.post('/v2/task/h2o/create', h2o);
}

/**
 * 更新h2o任务
 * @param {h2o} h2o h2o实例对象
 */
export function updateH2o(h2o) {
    return httpService.post('/v2/task/h2o/update', h2o);
}

/**
 * 新建 nvidiaDigit 任务
 * @param {nvidiaDigit} nvidiaDigit nvidiaDigit实例对象
 */
export function createNvidiaDigit(nvidiaDigit) {
    return httpService
        .post('/v2/task/nvidia_digit/create', nvidiaDigit)
    ;
}

/**
 * 更新 nvidiaDigit 任务
 * @param {nvidiaDigit} nvidiaDigit nvidiaDigit实例对象
 */
export function updateNvidiaDigit(nvidiaDigit) {
    return httpService
        .post('/v2/task/nvidia_digit/update', nvidiaDigit)
    ;
}

/**
 * 新建 skyflow 任务
 * @param {skyflow} skyflow skyflow实例对象
 */
export function createSkyflow(skyflow) {
    return httpService.post('/v2/task/skyflow/create', skyflow);
}

/**
 * 更新skyflow任务
 * @param {skyflow} skyflow skyflow实例对象
 */
export function updateSkyflow(skyflow) {
    return httpService.post('/v2/task/skyflow/update', skyflow);
}

/**
 * 创建容器开发任务
 * @param {containerDev} containerDev containerDev实例对象
 */
export function createContainerDev(containerDev) {
    return httpService
        .post('/v2/task/container_dev/create', containerDev)
    ;
}

/**
 * 更新容器开发任务
 * @param {containerDev} containerDev containerDev实例对象
 */
export function updateContainerDev(containerDev) {
    return httpService
        .post('/v2/task/container_dev/update', containerDev)
    ;
}

/**
 * 根据taskid获取task详情
 * @param {string} _id taskid
 */
export function getTaskById(_id) {
    return httpService.get('/v2/task/get', { params: { _id } });
}

/**
 * 启动 任务
 * @param {{_id:string}} data 参数对象
 */
export function startTask(data) {
    return httpService.post('/v2/task/start', data);
}

/**
 * 删除 任务
 * @param {{_id:string}} data 参数对象
 */
export function removeTask(data) {
    return httpService.post('/v2/task/rm', data);
}

/**
 * 停止 任务
 * @param {{_id:string}} data 参数对象
 */
export function stopTask(data) {
    return httpService.post('/v2/task/stop', data);
}

/**
 * 根据task的kind来获取源码过滤类型
 * @param {Number} kind task类型代码 见 CONSTS.js配置
 */
export function getSourceCodeFilterByTaskKind(kind) {
    return httpService
        .get('/v2/task/source_code/filter', { params: { kind } })
    ;
}
/**
 * 获取spark的参数列表
 */
export function getSparkKeys() {
    return httpService.get('/v2/task/spark/params/options');
}

/**
 * 根据 submission_id 获取 task 详情,主要是日志列表
 * @param {string} submission_id task 的 submission_id 只有启动后的task有
 */
export function getTaskInfoBySubmissionId(submission_id) {
    return httpService
        .get('/v2/task/log/task_info', { params: { submission_id } })
    ;
}

/**
 * 按步长获取log日志
 * @param {{task_id:string,offset:number,size:number}} params 查询参数
 */
export function getTaskLogByStep(params) {
    return httpService.get('/v2/task/log/by_step', { params });
}

/**
 * 根据 task_id 获取日志的长度
 * @param {string} task_id task_id(由getTaskInfoBySubmissionId查询获得)
 */
export function getLogNumByTaskId(task_id) {
    return httpService
        .get('/v2/task/log/log_num', { params: { task_id } })
    ;
}

/**
 * 获取 task 实时监控
 * @param {{submission_id:string,start_time:number,end_time:number}} 查询参数
 */
export function getAppStatBySubmissionId(params) {
    return httpService.get('/v2/task/stat/app_stat', { params });
}

/**
 * 获取 task 实时监控
 * @param {{submission_id:string,task_id:string,start_time:number,end_time:number}} 查询参数
 */
export function getTaskStatByTaskId(params) {
    return httpService.get('/v2/task/stat/task_stat', { params });
}

/**
 * 获取类型任务是否是单实例
 * @param {{kind:number}} 查询参数
 */
export function getKindIsSingleInstance(params) {
    return httpService
        .get('/v2/task/is/single_instance', { params })
    ;
}

/**
 * 获取项目列表
 * @param  查询参数
 */
export function getProjectList(params) {
    return httpService
        .get('/v2/project/options', { params })
    ;
}

/**
 * 获取数据源列表
 * @param  查询参数
 */
export function getDataSource(params) {
    return httpService
        .get('/v2/datasource/options', { params })
    ;
}

/**
 * 获取数据源列表
 * @param  查询参数
 */
export function getTaskDataSource(params) {
    return httpService
        .get('/v2/datasource/taskOptions', { params })
    ;
}
/**
 * 获取数据集列表
 * @param  查询参数
 */
export function getDataSet(params) {
    return httpService
        .get('/v2/dataset/options', { params })
    ;
}