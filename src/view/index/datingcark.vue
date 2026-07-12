<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('type_date_card') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <!-- 你的内容 原样不动 -->
                        <div
                            style="display: flex;flex-direction: row;height: 60px;align-items: center;text-align: center;">
                            <div style="color: #cc9b5a;font-weight: bold;font-size: 15px;margin-left: 20px;">
                                {{ $t('type_date_card') }}：{{ totalBuyCount }}
                            </div>
                        </div>
                        <div class="vipall">
                            
                            <div class="viptext"  v-for="item in packageList" :key="item.id">
                                <div style="height: 60px;width:15%;">
                                    <img :src="imaged" style="width:100%;height:100%;object-fit:cover;">
                                </div>
                                <div
                                    style="display: flex;flex-direction: column;text-align: left;width:25%;justify-content: center;margin-left: 10px;">
                                    <div style="color: #000;font-weight: bold;font-size: 15px;">{{ $t('order_amount') }}
                                    </div>
                                    <div style="color: #000;font-size: 12px;">${{ item.package_price }}</div>
                                </div>
                                <div
                                    style="display: flex;flex-direction: column;text-align: center;flex: 1;justify-content: center;">
                                    <div style="font-size: 12px;color: #000;">
                                        {{ $t('oneTime') }}: {{ item.card_num }}
                                    </div>
                                    <div style="font-size: 12px;">{{ $t('order_quantity') }}：{{ item.buy_count }}</div>
                                </div>
                                <div class="upgrade" @click="recharge(item)">{{ $t('buy') }}</div>
                            </div>
                        </div>
                        <!-- 搜索 + 未完成单号下拉选择 -->
                        <div class="search-bar mb-4" v-if=" Number(userInfo.role_level) > 1"
                            style="display:flex;align-items:center;flex-direction: column;padding: 5px 20px;">
                            <div style="display:flex;gap:8px;flex-direction: row;width: 100%;margin-bottom: 10px;">
                                <el-input v-model="orderNo" :placeholder="$t('dating_inputOrderNo')" style="flex: 1;"></el-input>
                                <div type="primary" @click="queryDetail"
                                    style="font-size: 13px;color: #fff; background-color: #a05601;border-radius: 6px;padding: 5px 10px;">
                                    {{ $t('dating_search') }}</div>
                            </div>
                            <!-- 切换标签 -->
                            <div style="display:flex;width:100%;">
                                <div class="tab-item" :class="{ active: orderType === 1 }" @click="switchOrderType(1)">
                                    {{ $t('dating_initiated') }}
                                </div>
                                <div class="tab-item" :class="{ active: orderType === 2 }" @click="switchOrderType(2)">
                                    {{ $t('dating_received') }}
                                </div>
                            </div>

                            <div class="order-buttons">
                                <div v-if="unFinishList.length === 0"
                                    style="color:#666;font-size:12px;text-align:center;padding:10px;">{{ $t('dating_noUnfinishedBill') }}</div>
                                <div v-for="item in unFinishList" :key="item.order_no" size="small"
                                    style="width:100%;text-align:left;color: #ccc;font-size: 12px;padding: 3px 15px;"
                                    :type="selectOrder === item.order_no ? 'primary' : ''"
                                    @click="handleSelectOrder(item.order_no)">
                                    <div>{{ $t('dating_orderNo') }}：{{ item.order_no }}</div>
                                    <div>{{ $t('dating_targetNick') }}：{{ item.nickname }}</div>
                                    <div style="display: flex;">
                                        <div class="status">{{ statusText(item.status) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 物流式时间线流程 -->
                        <div style="display: flex;padding: 0 20px 100px 20px;flex-direction:column;">
                            <div v-if="processList.length" v-for="(item, index) in processList" :key="index"
                                style="width:100%;display:flex;flex-direction: row;">
                                <div style="display: flex;flex-direction: column;width: 30px;align-items: center;">
                                    <div style="display: flex; width: 5px;background-color: #f706eb;flex: 1;">
                                    </div>
                                    <div
                                        style="font-weight: 800; width: 30px;height: 30px;border-radius: 50px;background-color: #f706eb;font-size: 19px;color: #fff;">
                                        {{ processList.length - index }}</div>
                                </div>
                                <!-- 发起人 靠左 -->
                                <div
                                    style="display:flex;align-items:flex-start;width:100%;flex-direction: column;border-bottom: 1px solid #f706eb;padding:15px 15px 15px 0;margin-bottom: 8px;">
                                    <div style="display: flex;flex-direction: row;">
                                        <div style="color:#fff;font-size:12px;padding-right: 10px;white-space: nowrap;">{{ $t('dating_content') }}</div>
                                        <div
                                            style="color:#ccc;font-size:12px;background:#333;padding:3px 5px;border-radius:3px;word-break:break-all;white-space:normal;text-align: left;">{{
                                                item.deposit_cause }}：${{ item.deposit_amount }}</div>
                                    </div>
                                    <div style="display:flex;flex-direction: row;width: 100%;margin-top: 10px;">
                                        <div style="display:flex;flex-direction: row;flex: 1;">
                                            <div style="width:30px;height:30px;border-radius:5px;margin-right:8px;">
                                                <img :src="baseURL + item.from_avatar"
                                                    style="width:100%;height:100%;border-radius:5px;object-fit:cover;" />
                                            </div>
                                            <div
                                                style="display:flex;flex-direction: column;text-align: left;gap: 10px;">
                                                <div style="color:#ccc;font-size:13px;">{{ item.from_nick }}</div>
                                                <div class="processtoa" v-if="item.deposit_status == 2">{{ $t('dating_finished') }}</div>
                                                <div style="display: flex;gap: 5px;"
                                                    v-if="userInfo.id == item.from_id && item.deposit_status == 1">
                                                    <div class="processto" @click="gotoopenPop(item)">{{ $t('dating_goComplete') }}</div>
                                                    <span class="processtob"
                                                        v-if="userInfo.id == item.from_id && processList.length - index == processList.length"
                                                        @click="togkdlasijk">{{ $t('dating_applyRefund') }}</span>
                                                </div>
                                                <div style="display: flex;"
                                                    v-if="userInfo.id == item.to_id && item.deposit_status == 1">
                                                    <div class="processtob">{{ $t('dating_processing') }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="display:flex;flex-direction: row;flex: 1;">
                                            <div style="width:30px;height:30px;border-radius:5px;margin-right:8px;">
                                                <img :src="baseURL + item.to_avatar"
                                                    style="width:100%;height:100%;border-radius:5px;object-fit:cover;" />
                                            </div>
                                            <div
                                                style="display:flex;flex-direction: column;text-align: left;gap: 10px;">
                                                <div style="color:#ccc;font-size:13px;">{{ item.to_nick }}</div>
                                                <div class="processtoa" v-if="item.deposit_tostatus == 2">{{ $t('dating_finished') }}</div>
                                                <div style="display: flex;"
                                                    v-if="userInfo.id == item.to_id && item.deposit_status == 2 && processList.length - index == processList.length">
                                                    <div class="processto" @click="openPop(item)">{{ $t('dating_addProcess') }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 购买弹窗 -->
        <div class="copy-toastas" v-if="zuzjkdsoa">
            <div
                style="font-size: 30px;width: 100%;height: 120px;display: flex;background-color: #616161;align-items: center;">
                <div style="height: 60px;width:15%;margin-left: 20px;">
                    <img :src="imaged" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="font-size: 16px;margin-left: 10px;font-weight: bold;">{{ $t('buyDatingCard') }}</div>
            </div>
            <div
                style="border-radius: 30px 30px 0 0;background-color: #fff;width: 100%;color: #000;text-align: left;position: relative;margin-top: auto;flex: 1;">
                <div style="font-size: 16px;margin-top: 30px;margin-left: 30px;">
                    {{ $t('availableBalance') }}：{{ userInfo.balance }}
                </div>
                <div style="font-size: 36px;margin-top: 10px;margin-left: 30px;font-weight: bold;">
                    <div class="form-input">${{ vakdilsog }}</div>
                </div>

                <div style="display: flex;flex-direction: row;margin: 50px 20px 20px 20px;gap: 15px;">
                    <div class="buttdgr" @click="zuzjkdsoa = false">{{ $t('cancelText') }}</div>
                    <div class="buttdgraa" @click="router.push(`/user_recharge`)" v-if="userInfo.balance < vakdilsog">
                        {{ $t('goRecharge') }}
                    </div>
                    <div class="buttdgraa" @click="datingcard" v-else>{{ $t('buy') }}</div>
                </div>
            </div>
        </div>
        <!-- 弹窗1：第一步 输入支付金额 -->
        <div class="copy-toastas" v-if="showAmountPop" style="height:auto;overflow:hidden;height: 100%;">
            <div style="background:#a05601;color:#fff;padding:16px;font-size:16px;font-weight:bold;width: 100%;">
                {{ stepItem?.deposit_cause }}
            </div>
            <div style="padding:50px 20px;width:100%;box-sizing:border-box;background:#fff;color:#000;">
                <div style="margin-bottom:15px;">
                    <div style="font-size:14px;margin-bottom:6px;">{{ $t('dating_submitAmount') }}</div>
                    <div style="font-size:30px;font-weight:bold;color:#f706eb;">${{ stepItem?.deposit_amount }}</div>
                </div>
            </div>
            <div style="display:flex;background:#fff;width: 100%;">
                <div style="padding:0 20px;display: flex;flex-direction: row;width: 100%;gap: 10px;">
                    <div class="buttdgr" style="flex:1" @click="showAmountPop = false">{{ $t('dating_cancel') }}</div>
                    <div class="buttdgraa" style="flex:1" @click="checkUserBalance">{{ $t('dating_submit') }}</div>
                </div>
            </div>
        </div>

        <!-- 弹窗2：第二步 输入资金密码 -->
        <div class="copy-toastas" v-if="showPayPwdPop" style="height:auto;overflow:hidden;height: 100%;">
            <div style="background:#a05601;color:#fff;padding:16px;font-size:16px;font-weight:bold;width: 100%;">
                {{ $t('dating_inputFundPwd') }}
            </div>
            <div style="padding:20px;width:100%;box-sizing:border-box;background:#fff;color:#000;">
                <div style="margin-bottom:15px;">
                    <div style="font-size:14px;margin-bottom:6px;">{{ $t('dating_payAmount') }}</div>
                    <div style="font-size:20px;font-weight:bold;color:#f706eb;">${{ stepItem?.deposit_amount }}</div>
                </div>
                <div style="margin-bottom:15px;">
                    <div style="font-size:14px;margin-bottom:6px;text-align: left;">{{ $t('dating_fundPwd') }}</div>
                    <el-input v-model="payPwd" :placeholder="$t('dating_enterFundPwd')" show-password type="password"></el-input>
                </div>
            </div>
            <div style="display:flex;background:#fff;width: 100%;">
                <div style="padding: 20px;display: flex;flex-direction: row;width: 100%;gap: 10px;">
                    <div class="buttdgr" style="flex:1" @click="showPayPwdPop = false">{{ $t('dating_cancel') }}</div>
                    <div class="buttdgraa" style="flex:1" @click="submitPayWithPwd">{{ $t('dating_confirmPay') }}</div>
                </div>
            </div>
        </div>
        <!-- 填写流程内容弹窗 -->
        <div class="copy-toastas" v-if="showDepositPop" style="height:auto;overflow:hidden;height: 100%;">
            <div style="background:#a05601;color:#fff;padding:16px;font-size:16px;font-weight:bold;width: 100%;">
                {{ $t('dating_fillDepositInfo') }}</div>
            <div style="padding:20px;width:100%;box-sizing:border-box;background:#fff;color:#000;">
                <div style="margin-bottom:15px;">
                    <div style="font-size:14px;margin-bottom:6px;">{{ $t('dating_amount') }}</div>
                    <el-input v-model="popAmount" :placeholder="$t('dating_inputAmount')" type="number"></el-input>
                </div>
                <div style="margin-bottom:15px;">
                    <div style="font-size:14px;margin-bottom:6px;">{{ $t('dating_note') }}(cause)</div>
                    <el-input v-model="popCause" :placeholder="$t('dating_inputNote')" type="textarea" :rows="3"></el-input>
                </div>
            </div>
            <div style="display:flex;background:#fff;width: 100%;">
                <div style="padding: 20px;display: flex;flex-direction: row;width: 100%;gap: 10px;">
                    <div class="buttdgr" style="flex:1" @click="showDepositPop = false">{{ $t('dating_cancel') }}</div>
                    <div class="buttdgraa" style="flex:1" @click="submitDeposit">{{ $t('dating_confirmSubmit') }}</div>
                </div>
            </div>
        </div>
        <!-- 提示 -->
        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesno" />
            </div>
            <div style="font-size: 16px;">{{ showtext }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
const baseURL = request.defaults.baseURL || '';
const showToast = ref(false);
const showtext = ref('');
const yesno = ref(false);
const { t } = useI18n();
const route = useRoute();
const zuzjkdsoa = ref(false)
const vakdilsog = ref()
const currentPackage = ref<any>(null)
const goBack = () => router.go(-1);
const recharge = (item: any) => {
    zuzjkdsoa.value = true
    vakdilsog.value = item.package_price
    // 缓存当前选中套餐
    currentPackage.value = item
};

const togkdlasijk = async () => {
    showToast.value = true;
    yesno.value = true;
    showtext.value = t('dating_refundTip');
    setTimeout(() => showToast.value = false, 3000);
}

const imaged = ref('/images/date.png')
const datingcard = async () => {
    const balance = Number(userInfo.balance);
    if (balance < vakdilsog.value) {
        showToast.value = true; yesno.value = false; showtext.value = t('insufficientBalance');
        setTimeout(() => showToast.value = false, 1000); return;
    }
    try {
        const { data } = await request.post('/api/datingcard/buy-dating-card', {
            user_id: userInfo.id,
            amount: vakdilsog.value,
            package_id: currentPackage.value.id // 追加套餐ID
        });
        if (data.code === 1) {
            showToast.value = true;
            yesno.value = true;
            showtext.value = t('purchaseSuccess');
            setTimeout(() => showToast.value = false, 1000);
            zuzjkdsoa.value = false;
            loadUserInfo();
            getUnFinishOrder();
            getPackageList()
        } else {
            showToast.value = true; yesno.value = false; showtext.value = t('requestFailed');
            setTimeout(() => showToast.value = false, 1000);
        }
    } catch (err) {
        showToast.value = true; yesno.value = false; showtext.value = t('requestFailed');
        setTimeout(() => showToast.value = false, 1000);
    }
};
const userInfo = reactive({ id: '', date_card_num: '', balance: '',role_level:'' });
const loadUserInfo = async () => {
    try {
        const u = localStorage.getItem('user') || '';
        if (!u) return;
        const user = JSON.parse(u);
        const userId = user.id || user.userId;
        const { data: res } = await request.post('/api/user/info', { user_id: userId });
        if (res.code === 1 && res.data) {
            userInfo.id = res.data.id || '0'
            userInfo.date_card_num = res.data.date_card_num || '0'
            userInfo.balance = res.data.balance || '0'
            userInfo.role_level = res.data.role_level || '0'
        }
    } catch (err) { }
};

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.path);
}, { immediate: true });
const orderNo = ref('')
const selectOrder = ref('')
const detailInfo = ref(null)
const processList = ref([])
const unFinishList = ref([])
// 订单类型 1=我发起 2=我接收
const orderType = ref<number>(1)

// 状态映射
const statusText = (val: number) => {
    const map: Record<number, string> = { 1: t('dating_processing'), 2: t('dating_finished') }
    return map[val] || t('dating_unknown')
}


// 真实接口：获取未完成订单
const getUnFinishOrder = async () => {
    if (!userInfo.id) return
    try {
        const { data } = await request.get('/api/capital/unfinish-list', {
            params: {
                userId: userInfo.id,
                type: orderType.value
            }
        })
        if (data.code === 1) {
            // 适配模板渲染字段：user_id展示对方ID
            unFinishList.value = data.data.map((item: any) => {
                let targetUid = ''
                if (orderType.value === 1) targetUid = item.to_id
                if (orderType.value === 2) targetUid = item.from_id
                return {
                    order_no: item.order_no,
                    user_id: targetUid,
                    status: item.main_status,
                    nickname: item.nickname || '',
                    avatar: item.avatar || '',
                    role_level: item.role_level ?? 0,
                    amount: '',
                    cause: ''
                }
            })
        }
    } catch (err) {
        unFinishList.value = []
    }
}

// 切换订单类型（可选，加到template按钮）
const switchOrderType = async (type: number) => {
    orderType.value = type
    selectOrder.value = ''
    orderNo.value = ''
    detailInfo.value = null
    processList.value = []
    await getUnFinishOrder()
}

// 选择单号
const handleSelectOrder = (val: string) => {
    if (!val) return
    orderNo.value = val
    selectOrder.value = val
    queryDetail()
}

// 查询主单详情 + 组装时间线
const queryDetail = async () => {
    if (!orderNo.value || !userInfo.id) return
    try {
        const res = await request.get('/api/capital/detail', {
            params: { orderNo: orderNo.value, userId: userInfo.id }
        })
        const { data } = res
        if (data.code == 1) {
            processList.value = data.data.reverse()
        }
    } catch (err) {
    }
}


// 弹窗变量
const showDepositPop = ref(false)
const popAmount = ref('')
const popCause = ref('')
let currentItem: any = null // 缓存当前点击的单据行

// 打开弹窗，绑定当前item
const openPop = (item: any) => {
    currentItem = item
    popAmount.value = ''
    popCause.value = ''
    showDepositPop.value = true
}

// 正式提交入库：capital_deposit status=2,to_status=1
const submitDeposit = async () => {
    if (!currentItem) return
    const amountVal = Number(popAmount.value)
    if (isNaN(amountVal) || amountVal <= 0) {
        showToast.value = true; yesno.value = false; showtext.value = t('dating_validAmount');
        setTimeout(() => showToast.value = false, 1200)
        return
    }
    if (!popCause.value.trim()) {
        showToast.value = true; yesno.value = false; showtext.value = t('dating_inputNoteTip');
        setTimeout(() => showToast.value = false, 1200)
        return
    }

    // 组装入参：status=2，to_status=1
    let formData: any = {
        order_no: currentItem.order_no,
        user_id: Number(userInfo.id),
        amount: amountVal,
        release_amount: 0,
        cause: popCause.value.trim(),
        main_id: currentItem.id ?? 0,
        to_id: Number(currentItem.to_id),
        status: 2,
        to_status: 1
    }

    try {
        const res = await request.post('/api/capital/deposit/add', formData)
        if (res.data.code === 200) {
            showDepositPop.value = false
            showToast.value = true;
            yesno.value = true;
            showtext.value = t('dating_submitSuccess');
            setTimeout(() => showToast.value = false, 1200);
            // 刷新数据
            await getUnFinishOrder()
            await queryDetail()
        } else {
            showToast.value = true;
            yesno.value = false;
            showtext.value = t('dating_submitFail');
            setTimeout(() => showToast.value = false, 1200);
        }
    } catch (err) {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('dating_submitFail');
        setTimeout(() => showToast.value = false, 1200);
    }
}
// 第一步：填金额弹窗
const showAmountPop = ref(false)
// 第二步：输资金密码弹窗
const showPayPwdPop = ref(false)
// 临时缓存数据
let stepItem: any = null
let stepAmount = ref('')

// 打开第一步金额弹窗
const gotoopenPop = (item: any) => {
    stepItem = item
    stepAmount.value = ''
    showAmountPop.value = true
}

// 第一步：校验余额接口
const checkUserBalance = async () => {
    const num = Number(stepItem.deposit_amount)
    if (isNaN(num) || num <= 0) {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('dating_validAmount');
        setTimeout(() => showToast.value = false, 1200)
        return
    }

    try {
        const { data } = await request.post('/api/capital/check-balance', {
            user_id: userInfo.id,
            amount: num
        })
        console.log(data, data.code)
        if (data.code === 1) {
            // 余额充足，关闭金额弹窗，打开密码弹窗
            showAmountPop.value = false
            showPayPwdPop.value = true
        } else {
            showToast.value = true;
            yesno.value = false;
            showtext.value = t('dating_payFailTip');
            setTimeout(() => showToast.value = false, 1200)
        }
    } catch {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('dating_payFailTip');
        setTimeout(() => showToast.value = false, 1200)
    }
}

// 第二步：密码验证 + 执行转账扣款
const submitPayWithPwd = async () => {
    const pwd = payPwd.value.trim()
    const num = Number(stepItem.deposit_amount)
    if (!pwd) {
        showToast.value = true; yesno.value = false; showtext.value = t('dating_inputPwdTip');
        setTimeout(() => showToast.value = false, 1200)
        return
    }
    try {

        const { data } = await request.post('/api/capital/do-pay-transfer', {
            id: stepItem.deposit_id,
            order_no: stepItem.order_no,
            from_id: userInfo.id,
            to_id: stepItem.to_id,
            amount: num,
            fund_password: pwd
        })
        if (data.code === 1) {
            showPayPwdPop.value = false
            payPwd.value = ''
            showToast.value = true;
            yesno.value = true;
            showtext.value = t('dating_paySuccess');
            setTimeout(() => showToast.value = false, 1200)
            // 刷新全部数据
            await loadUserInfo()
            await getUnFinishOrder()
            await queryDetail()
        } else {
            showToast.value = true; yesno.value = false; showtext.value = data.msg;
            setTimeout(() => showToast.value = false, 1200)
        }
    } catch {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('dating_requestFail');
        setTimeout(() => showToast.value = false, 1200)
    }
}
// 获取套餐列表
const packageList = ref<any[]>([])
const totalBuyCount = ref(0)
const getPackageList = async () => {
  try {
    // 修复：get 第二个参数是配置对象，参数放在 params 里
    const { data: res } = await request.get('/api/recharge/package/list', {
      params: {
        user_id: userInfo.id,
      }
    })
    if (res.code === 200) {
      packageList.value = res.data || []
      totalBuyCount.value = packageList.value.reduce((sum, item) => {
        return sum + (Number(item.buy_count) || 0)
      }, 0)
    }
  } catch {
    showToast.value = true
    yesno.value = false
    showtext.value = t('dating_requestFail')
    setTimeout(() => showToast.value = false, 1200)
  }
}
// 密码框变量
const payPwd = ref('')
onMounted(async () => {
    await loadUserInfo()
    getPackageList()
    if (userInfo.id) getUnFinishOrder()
    const lastPath = localStorage.getItem('last_path');
    if (lastPath && route.path === '/') router.replace(lastPath);
    
});
</script>

<style scoped>
/* ========== 全局布局 100% 完全和你给的模板一样 ========== */
.mb-4 {
    margin-bottom: 18px;
}

.done-text h4 {
    color: #409eff;
    margin: 0 0 4px;
}

.wait-text h4 {
    color: #999;
    margin: 0 0 4px;
}

.done-text p,
.wait-text p {
    font-size: 13px;
    color: #666;
    margin: 0;
}

.main {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #000;
    font-family: "Microsoft YaHei", sans-serif;
    overflow: hidden;
}

.register-container {
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.register-all {
    width: 100%;
    max-width: 500px;
    height: 100vh !important;
    position: relative;
}

/* ========== 顶部标题 完全统一 ========== */
.allar-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 500px;
    margin: 0 auto;
    z-index: 999;
    display: flex;
    align-items: center;
    padding: 9px 0;
    background: #141414;
}

.allar-top-a {
    font-size: 15px;
    font-weight: bold;
    color: #a88035;
    text-align: center;
    width: 100%;
    margin-right: 40px;
}

/* ========== 滚动容器 完全统一 ========== */
.content-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    background: #111;
}

/* ========== 你原来的样式 全部保留 ========== */
.vipall {
    /* background-color: #181818; */
    padding: 0 20px;
    height: 100%;
}

.viptext {
    display: flex;
    flex-direction: row;
    padding: 5px 20px;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px rgb(48, 48, 48);
    margin-bottom: 5px;
    background: linear-gradient(160deg, #ff9e30 60%, #f8df6d);
}

.upgrade {
    width: 15%;
    background-color: #f706eb;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    margin-top: 17.5px;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    text-align: center;
}

.copy-toastas {
    position: fixed;
    width: 100%;
    max-width: 500px;
    min-width: 200px;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
}

.buttdgr {
    background-color: #71a761;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
    font-size: 13px;
    cursor: pointer;
}

.buttdgraa {
    background-color: #cc7c21;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
    font-size: 13px;
    cursor: pointer;
}

.copy-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 200px;
    transform: translate(-50%, -50%);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 9999;
    background-color: #000000;
}

.order-buttons {
    display: flex;
    gap: 8px;
    flex-direction: column;
    background-color: #2c2c2c;
    width: 100%;
    padding: 10px 0;
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    border-bottom: 2px solid #222;
    background: #222;
    color: #ccc;
    font-size: 13px;
    cursor: pointer;
}

.tab-item.active {
    color: #fa02bc;
    border-bottom: 2px solid #fa02bc;
}

.status {
    background-color: #f706eb;
    color: #fff;
    padding: 2px 5px;
    border-radius: 5px;
    margin-top: 5px;
}

.processto {
    color: #fff;
    font-size: 12px;
    background-color: #a05601;
    padding: 2px 10px;
    display: flex;
    border-radius: 6px;
}

.processtoa {
    color: #fff;
    font-size: 12px;
    background-color: #353535;
    padding: 2px 10px;
    display: flex;
    border-radius: 6px;
}

.processtob {
    color: #fff;
    font-size: 12px;
    background-color: #01750b;
    padding: 2px 10px;
    display: flex;
    border-radius: 6px;
}

::-webkit-scrollbar {
    display: none;
}

:global(html),
:global(body) {
    background: #111 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}
</style>