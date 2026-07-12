<template>
    <div class="main">
        <div class="chat-container">
            <div class="chat-header">
                <div class="header-left" @click="goBack">
                    <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                </div>
                <div class="header-info">
                    <div class="name">
                        {{ loadingUser ? $t('loading') : currentContact.name }}
                    </div>
                </div>

            </div>

            <div class="chat-content" ref="chatContainer" @scroll="handleChatScroll">
                <div class="message-list" @click="buttyesno = false; showEmojiPanel = false">
                    <!-- <div style="width: 100%;">提示</div>====================================================================== -->
                    <div v-if="loadingHistory" style="text-align:center; color:#999;">
                        {{ $t('loadingMessages') }}
                    </div>
                    <div v-for="(msg, index) in messages" :key="msg.id" class="message-item"
                        :class="{ 'my-msg': msg.isMine }">
                        <div v-if="!msg.isMine" class="avatar" @click="userxeiqi">
                            <img :src="baseURL + currentContact.avatar" alt="" loading="lazy" />
                        </div>
                        <div v-if="msg.isMine" class="message-time">{{ formatTime(msg.timestamp) }}</div>

                        <!-- 转账卡片 -->
                        <div v-if="msg.type == 3" class="message-bubble transfer-card"
                            :class="{ 'my-bubble': msg.isMine }">
                            <div style="width: 250px;height: 100px;background-color: #fa33fa;border-radius: 7px;">
                                <div
                                    style="height: 70px;background-color: #fd99fd;display: flex;flex-direction: row;justify-content: center;align-items: center;border-radius: 7px 7px 0 0;">
                                    <Icon icon="material-symbols:currency-exchange-rounded" width="30"
                                        style="color: #000;margin: 10px;" />
                                    <div style="display: flex;flex-direction: column;width: 180px;text-align: left;">
                                        <div style="font-size: 14px;line-height: 20px;">${{ msg.content }}</div>
                                        <div
                                            style="font-size: 14px;line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ msg.isMine ? $t('youTransferTo') + currentContact.name :
                                                $t('transferToYou') }}
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size: 14px;line-height: 25px;text-align: center;color: #fff;">
                                    {{ msg.isMine ? $t('transfer') : $t('transfer') }}
                                </div>
                            </div>
                        </div>

                        <!-- 约会卡片 -->
                        <div v-if="msg.type == 4" class="message-bubble transfer-card"
                            :class="{ 'my-bubble': msg.isMine }">
                            <div style="width: 250px; height: 100px; background-color: #72a1f6; border-radius: 7px;">
                                <div
                                    style="height: 70px; background-color: #8bb5ff; display: flex; flex-direction: row; justify-content: center; align-items: center; border-radius: 7px 7px 0 0;">
                                    <Icon icon="material-symbols:favorite-outline" width="30"
                                        style="color: #fff; margin: 10px;" />
                                    <div style="display: flex; flex-direction: column; width: 180px; text-align: left;">
                                        <div style="font-size: 14px; line-height: 20px; color: #fff;">{{
                                            $t('dateInvite') }}</div>
                                        <div
                                            style="font-size: 14px; line-height: 20px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ msg.isMine ? $t('youSentDateInvite') + currentContact.name :
                                                $t('receivedDateInviteFrom') }}
                                        </div>
                                    </div>
                                </div>
                                <div style="font-size: 14px; line-height: 30px; text-align: center; color: #fff;">
                                    {{ msg.isMine ? $t('sendDateInvite') : $t('receiveDateInvite') }}
                                </div>
                            </div>
                        </div>
                        <!-- 商品消息卡片 ========================== ✅ 新增 -->
                        <div v-if="msg.type === 7" class="message-bubble goods-card"
                            :class="{ 'my-bubble': msg.isMine }" @click="goGoodsDetail(msg.content)">
                            <div
                                style="display: flex; align-items: center; padding: 8px; gap: 5px;flex-direction: column;">
                                <div style="width: 200px; height: 200px; border-radius: 6px; overflow: hidden;">
                                    <img :src="baseURL + msg.goodsCover"
                                        style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                                </div>
                                <div
                                    style="min-width: 0;display: flex;flex-direction: column; justify-content: left;text-align: left;width: 100%;">
                                    <div
                                        style="width: 205px; color: #000;font-size: 14px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;max-width: 100%;">
                                        {{ msg.goodsName }}
                                    </div>
                                    <div style="color: #000; font-size: 11px;">
                                        <span> {{ $t('shop_intimate_price') }}:</span>
                                        <span>$</span>
                                        <span style="color: #ff40ff; font-size: 18px; font-weight: bold;">{{
                                            msg.goodsPrice }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="msg.type === 'text'" class="message-bubble" style="padding:5px 10px;"
                            :class="{ 'my-bubble': msg.isMine }">
                            <div class="message-text">{{ msg.content }}</div>
                        </div>

                        <img v-else-if="msg.type === 'image'" :src="baseURL + msg.content" class="message-image"
                            @click="openBigImage(msg.content)" loading="lazy" />
                        <video v-else-if="msg.type === 'video'" class="message-video" controls preload="metadata"
                            loading="lazy">
                            <source :src="baseURL + msg.content" type="video/mp4">
                        </video>
                        <div v-if="!msg.isMine" class="message-time">{{ formatTime(msg.timestamp) }}</div>
                        <div v-if="msg.isMine" class="avatar">
                            <img :src="baseURL + userInfo.avatar" alt="me" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-input-bar">
                <div class="input-wrapper">
                    <div
                        style="display: flex;align-items:end;gap: 3px;padding: 10px 5px 10px 5px; border-bottom: 1px solid #979292;">
                        <div class="emoji-btn" @click.stop="toggleEmojiPanel">
                            <Icon icon="material-symbols:mood-rounded" width="30" color="#333" />
                        </div>
                        <!-- 文字输入框 -->
                        <el-input v-if="!isVoiceMode" v-model="inputMessage" type="textarea" :rows="1"
                            :autosize="{ minRows: 1, maxRows: 3 }" @keyup.enter="handleEnter" class="auto-textarea"
                            @click="buttyesno = false; showEmojiPanel = false" />

                        <div class="send-btnaa" @click="buttorps">
                            <Icon icon="tabler:circle-plus" width="32" style="color: #000;" />
                        </div>
                        <div v-if="!isVoiceMode" class="send-btn" @click="sendMessage" :disabled="!inputMessage.trim()">
                            {{ $t('send') }}
                        </div>
                    </div>

                    <div v-if="showEmojiPanel" class="emoji-panel">
                        <div class="emoji-list">
                            <div v-for="emoji in emojiList" :key="emoji" class="emoji-item" @click="insertEmoji(emoji)">
                                {{ emoji }}
                            </div>
                        </div>
                    </div>

                    <div v-if="buttyesno" class="buttyesno" style="padding: 0;">
                        <div
                            style="display: flex;flex-direction: row;align-items: flex-start;width: 100%;padding: 0 20px;">
                            <div class="image-pickerall">
                                <div style="background-color: #fff;border-radius: 6px;">
                                    <label class="image-picker">
                                        <Icon icon="material-symbols:add-photo-alternate-rounded" width="50"
                                            style="color: #000;" />
                                        <input type="file" accept="image/*" hidden @change="sendImage" />
                                    </label>
                                </div>
                                <div
                                    style="font-size: 12px;padding-top: 8px;max-width: 48px;word-wrap: break-word; white-space: normal;text-align: center;">
                                    Photo</div>
                            </div>
                            <div class="image-pickerall" @click="zuzjkdsoa = true">
                                <div style="background-color: #fff;border-radius: 6px;">
                                    <label class="image-picker">
                                        <Icon icon="material-symbols:currency-exchange-rounded" width="40"
                                            style="color: #000;" />
                                    </label>
                                </div>
                                <div
                                    style="font-size: 12px;padding-top: 8px;max-width: 48px;word-wrap: break-word; white-space: normal;text-align: center;">
                                    {{ $t('transfer') }}</div>
                            </div>
                            <div class="image-pickerall" @click="showToastsdadtrue">
                                <div style="background-color: #fff;border-radius: 6px;">
                                    <label class="image-picker">
                                        <Icon icon="material-symbols:ecg-rounded" width="48" style="color: #000;" />
                                    </label>
                                </div>
                                <div
                                    style="font-size: 12px;padding-top: 8px;max-width: 48px;word-wrap: break-word; white-space: normal;text-align: center;">
                                    {{ $t('dateInvite') }}</div>
                            </div>
                            <div class="image-pickerall">
                                <div style="background-color: #fff;border-radius: 6px;">
                                    <label class="image-picker">
                                        <Icon icon="mingcute:video-fill" width="48" style="color: #000;" />
                                        <input type="file" accept="video/*" hidden @change="sendVideo" />
                                    </label>
                                </div>
                                <div
                                    style="font-size: 12px;padding-top: 8px;max-width: 48px;word-wrap: break-word; white-space: normal;text-align: center;">
                                    Video</div>
                            </div>
                            <div class="image-pickerall" @click="showToastshop = true" v-if="user.role_level > 1">
                                <div style="background-color: #fff;border-radius: 6px;">
                                    <label class="image-picker">
                                        <Icon icon="material-symbols:shopping-cart-checkout-rounded" width="48"
                                            style="color: #000;" />
                                    </label>
                                </div>
                                <div
                                    style="font-size: 12px;padding-top: 8px;max-width: 48px;word-wrap: break-word; white-space: normal;text-align: center;">
                                    {{ $t('dating') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showBigImg" class="big-image-layer" @click="showBigImg = false">
            <img :src="bigImageUrl" class="big-img" />
        </div>
        <!-- ================== 商城弹窗（底部滑出，复刻你的商城列表） ================== -->
        <div class="shop-modal-mask" v-if="showToastshop">
            <div class="shop-modal" @click.stop>
                <div class="shop-modal-header">
                    <div @click="showToastshop = false">取消</div>
                    <el-button type="primary" size="small" @click="sendGoodsToChat"
                        :disabled="!selectedGoodId">发送到聊天</el-button>
                </div>
                <div style="margin: 0 10px;">
                    <div class="shop-modal-body">
                        <!-- 搜索 -->
                        <div style="padding-top: 8px;display: flex;">
                            <input v-model="shopSearchKey" @input="searchShopGoods" placeholder="搜索商品"
                                style="flex: 1;padding: 0 10px; height:30px; border-radius:6px; border:none; outline:none; font-size:12px;">
                        </div>
                        <!-- 商品列表 -->
                        <div class="waterfall-box-modal">
                            <div class="waterfall-item-modal" v-for="item in shopShowList" :key="item.id"
                                @click="selectedGoodId = item.id" :class="{ active: selectedGoodId === item.id }">
                                <div class="waterfall-item-all-modal">
                                    <div style="width:100%; aspect-ratio:1/1; border-radius:6px; overflow:hidden;">
                                        <img :src="baseURL + item.cover"
                                            style="width:100%; height:100%; object-fit:cover;">
                                    </div>
                                    <div style="padding:5px 10px 10px 10px; text-align:left;">
                                        <div
                                            style="color:#fff; font-size:11px; line-height:1.4; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:1;line-clamp: 1; -webkit-box-orient:vertical;">
                                            {{ item.name }}
                                        </div>
                                        <div style="color:#ff40ff; font-size:12px; font-weight:bold; margin-top:4px;">
                                            <span style="font-size:9px; color:#fff;">$</span>{{
                                                item.price }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="shopLoading" style="text-align:center; padding:10px; color:#ccc;">加载中...</div>
                            <div v-if="!shopLoading && shopShowList.length === 0"
                                style="text-align:center; padding:20px; color:#999;">暂无商品</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 转账弹窗 -->
        <div class="copy-toastas" v-if="zuzjkdsoa">
            <div
                style="font-size: 30px;width: 100%;height: 120px;display: flex;background-color: #616161;align-items: center;">
                <div class="avatarimg" style="margin: 0 15px 0 30px;">
                    <img :src="baseURL + currentContact.avatar" alt="" />
                </div>
                <div style="font-size: 16px;">{{ $t('transferToYou') }}:{{ currentContact.name }}</div>
            </div>
            <div
                style="border-radius: 30px 30px 0 0;background-color: #fff;width: 100%;color: #000;text-align: left;position: relative;margin-top: auto;flex: 1;">
                <div style="font-size: 16px;margin-top: 30px;margin-left: 30px;">{{ $t('transferAmount') }}</div>
                <div style="font-size: 36px;margin-top: 10px;margin-left: 30px;font-weight: bold;">
                    <div class="form-input">${{ mnilslo }}</div>
                </div>

                <div style="display: flex;flex-direction: row;margin: 50px 20px 20px 20px;gap: 15px;">
                    <div class="buttdgr" @click="roosqaz">{{ $t('cancel') }}</div>
                </div>
            </div>
            <div
                style="background-color: #c0c0c0;display: flex;flex-direction: column;padding-bottom: 30px; flex-shrink: 0;width: 100%;">
                <div style="display: flex;flex-direction: column;gap: 10px;">
                    <div style="display: flex;flex-direction: row;gap: 10px;margin:10px 10px 0 10px;">
                        <div class="textone" @click="textNumber('1')">1</div>
                        <div class="textone" @click="textNumber('2')">2</div>
                        <div class="textone" @click="textNumber('3')">3</div>
                        <div class="textone" @click="textNumber('a')">
                            <Icon icon="mdi:clear" width="30" />
                        </div>
                    </div>
                    <div style="display: flex;flex-direction: row;">
                        <div style="display: flex;flex-direction: row;flex: 1;">
                            <div style="display: flex;flex-direction: column;width: 24.5%;">
                                <div style="display: flex;flex-direction: column;flex: 1; gap: 10px;margin-left: 10px;">
                                    <div class="textone" @click="textNumber('4')">4</div>
                                    <div class="textone" @click="textNumber('7')">7</div>
                                    <div class="textone" @click="textNumber('0')">0</div>
                                </div>
                            </div>
                            <div style="display: flex;flex-direction: column;width: 51%;gap: 10px;">
                                <div style="display: flex;flex-direction: row;gap: 10px;margin:0 10px;">
                                    <div class="textone" @click="textNumber('5')">5</div>
                                    <div class="textone" @click="textNumber('6')">6</div>
                                </div>
                                <div style="display: flex;flex-direction: row;gap: 10px;margin:0 10px;">
                                    <div class="textone" @click="textNumber('8')">8</div>
                                    <div class="textone" @click="textNumber('9')">9</div>
                                </div>
                                <div style="display: flex;flex-direction: row;gap: 10px;margin:0 10px;">
                                    <div class="textone" @click="textNumber('.')">.</div>
                                </div>
                            </div>
                            <div style="display: flex;flex-direction: row;width: 24.5%;">
                                <div style="display: flex;flex-direction: column;gap: 10px;flex: 1;margin-right: 10px;">
                                    <div class="textone" @click="sendCurrencyCard">{{ $t('transfer') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 提示弹窗 -->
        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesno" />
            </div>
            <div class="toast-text" style="font-size: 14px;">{{ showtext }}</div>
        </div>

        <!-- VIP系统提示 -->
        <div class="copy-toastqwpjg-mask" v-if="toastjfkd">
            <div class="copy-toastqwpjg">
                <div
                    style="color: #fff;background-color: #fd0101;width: 100%;border-radius: 6px 6px 0 0;padding: 5px 0;font-size: 13px;">
                    {{ $t('systemTip') }}
                </div>
                <div style="font-size: 15px;color: #000;margin-top: 20px;">
                    <div style="font-size: 13px;font-weight: 900;">
                        {{ $t('currentVipLevel') }}{{ userVipLevel == '0' ? $t('ordinaryUser') : userVipLevel + 'VIP' }}
                    </div>
                    <div style="font-size: 12px;margin-top: 10px;padding: 0 30px;">{{ toastjfkdtext }}</div>
                </div>
                <div style="margin: 20px;width: 100%;">
                    <div style="display: flex;flex-direction: row;margin: 0 20px 0 20px;gap: 15px;">
                        <div class="buttdgraq" @click="toastjfkd = false">{{ $t('cancel') }}</div>
                        <div class="buttdgraaaq" @click="router.push(`/user_recharge`)" v-if="userVipLevel == '0'">
                            {{ $t('goRecharge') }}
                        </div>
                        <div class="buttdgraaaq" @click="faiqeiyehu" v-else>{{ $t('sendInvite') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 发起约会弹窗 -->
        <div class="copy-toastqwpjg-mask" v-if="showToastsdad">
            <div class="copy-toastqwpjg">
                <div
                    style="margin-bottom: 10px; color: #fff;background-color: #999;width: 100%;border-radius: 6px 6px 0 0;padding: 5px 0;font-size: 13px;">
                    {{ $t('sendDateInvite') }}
                </div>
                <div v-for="item in packageList" :key="item.id">
                    <div
                        style="gap: 5px; display: flex;flex-direction: row;text-align: left;justify-content: center;margin-left: 10px;padding: 5px 0;align-items: center;">
                        <div style="color: #000;font-weight: bold;font-size: 15px;">{{ $t('order_amount') }}</div>
                        <div style="color: #000;font-size: 12px;">${{ item.package_price }}</div>
                        <div style="font-size: 12px;color: #000;"> {{ $t('oneTime') }}: {{ item.card_num }}</div>
                        <div style="font-size: 12px;color: #000;">{{ $t('order_quantity') }}：{{ item.buy_count }}{{ item.buycount
 }}</div>
                       
                         <div style="background-color: #ff40ff;padding: 3px 10px;font-size: 11px;border-radius: 6px;"
                            @click="router.push(`/user_recharge`)" v-if="item.buy_count == '0'">
                            {{ $t('buyNow') }}
                        </div>
                         <div v-else style="background-color: #ff40ff;padding: 3px 10px;font-size: 11px;border-radius: 6px;"
                            @click="faiqeiyehu(item)">{{ $t('sendInvite') }}
                        </div>
                    </div>
                </div>
                <div style="margin: 20px;width: 100%;">
                    <div style="display: flex;flex-direction: row;margin: 0 20px 0 20px;gap: 15px;">
                        <div style="background-color: #999;padding: 3px 10px;font-size: 13px;border-radius: 6px;"
                            @click="showToastsdad = false, buttyesno = false">{{ $t('cancel') }}
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>
        <!-- ================== 资金密码弹窗 ================== -->
        <div class="copy-toastqwpjg-mask" v-if="showPwdDialog" style="z-index: 99999;">
            <div class="copy-toastqwpjg" style="padding: 20px;z-index: 99999;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color:#000;">
                    {{ $t('enterFundPassword') }}
                </div>

                <el-input v-model="fundPwd" type="password" placeholder="请输入资金密码" show-password
                    style="width: 250px; margin-bottom: 20px;" />

                <div style="display: flex; gap: 15px; width: 250px;">
                    <div class="buttdgr" @click="closePwdDialog">
                        {{ $t('cancel') }}
                    </div>
                    <div class="buttdgraa" @click="confirmFundPwd">
                        {{ $t('confirm') }}
                    </div>
                </div>
            </div>
        </div>

        <!-- ================== 设置资金密码弹窗（密码为空时弹出） ================== -->
        <div class="copy-toastqwpjg-mask" v-if="showSetPwdDialog" style="z-index: 99999;">
            <div class="copy-toastqwpjg" style="padding: 20px;z-index: 99999;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color:#000;">
                    {{ $t('setFundPassword') }}
                </div>

                <el-input v-model="newPwd" type="password" placeholder="请输入新资金密码" show-password
                    style="width: 250px; margin-bottom: 10px;" />
                <el-input v-model="confirmPwd" type="password" placeholder="请确认新资金密码" show-password
                    style="width: 250px; margin-bottom: 20px;" />

                <div style="display: flex; gap: 15px; width: 250px;">
                    <div class="buttdgr" @click="showSetPwdDialog = false">
                        {{ $t('cancel') }}
                    </div>
                    <div class="buttdgraa" @click="submitSetFundPwd">
                        {{ $t('confirmSet') }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import { io } from 'socket.io-client';
import { ElInput } from 'element-plus';
import 'element-plus/dist/index.css';

const user_service = () => router.push('/message/235787');
//限制提示
const toastjfkd = ref<boolean>(false);
const toastjfkdtext = ref('');

const showToast = ref<boolean>(false);
const showToastsdad = ref<boolean>(false);

const yesno = ref(false);
const showtext = ref('');
const baseURL = request.defaults.baseURL || ''
const buttyesno = ref(false);
const mnilslo = ref('')
const { t } = useI18n();

// 资金密码弹窗
const showPwdDialog = ref(false)
const fundPwd = ref('')

// 设置资金密码弹窗
const showSetPwdDialog = ref(false)
const newPwd = ref('')
const confirmPwd = ref('')

// 关闭资金密码弹窗
const closePwdDialog = () => {
    showPwdDialog.value = false
    fundPwd.value = ''
}

// 表情面板
const showEmojiPanel = ref(false);
const emojiList = ref([
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤩', '🥳', '😎', '🤓', '🥺',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥱', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵',
    '🥶', '😶', '😐', '😑', '😬', '😮', '🤐', '😯', '😲', '🥴',
    '😵', '😴', '🤕', '🤢', '🤮', '🤧', '😷', '🤠', '🤡', '👻'
]);

const insertEmoji = (emoji: string) => {
    inputMessage.value += emoji;
    showEmojiPanel.value = false;
};
const toggleEmojiPanel = () => {
    showEmojiPanel.value = !showEmojiPanel.value;
    buttyesno.value = false;
};

interface Message {
    type: 'text' | 'image' | 'audio' | 'video' | 3 | 4 | 7;
    id: number;
    content: string;
    duration?: string;
    timestamp: number;
    isMine: boolean;
    isSystem?: boolean;
    goodsName?: string;    // 新增
    goodsCover?: string;   // 新增
    goodsPrice?: string;   // 新增
    senderId?: number;     // 新增
}
const zuzjkdsoa = ref(false)
const roosqaz = () => {
    zuzjkdsoa.value = false
    buttyesno.value = false
}
const textNumber = (num: any) => {
    let value = mnilslo.value;
    if (num === 'a') {
        mnilslo.value = '';
        return;
    }
    let temp = value + num;
    if (temp.startsWith('.')) {
        temp = '0' + temp;
    }
    if (temp.startsWith('0') && temp.length > 1 && temp[1] !== '.') {
        temp = temp.replace(/^0+/, '');
        if (temp === '') temp = '0';
    }
    mnilslo.value = temp;
};

const router = useRouter();
const route = useRoute();
const chatContainer = ref<HTMLElement | null>(null);
const inputMessage = ref('');

// ==================== 语音相关 ====================
const isVoiceMode = ref(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);


const buttorps = () => {
    buttyesno.value = !buttyesno.value
    showEmojiPanel.value = false;
}
const getUserId = () => {
    try {
        const u = localStorage.getItem('user');
        if (!u) return 0;
        const user = JSON.parse(u);
        return user.id || 0;
    } catch {
        return 0;
    }
};

const myId = ref(getUserId());
const toId = ref(Number(route.params.id));
const loadingUser = ref(true);
const loadingHistory = ref(true);

const currentContact = ref({
    id: toId.value,
    name: '',
    avatar: '',
    date_card_num: '',
});

const messages = ref<Message[]>([]);
const showBigImg = ref(false);
const bigImageUrl = ref('');
let socket: any = null;

//用户信息
const getContactInfo = async () => {
    try {
        const { data } = await request({
            url: '/api/chat/info',
            method: 'POST',
            data: { userId: toId.value }
        });
        if (data?.code === 1 && data.data) {
            currentContact.value = {
                id: data.data.id,
                name: data.data.nickname,
                avatar: data.data.avatar,
                date_card_num: data.data.date_card_num
            };
        }
    } catch (err) { } finally {
        loadingUser.value = false;
    }
};
const page = ref(1)
const pageSize = ref(50)
const finished = ref(false)

//历史消息
const getMessageList = async () => {
    if (!myId.value || !toId.value || finished.value) {
        loadingHistory.value = false;
        return;
    }
    try {
        const { data } = await request.post('/api/chat/history', {
            fromId: myId.value,
            toId: toId.value,
            page: page.value,
            limit: pageSize.value
        });

        if (data?.code === 1 && data.data?.length) {
            const list = data.data.map((item: any) => {
                let content = item.content;
                let goodsName = '';
                let goodsCover = '';
                let goodsPrice = '';

                // 商品消息：解析JSON
                if (item.msg_type == 7) {
                    try {
                        const j = JSON.parse(item.content);
                        content = j.goods_id;
                        goodsName = j.name;
                        goodsCover = j.cover;
                        goodsPrice = j.price;
                    } catch (e) { }
                }

                return {
                    id: item.id,
                    type: item.msg_type === 2 ? 'image' :
                        item.msg_type === 3 ? 3 :
                            item.msg_type === 4 ? 4 :
                                item.msg_type === 5 ? 'audio' :
                                    item.msg_type === 6 ? 'video' :
                                        item.msg_type === 7 ? 7 : 'text',
                    content: content,
                    goodsName: goodsName,
                    goodsCover: goodsCover,
                    goodsPrice: goodsPrice,
                    duration: item.duration || '00:00',
                    timestamp: new Date(item.create_time).getTime(),
                    isMine: item.from_id === myId.value
                };
            });

            messages.value = [...list, ...messages.value];

            if (list.length < pageSize.value) {
                finished.value = true;
            }
        } else {
            finished.value = true;
        }
    } catch (err) { }
    finally {
        loadingHistory.value = false;
        if (page.value === 1) nextTick(scrollToBottom);
    }
};
const loadMoreOldMessage = async () => {
    if (loadingHistory.value || finished.value) return;
    loadingHistory.value = true;
    page.value += 1;
    await getMessageList();
    loadingHistory.value = false;
};

const handleChatScroll = () => {
    const el = chatContainer.value;
    if (!el) return;
    if (el.scrollTop <= 20) {
        loadMoreOldMessage();
    }
};

// ==============================================
// 统一检查：聊天条数超限（返回 true=拦截，false=通过）
// ==============================================
// const checkChatMessageLimit = async () => {
//     try {
//         const { data } = await request.post('/api/chat/msgCount', {
//             fromId: myId.value,
//             toId: toId.value
//         })
//         if (data.data?.total >= 10) {
//             toastjfkd.value = true
//             buttyesno.value = false
//             showToastsdad.value = false
//             toastjfkdtext.value = t('vipLimitTip')
//             return true
//         }
//     } catch (err) { }
//     return false
// }


// ==============================================
// 统一权限检查：所有发送前调用
// ==============================================
const checkCanSend = async () => {
    getCurrentUserInfo()
    // if (userVipLevel.value < '1') {
    //     const limited = await checkChatMessageLimit()
    //     if (limited) return true // 已超限
    // }
    return false
}
// 发送视频
const sendVideo = async (e: Event) => {
    //   const cannotSend = await checkCanSend()
    //   if (cannotSend) return

    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fromId', String(myId.value))
    formData.append('toId', String(toId.value))

    try {
        // ✅ 你的后端就是这个接口，自动识别图片/视频
        const { data } = await request.post('/api/chat/upload-image', formData)

        if (data?.code === 1) {
            buttyesno.value = false
            nextTick(scrollToBottom)
        }
    } catch (err) {
        console.error('发送失败', err)
    }

    target.value = ''
};
// ==============================================
// 发送文字（已修复）
// ==============================================
const sendMessage = async () => {
    if (!inputMessage.value?.trim()) return

    // 检查权限
    const cannotSend = await checkCanSend()
    if (cannotSend) return

    const content = inputMessage.value.trim()
    try {
        await request.post('/api/chat/send', {
            fromId: myId.value,
            toId: toId.value,
            content,
            msgType: 1
        })
    } catch (err) { }

    inputMessage.value = ''
    showEmojiPanel.value = false
    nextTick(scrollToBottom)
}

// ==============================================
// 发起约会（修复：先检查权限）
// ==============================================
const faiqeiyehu = async (item:any) => {
    const cannotSend = await checkCanSend()
    if (cannotSend) return
console.log(myId.value,item.buy_count,item.package_id,'55555555555555555')
    try {
        const { data } = await request.post('/api/chat/send-date-apply', {
            fromId: myId.value,
            toId: toId.value,
            textyh: t('dateInvite'),
            amount: item.buy_count,
            targetPackageId: item.package_id,
        });

        if (data.code === 1) {
            showToastsdad.value = false;
            buttyesno.value = false;
            nextTick(scrollToBottom);
            getContactInfo()
        } else {
            showToast.value = true;
            showtext.value =t('insufficientDateCards');
            setTimeout(() => showToast.value = false, 1000);
        }
    } catch (err) { }
};

//转账【增加资金密码验证】
const sendCurrencyCard = async () => {
    getCurrentUserInfo()
    let content = mnilslo.value.trim();
    if (content.startsWith('.')) {
        content = '0' + content;
    }
    if (content.startsWith('0') && content.length > 1 && content[1] !== '.') {
        content = content.replace(/^0+/, '');
        if (content === '') content = '0';
    }
    if (!content) {
        showToast.value = true;
        showtext.value = t('pleaseEnterAmount');
        setTimeout(() => showToast.value = false, 1000);
        return;
    }
    const money = parseFloat(content);
    if (isNaN(money) || money <= 0) {
        showToast.value = true;
        showtext.value = t('invalidAmount');
        setTimeout(() => showToast.value = false, 1000);
        return;
    }

    // ========== 新增：弹出资金密码输入框 ==========
    showPwdDialog.value = true
};
// 确认资金密码（转账核心）
const confirmFundPwd = async () => {
    if (!fundPwd.value.trim()) {
        showToast.value = true
        showtext.value = t('pleaseEnterFundPassword')
        setTimeout(() => showToast.value = false, 1500)
        return
    }

    const content = mnilslo.value.trim()
    try {
        // 后端接口：验证密码 + 转账（你后端要接收 pay_pwd 参数）
        const { data } = await request.post('/api/chat/sendcurren', {
            fromId: myId.value,
            toId: toId.value,
            content,
            msgType: 3,
            pay_pwd: fundPwd.value  // 密码传给后端
        });

        if (data.code === 1) {
            // 转账成功
            zuzjkdsoa.value = false;
            buttyesno.value = false;
            mnilslo.value = '';
            closePwdDialog()
            nextTick(scrollToBottom);

            showToast.value = true
            yesno.value = true
            showtext.value = t('transferSuccess')
            setTimeout(() => showToast.value = false, 1500)
        }
        // ========== 后端返回：未设置资金密码 ==========
        else if (data.code === 2001 || data.msg?.includes('未设置') || data.msg?.includes('密码为空')) {
            closePwdDialog()
            showToast.value = true
            showtext.value = t('pleaseSetFundPassword')
            setTimeout(() => {
                showToast.value = false
                // 弹出设置资金密码弹窗
                showSetPwdDialog.value = true
            }, 1500)
        }
        // ========== 密码错误 ==========
        else {
            showToast.value = true
            yesno.value = false
            showtext.value = data.msg || t('passwordError')
            setTimeout(() => showToast.value = false, 1500)
        }
    } catch (err) {
        showToast.value = true
        yesno.value = false
        showtext.value = t('transferFailed')
        setTimeout(() => showToast.value = false, 1500)
    }
};
// 设置资金密码
const submitSetFundPwd = async () => {
    if (!newPwd.value.trim() || !confirmPwd.value.trim()) {
        showToast.value = true
        showtext.value = t('pleaseEnterCompletePwd')
        setTimeout(() => showToast.value = false, 1500)
        return
    }

    if (newPwd.value !== confirmPwd.value) {
        showToast.value = true
        showtext.value = t('pwdNotMatch')
        setTimeout(() => showToast.value = false, 1500)
        return
    }

    try {
        const { data } = await request.post('/api/user/set-fund-pwd', {
            user_id: myId.value,
            pay_pwd: newPwd.value
        })

        if (data.code === 1) {
            showToast.value = true
            yesno.value = true
            showtext.value = t('setPwdSuccess')
            setTimeout(() => {
                showToast.value = false
                showSetPwdDialog.value = false
                newPwd.value = ''
                confirmPwd.value = ''
            }, 1500)
        } else {
            showToast.value = true
            yesno.value = false
            showtext.value = data.msg || t('setPwdFailed')
            setTimeout(() => showToast.value = false, 1500)
        }
    } catch (err) {
        showToast.value = true
        yesno.value = false
        showtext.value = t('setPwdFailed')
        setTimeout(() => showToast.value = false, 1500)
    }
}

const goBack = () => router.go(-1);
const userxeiqi = () => router.push(`/artist?id=${currentContact.value.id}`);

const handleEnter = (e: KeyboardEvent) => {
    if (!e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

// ==============================================
// 发送图片（修复：先检查权限）
// ==============================================
const sendImage = async (e: Event) => {
    const cannotSend = await checkCanSend()
    if (cannotSend) return

    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fromId', String(myId.value));
        formData.append('toId', String(toId.value));

        // 统一接口，后端自动判断类型
        const { data } = await request.post('/api/chat/upload-image', formData);
        if (data?.code === 1) {
            buttyesno.value = false;
            nextTick(scrollToBottom);
        }
    } catch (err) { }
    target.value = '';
};

const openBigImage = (url: string) => {
    bigImageUrl.value = url;
    showBigImg.value = true;
};

const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
};

const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const userInfo = ref({
    id: '',
    username: '',
    nickname: '',
    avatar: '',
    vip: '',
    balance: '',
    invite_code: '',
    date_card_num: '',
});
const userVipLevel = ref('0');
const datecardnum = ref('0');
const getCurrentUserInfo = async () => {
    try {
        const { data } = await request({
            url: '/api/user/info',
            method: 'POST',
            data: { user_id: myId.value }
        });
        if (data?.code === 1 && data.data) {
            userVipLevel.value = data.data.vip_level || '0';
            datecardnum.value = data.data.date_card_num || '0';
        }
    } catch (err) { }
};

// 获取约会套餐列表
const packageList = ref<any[]>([])
const getPackageList = async () => {
    try {
        // 修复：get 第二个参数是配置对象，参数放在 params 里
        const { data: res } = await request.get('/api/recharge/package/list', {
            params: {
                user_id: myId.value,
            }
        })
        if (res.code === 200) {
            packageList.value = res.data || []
            console.log(packageList.value)
        }
    } catch {
        showToast.value = true
        yesno.value = false
        showtext.value = t('dating_requestFail')
        setTimeout(() => showToast.value = false, 1200)
    }
}
//
const showToastsdadtrue = () => {
    showToastsdad.value = true
    getPackageList()
}
// ================== 商城弹窗商品列表（复刻你的商城页面） ==================
const showToastshop = ref(false)
const shopSearchKey = ref('')
const shopShowList = ref([])
const shopLoading = ref(false)
const shopPage = ref(1)
const shopFinished = ref(false)
const selectedGoodId = ref(null) // 选中商品ID

// 获取商品列表（和你商城接口一样）
const loadShopGoods = async (isRefresh = false) => {
    if (shopLoading.value || (shopFinished.value && !isRefresh)) return
    try {
        shopLoading.value = true
        if (isRefresh) {
            shopPage.value = 1
            shopShowList.value = []
            shopFinished.value = false
        }

        const { data: res } = await request.post('/api/mall/list', {
            page: shopPage.value,
            limit: 10,
            keyword: shopSearchKey.value.trim(),
        })

        if (res.code === 1) {
            const list = res.data || []
            if (isRefresh) {
                shopShowList.value = list
            } else {
                shopShowList.value.push(...list)
            }
            shopFinished.value = list.length < 10
            if (!shopFinished.value) shopPage.value++
        }
    } catch (err) {
    } finally {
        shopLoading.value = false
    }
}

// 搜索
const searchShopGoods = () => {
    shopPage.value = 1
    shopFinished.value = false
    loadShopGoods(true)
}

// 打开弹窗时加载
watch(showToastshop, (val) => {
    if (val) {
        shopSearchKey.value = ''
        loadShopGoods(true)
    }
})
// 跳转商品详情（带 商品ID + 发送人ID）
const goGoodsDetail = (goodsId: string) => {
    // 从本地读取用户信息（你项目本来就存了）
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || ''; // 登录用户ID，永远有值
    router.push({
        path: '/goods-detail',
        query: {
            id: goodsId,
            senderId: userId
        }
    })
}

// 发送商品到聊天（已修复完整）
const sendGoodsToChat = async () => {
    if (!selectedGoodId.value) return
    try {
        await request.post('/api/chat/sendgoods', {
            fromId: myId.value,
            toId: toId.value,
            content: String(selectedGoodId.value),
            msgType: 7,
            goods_id: selectedGoodId.value
        })
        showToastshop.value = false
        selectedGoodId.value = null
    } catch (e) { }
}
onMounted(() => {
    page.value = 1;
    finished.value = false;
    messages.value = [];
    getCurrentUserInfo()
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id || !toId.value) return;

    request.post('/api/chat/mark-read', {
        userId: user.id,
        toId: toId.value
    }).then(() => {
        window.localStorage.setItem(`unread_${toId.value}`, '0');
        window.dispatchEvent(new CustomEvent('clearUnread', { detail: { toId: toId.value } }));
        window.dispatchEvent(new CustomEvent('messageRead'));
    });

    getContactInfo();
    getMessageList();

    try {
        const u = localStorage.getItem('user');
        if (u) userInfo.value = JSON.parse(u);
    } catch (e) { }

    if (!myId.value) return;
    socket = io(request.defaults.baseURL, { transports: ['websocket'] });

    socket.on('connect', () => {
        socket.emit('bindUserId', myId.value);
    });

    socket.on('new_msg', (msg: any) => {
        if (msg.from === toId.value) {
            request.post('/api/chat/mark-read', { userId: myId.value, toId: toId.value });
        }
        if ((msg.from == myId.value && msg.to == toId.value) || (msg.from == toId.value && msg.to == myId.value)) {
            let messageContent = msg.content;
            let goodsName = '';
            let goodsCover = '';
            let goodsPrice = '';

            // 解析商品消息
            if (msg.msgType == 7) {
                try {
                    const goodsJson = JSON.parse(msg.content);
                    messageContent = goodsJson.goods_id;
                    goodsName = goodsJson.name;
                    goodsCover = goodsJson.cover;
                    goodsPrice = goodsJson.price;
                } catch (e) { }
            }

            messages.value.push({
                id: Date.now(),
                type: msg.msgType === 2 ? 'image' :
                    msg.msgType === 3 ? 3 :
                        msg.msgType === 4 ? 4 :
                            msg.msgType === 5 ? 'audio' :
                                msg.msgType === 6 ? 'video' :
                                    msg.msgType === 7 ? 7 : 'text',
                content: messageContent,
                goodsName: goodsName || msg.goods_name,
                goodsCover: goodsCover || msg.goods_cover,
                goodsPrice: goodsPrice || msg.goods_price,
                senderId: msg.from,
                duration: msg.duration || '00:00',
                timestamp: Date.now(),
                isMine: msg.from == myId.value
            });
            nextTick(scrollToBottom);
        }
        window.dispatchEvent(new Event('messageReceived'));
        window.dispatchEvent(new Event('messageRead'));
    });
});

const user = JSON.parse(localStorage.getItem('user') || '{}')
const toIda = ref(route.params.id)
onUnmounted(() => {
    if (socket) socket.disconnect();
    if (!user.id || !toIda.value) return
    request.post('/api/chat/mark-read', { userId: user.id, toId: toId.value }).then(() => {
        window.dispatchEvent(new Event('messageRead'))
    })
    if (audioPlayer.value) audioPlayer.value.pause();
});
</script>
<style scoped>
.main {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: #030008;
    align-items: center;
    font-family: "Microsoft YaHei", sans-serif;
    overflow: hidden;
}

.chat-container {
    width: 100%;
    max-width: 500px;
    height: 100vh;
    background: #f0f0f0be;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
}

.chat-header {
    background: #f1f1f1e3;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;
    flex-shrink: 0;
    padding: 10px 20px;
}

.chat-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px 12px;
    background: #eeeded;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.chat-content::-webkit-scrollbar {
    display: none;
}

.chat-input-bar {
    flex-shrink: 0;
    background: #d8d8d8;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: flex-end;
}

.auto-textarea {
    flex: 1;
    --el-input-textarea-line-height: normal !important;
    font-size: 15px;
}

.auto-textarea :deep(.el-textarea__inner) {
    padding: 8px 12px !important;
    min-height: 36px !important;
    max-height: 120px !important;
    font-size: 16px;
    line-height: normal !important;
    resize: none;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
    display: flex;
    align-items: center;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    background: #ffffff !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.auto-textarea :deep(.el-textarea__inner:focus) {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

.send-btn {
    padding: 7px 7px;
    background: #014da3;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    flex-shrink: 0;
    margin-right: 10px;
    font-size: 13PX;
}

.send-btnaa {
    padding: 0 3px;
    cursor: pointer;
    border: none;
    flex-shrink: 0;
    align-items: center;
    display: flex;
}

.buttyesno {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    padding: 0 20px;
    width: 100%;
    flex-shrink: 0;
    margin-bottom: 20px;
}

/* 表情按钮样式 */
.emoji-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

/* 语音切换按钮 */
.voice-switch-btn {
    /* width: 36px; */
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

/* 按住说话 */
.hold-to-talk {
    flex: 1;
    height: 36px;
    background: #fff;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #333;
    border: 1px solid #ddd;
    cursor: pointer;
    user-select: none;
}

/* 录音中提示 */
.recording-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 20px 30px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 9999;
}

.recording-animation {
    width: 40px;
    height: 40px;
    border: 3px solid #fff;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* 语音消息气泡 */
.audio-bubble {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    padding: 8px 12px;
}

.audio-inner {
    display: flex;
    align-items: center;
    gap: 8px;
}

.audio-duration {
    font-size: 13px;
    color: #333;
}

/* 表情面板 */
.emoji-panel {
    width: 100%;
    background: #fff;
    padding: 10px 10px 30px 10px;
    border-top: 1px solid #eee;
    overflow-y: auto;
}

.emoji-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.emoji-item {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    border-radius: 4px;
}

.emoji-item:hover {
    background: #f0f0f0;
}

.header-left {
    cursor: pointer;
}

.header-info {
    flex: 1;
    text-align: center;
    margin-right: 15px;
}

.name {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.message-item {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    align-items: flex-start;
}

.message-item.my-msg {
    justify-content: flex-end;
}

.message-text {
    font-size: 16px;
    padding: 4px;
}

.avatar {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatarimg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
}

.avatarimg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-bubble {
    padding: 5px 0;
    border-radius: 4px;
    background: #fff;
    max-width: 65%;
    font-size: 14px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    text-align: left;
}

.message-item.my-msg .message-bubble {
    background: #f8c3f8;
}

.message-item:not(.my-msg) .message-bubble {
    background: #fff;
}

.message-time {
    font-size: 11px;
    color: #666;
    align-self: flex-end;
}

.message-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
    object-fit: cover;
    cursor: pointer;
}

.big-image-layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.big-img {
    max-width: 90%;
    max-height: 90%;
}

.image-picker {
    cursor: pointer;
    display: flex;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
}

.image-pickerall {
    margin: 20px 10px;
    border-radius: 5px;
    flex: 1;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
}

.transfer-card {
    background: none !important;
}

.message-bubble:has(.transfer-card) {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
}

.copy-toastas {
    position: fixed;
    width: 100%;
    max-width: 500px;
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

.copy-toastqwpjg {
    position: fixed;
    width: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
    border-radius: 6px;

}

.copy-toastqwpjg-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
}

.form-input {
    margin-left: 10px;
    font-size: 30px;
    color: #070000;
    border: none;
    outline: none;
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

.buttdgraq {
    background-color: #9ec9fa;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #000;
    flex: 1;
    font-size: 13px;
    cursor: pointer;
}

.buttdgraaaq {
    background-color: #f040e1;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
    font-size: 13px;
    cursor: pointer;
}

.textone {
    flex: 1;
    background: #fff;
    color: #000;
    border-radius: 4px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    cursor: pointer;
}

.copy-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 200px;
    transform: translate(-50%, -50%);
    background: rgba(75, 74, 74, 0.77);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 999999;
}

.copy-toastjfkd {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 350px;
    height: 200px;
    transform: translate(-50%, -50%);
    background: rgb(255, 255, 255);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 9999;
}

.userteatb-oneb {
    margin-top: 3px;
    display: flex;
    text-align: center;
    margin-left: 2px;
    font-size: 9px;
    background-color: #e200e2;
    border-radius: 20px;
    height: 15px;
    width: 15px;
    line-height: 15px;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #333; */
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.349);
    font-weight: 999;
    color: #fff;
}

.userteatb-oneb-v {
    margin-top: 3px;
    display: flex;
    text-align: center;
    margin-left: 2px;
    font-size: 9px;
    background-color: #b68c01;
    border-radius: 20px;
    height: 15px;
    width: 15px;
    line-height: 15px;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #333; */
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.349);
    font-weight: 999;
    color: #fff;
}

.message-video {
    max-width: 220px;
    max-height: 280px;
    border-radius: 8px;
    background: #000;
    outline: none;
}

/* 商城弹窗 */
.shop-modal-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9998;
    display: flex;
    align-items: flex-end;
}

.shop-modal {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    background: #141414;
    border-radius: 20px 20px 0 0;
    height: 90%;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease forwards;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.shop-modal-header {
    padding: 14px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 13px;
    border-bottom: 1px solid #333;
}

.shop-modal-body {
    flex: 1;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.shop-modal-body::-webkit-scrollbar {
    display: none;
}

/* 一行 5 个 完美平分 */
.waterfall-box-modal {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    padding-top: 8px;
    box-sizing: border-box;
    padding-bottom: 50px;
}

.waterfall-item-modal {
    width: 100%;
    padding: 0;
    cursor: pointer;
}

.waterfall-item-all-modal {
    background: #383838;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* 图片容器固定1:1，杜绝自适应撑高 */
.waterfall-item-all-modal>div:first-child {
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    flex-shrink: 0;
    /* 图片区域固定尺寸，不能压缩/放大 */
}

.waterfall-item-modal.active .waterfall-item-all-modal {
    border: 1px solid #fa33fa;
    /* box-shadow: 0 5px rgb(252, 1, 198); */
}

/* 商品消息卡片 ✅ */
.goods-card {
    background: #ffffff !important;
    border-radius: 10px !important;
    padding: 0 !important;
    min-width: 200px;
    cursor: pointer;
}

.my-msg .goods-card {
    background: #fff !important;
}
</style>