import request from '@/utils/request'
// @ts-ignore
// 超時時間：30分鐘（正式环境用下面这行）
// const LOGIN_TIMEOUT = 30 * 60 * 1000;
// 测试用：1分钟超时
const LOGIN_TIMEOUT = 30 * 60 * 1000;
const LAST_OPERATE_KEY = 'last_operate_time';

let checkTimer = null;
const CHECK_INTERVAL = 15 * 1000; // 每5秒檢測一次

// 更新最後操作時間戳
export const updateOperateTime = () => {
    const now = Date.now();
    localStorage.setItem(LAST_OPERATE_KEY, now + '');
};

// 判斷是否超時
export const isLoginTimeout = () => {
    const last = localStorage.getItem(LAST_OPERATE_KEY);
    if (!last) {
        return false;
    }
    const now = Date.now();  
    const diff = now - Number(last);
    return diff >= LOGIN_TIMEOUT;
};

/**
 * 通用登出方法（自動超時 / 手動退出 統一調用）
 * @param {object} router 路由實例
 */
export const logoutAndRedirect = async (router) => {
    // 1. 從本地存儲取出 user，解析獲取 userId
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id;
        } catch (e) {
            console.error('解析用戶資訊失敗', e);
        }
    }

    // 2. 請求後端接口
    if (userId) {
        try {
            const { data: res } = await request.post('/api/user/userlogout', {
                userId: userId
            })
            console.log('登出接口返回', res)
        } catch (err) {
            console.error('呼叫登出接口失敗', err)
        }
    }

    // 3. 停止定時器
    if (checkTimer) {
        clearInterval(checkTimer);
        checkTimer = null;
    }

    // 4. 清空前端所有本地緩存
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('home_has_loaded')
    localStorage.removeItem('mall_scroll_top');
    localStorage.removeItem('mall_list_cache');
    localStorage.removeItem(LAST_OPERATE_KEY);
    sessionStorage.clear();

    // 5. 跳轉登入頁
    if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
    }
};

// 啟動輪詢檢測
export const startCheck = (router) => {
    if (checkTimer) return;
    checkTimer = setInterval(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            clearInterval(checkTimer);
            checkTimer = null;
            return;
        }
        if (isLoginTimeout()) {
            // 超時觸發自動登出
            logoutAndRedirect(router);
        }
    }, CHECK_INTERVAL);
};

// 頁面初始化校驗
export const initCheck = (router) => {
    const user = localStorage.getItem('user');
    if (!user) return;
    if (isLoginTimeout()) {
        logoutAndRedirect(router);
        return;
    }
    updateOperateTime();
    // ========== 新增这一行：启动定时检测 ==========
    startCheck(router);
};