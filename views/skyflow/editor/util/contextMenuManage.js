import Vue from 'vue';
import ContextMenu from '../contextMenu/';
let manager = null;

function remove() {
    if (manager && manager.$el) {
        manager.$el.remove();
        manager = null;
        document.querySelector('body').removeEventListener('click', remove);
    }
}

/**
 * 创建右键菜单
 * @param menuList 菜单列表，详情参见contextMenu/index.vue组件
 * @param x x轴坐标
 * @param y y轴坐标
 * @param owner 右键菜单的拥有者，会作为参数在回调函数和事件里传递
 */
function create(menuList, x, y, owner) {
    if (manager) {
        remove();
    }
    const $body = document.querySelector('body');
    manager = new Vue(ContextMenu).$mount();
    manager.menuList = menuList;
    manager.contextX = x;
    manager.contextY = y;
    manager.owner = owner;
    $body.appendChild(manager.$el);
    $body.addEventListener('click', remove);
    manager.$on('clickmenu', remove);
}

export default {
    create,
    remove
};
