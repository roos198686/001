<template>
    <div class="main">
        <div class="allar-top">
            <div class="allar-top-a">
                <div class="topone">
                    <div class="lksfokof-all-texta">欢迎使用管理后台系统</div>
                    <div class="lksfokof-all-textb">
                        <div class="lksfokof-all-textb-a">登录用户: {{ userInfo.username }}</div>
                        <div class="lksfokof-all-textb-a">
                            用户组别: {{ userInfo.group_level }}
                        </div>
                        <div class="lksfokof-all-textb-a">
                            用户角色: {{ userInfo.juese }}
                        </div>

                    </div>
                </div>
            </div>
            <div class="allar-top-r"></div>
        </div>

        <div class="alla">
            <div class="allal">
                <div class="allal-top">
                    <div v-for="menu in menuList" :key="menu.key" class="allal-top-ba"
                        :class="{ 'allal-top-babutt': isMenuActive(menu.key) }" @click="activeMenu(menu.path)">
                        <Icon :icon="menu.icon" height="20" />
                        <div>{{ menu.namea }}</div>
                    </div>
                </div>
            </div>

            <div class="allar">
                <div class="lksfokof" style="justify-content: center">
                    <div v-if="invitedadd" class="lksfokof-all">
                        <div style="padding: 30px;display: flex;flex-direction: row;gap: 10px;">
                            <div
                                style="background-color: #b2ecf7;border-radius: 6px;padding: 15px 20px;flex: 1;border: 1px solid #999898;">
                                <div style=" font-size: 50px;font-weight: bold;text-align: center;color: #a3329e;">
                                    {{ statistics.count_level_2 || 0 }}
                                </div>
                                <div>入驻用户数</div>
                            </div>
                            <div
                                style="background-color: #b2ecf7;border-radius: 6px;padding: 15px 20px;flex: 1; border: 1px solid #999898;">
                                <div style=" font-size: 50px;font-weight: bold; text-align: center;color: #a3329e; ">
                                    {{ statistics.count_level_1 || 0 }}
                                </div>
                                <div>客户数</div>
                            </div>
                            <div
                                style="background-color: #b2ecf7;border-radius: 6px;padding: 15px 20px; flex: 1;border: 1px solid #999898; ">
                                <div style=" font-size: 50px; font-weight: bold; text-align: center; color: #a3329e; ">
                                    {{ statistics.total_recharge_all || '0.00' }}
                                </div>
                                <div>总充值金额</div>
                            </div>
                            <div
                                style=" background-color: #b2ecf7; border-radius: 6px; padding: 15px 20px;flex: 1;border: 1px solid #999898;">
                                <div style=" font-size: 50px; font-weight: bold;text-align: center;color: #a3329e;">
                                    {{ statistics.total_withdraw_all || '0.00' }}
                                </div>
                                <div>总提现金额</div>
                            </div>
                        </div>

                        <!-- ===================== 钱包列表 + 添加按钮 ===================== -->
                        <div style="display: flex;flex-direction: row;gap: 30px;padding:0 30px;">
                            <div style="width: 60%;">
                                <div
                                    style=" display: flex; justify-content: space-between; align-items: center;margin-bottom: 15px; ">
                                    <div style=" font-size: 15px; font-weight: bold;color: #a3329e;">
                                        钱包列表
                                    </div>
                                    <button @click="showAddModal = true" v-if="userInfo.status == 3"
                                        style="padding: 6px 12px;background-color: #a3329e; color: #fff; border: none;border-radius: 4px; cursor: pointer;font-size: 15px; ">
                                        + 添加钱包地址
                                    </button>
                                    <button @click="fjkfdlsojkgwldsads = true" v-if="userInfo.status == 1"
                                        style="padding: 6px 12px;background-color: #a3329e; color: #fff; border: none;border-radius: 4px; cursor: pointer;font-size: 15px; ">
                                        + 添加小组
                                    </button>
                                </div>

                                <div v-if="loading" style="text-align: center; padding: 20px">
                                    加载中...
                                </div>

                                <div v-else style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; ">
                                    <table style=" width: 100%; border-collapse: collapse; text-align: center;">
                                        <thead>
                                            <tr
                                                style="background-color: #f5f5f5; height: 35px;font-weight: bold; font-size: 14px; ">
                                                <td>币种类型</td>
                                                <td>钱包地址</td>
                                                <td>当前状态</td>
                                                <td>已完成提现笔数</td>
                                                <td>总充值金额</td>
                                                <td>组别</td>
                                                <td>操作</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in walletList" :key="item.id"
                                                style="height: 35px; border-top: 1px solid #eee;font-size: 13px;">
                                                <td>{{ item.coin_type }}</td>
                                                <td style="font-family: monospace">{{ item.address }}</td>
                                                <td>
                                                    <span :style="{ color: item.status == 1 ? '#00b42a' : '#ff4d4f' }" >
                                                        {{ item.status == 1 ? "启用" : "停用" }}
                                                    </span>
                                                </td>
                                                <td>{{ item.withdrawCount || 0 }}</td>
                                                <td style="color:#a33299; font-weight:bold">
                                                    {{ item.totalRecharge ? Number(item.totalRecharge).toFixed(2) :
                                                        '0.00'
                                                    }}
                                                </td>
                                                <td>{{ item.remark || 0 }}</td>
                                                <td  v-if="userInfo.status > '1'">
                                                    <button @click="handleChangeStatus(item)"
                                                        :style="{ padding: '2px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff', backgroundColor: item.status == 1 ? '#ff4d4f' : '#00b42a' }">
                                                        {{ item.status == 1 ? "停用" : "启用" }}
                                                    </button>
                                                </td>
                                            </tr>

                                            <!-- ===================== 【新增】总计行 ===================== -->
                                            <tr
                                                style="height: 38px; border-top: 2px solid #a3329e; font-weight: bold; font-size: 14px; background: #fdf6fd;">
                                                <td>总计</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td style="color:#000;">{{ totalWithdrawCount }}</td>
                                                <td style="color:#a3329e;">{{ totalRechargeAmount }}</td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div v-if="userInfo.status != 3" style="padding: 6px 0;margin-bottom: 15px;">
                                    <div style="font-size: 15px; font-weight: bold;color: #a3329e;margin-bottom: 20px;">
                                        小组抽成比例</div>
                                    <div
                                        style=" border-radius: 8px;background: #fdf6fd;padding: 5px 15px;border: 1px solid #ddd;">
                                        <div v-for="(item, i) in statisticslist" :key="i"
                                            style="display: flex;flex-direction: row; text-align: center; font-size: 13px; padding: 8px 0;">
                                            <div style="flex: 1;border-right: 1px solid #ccc;">{{ item.group_level +
                                                '小组(' + item.group_user + ')' }}</div>
                                            <div style="flex: 1;border-right: 1px solid #ccc;">{{ item.team_rate + '%'
                                                || '0%'
                                            }}</div>
                                            <div @click="usercuiocengioeps(item.id)"  v-if="userInfo.status > '1'"
                                                style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;margin-left: 50px;cursor: pointer;">
                                                编辑</div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="userInfo.status == 3"
                                    style="display: flex;flex-direction: row;flex: 1;gap: 20px;margin-top: 10px;">
                                    <div style="display: flex;flex-direction: column;flex: 1;">
                                        <div
                                            style="font-size: 15px; font-weight: bold;color: #a3329e;margin-bottom: 20px;">
                                            员工抽成比例（会影响所有数据）</div>
                                        <div
                                            style="display: flex;flex-direction: row;background: #fdf6fd;padding: 3px 15px;border: 1px solid #ddd;text-align: center;border-radius: 4px;">
                                            <div style="flex: 1;">
                                                {{ statisticslist[0]?.staff_rate || '0%' }}</div>
                                            <div @click="usercuiocenga(statisticslist[0]?.id)"
                                                style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;margin-left: 50px;font-size: 13px;cursor: pointer;">
                                                编辑</div>
                                        </div>
                                    </div>
                                    <div style="display: flex;flex-direction: column;flex: 1;">
                                        <div
                                            style="font-size: 15px; font-weight: bold;color: #a3329e;margin-bottom: 20px;">
                                            推荐抽成比例（不影响旧数据）</div>
                                        <div
                                            style="display: flex;flex-direction: row;background: #fdf6fd;padding: 3px 15px;border: 1px solid #ddd;text-align: center;border-radius: 4px;">
                                            <div style="flex: 1;">
                                                {{ statisticslist[0]?.recommend_rate || '0%' }}</div>
                                            <div @click="usercuiocengbaq(statisticslist[0]?.id)"
                                                style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;margin-left: 50px;font-size: 13px;cursor: pointer;">
                                                编辑</div>

                                        </div>
                                    </div>
                                </div>
                                <div style="margin-top: 30px;border-top: 3px solid #eee;padding-top: 30px;">
                                    <div>
                                        <div style="display: flex;flex-direction: row;gap: 10px;margin-bottom: 20px;">
                                            <div style="font-size: 15px; font-weight: bold;color: #a3329e;flex: 1;">
                                                小组收入统计</div>
                                            <input v-model="month" type="month"
                                                style="padding: 6px; background:#eee; color:#000; border:none; border-radius:6px;">
                                            <div style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;font-size: 13px;cursor: pointer;"
                                                @click="getGroupWithdrawTotal">
                                                查询
                                            </div>
                                        </div>
                                        <div
                                            style="display: flex;flex-direction: row;gap: 10px;background: #fdf6fd;padding: 3px 15px;border: 1px solid #ddd;border-radius: 4px;">
                                            <div style="flex: 1;">组别:{{ groupuser }}</div>
                                            <div style="flex: 1;">总计: {{ total }}</div>
                                            <!-- <div style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;font-size: 13px;">详情</div> -->
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div style="font-size: 14px; border-top: 3px solid #eee;margin: 30px 30px 0 30px;padding: 10px 0;display: flex;flex-direction: row;gap: 20px;"
                            v-if="userInfo.status == 3">
                            <div style="flex: 1;">
                                <div
                                    style="font-size: 15px; font-weight: bold;color: #a3329e;flex: 1;margin: 10px 0;display: flex;flex-direction: row;">
                                    约会卡设置
                                    <div style="flex: 1;display: flex;gap: 5px;align-items: center;">
                                        <div @click="openAddPackage"
                                            style="background-color: #fa02bc;display: flex;color: #fff;padding: 2px 10px;border-radius: 6px;font-size: 13px;cursor: pointer;margin-left: 10px;">
                                            新增</div>
                                    </div>
                                </div>
                                <div style="border:1px solid #eee;border-radius: 5px;">
                                    <div style="display: flex;flex-direction: row;padding: 10px;">
                                        <div style="flex: 1;">序号</div>
                                        <div style="flex: 1;">价格(美元)</div>
                                        <div style="flex: 1;">服务时间</div>
                                        <div style="flex: 1;">操作</div>
                                    </div>
                                    <div v-for="(item, index) in packageList" :key="item.id"
                                        style="display: flex;flex-direction: row;border-top:1px solid #eee;padding: 5px 10px;">
                                        <div style="flex: 1;">{{ index + 1 }}</div>
                                        <div style="flex: 1;">{{ item.package_price }}</div>
                                        <div style="flex: 1;">{{ item.card_num }}</div>
                                        <div style="flex: 1;display: flex;gap: 5px;">
                                            <div @click="togglePackageStatus(item)"
                                                style="display: flex;color: #fff;padding: 1px 5px;border-radius: 6px;font-size: 13px;cursor: pointer;"
                                                :style="{ backgroundColor: item.status == 0 ? '#a3329e' : '#cc7c21' }">
                                                {{ item.status == 0 ? '启用' : '禁用' }}</div>
                                            <div @click="openEditPackage(item)"
                                                style="background-color: #b2ecf7;display: flex;color: #000;padding: 1px 5px;border-radius: 6px;font-size: 13px;cursor: pointer;">
                                                编辑</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div
                                    style="font-size: 15px; font-weight: bold;color: #a3329e;flex: 1;margin: 10px 0;display: flex;flex-direction: row;">
                                    VIP设置
                                </div>
                                <div style="border:1px solid #eee;border-radius: 5px;">
                                    <div style="display: flex;flex-direction: row;padding: 10px;">
                                        <div style="width: 50px;">序号</div>
                                        <div style="width: 100px;">价格(美元)</div>
                                        <div style="width: 50px;">等级</div>
                                        <div style="flex: 1;">权益说明</div>
                                        <div style="width: 100px;">操作</div>
                                    </div>
                                    <div v-for="(item, index) in vipList" :key="item.id"
                                        style="display: flex;flex-direction: row;border-top:1px solid #eee;padding: 5px 10px;">
                                        <div style="width: 50px;">{{ index + 1 }}</div>
                                        <div style="width: 100px;">{{ item.recharge_amount }}</div>
                                        <div style="width: 50px;">{{ item.vip_level }}</div>
                                        <div style="flex: 1;">{{ item.privilege_desc }}</div>
                                        <div style="width: 100px;display: flex;gap: 5px;">
                                            <div @click="toggleVipStatus(item)"
                                                style="background-color: #a3329e;display: flex;color: #fff;padding: 1px 5px;border-radius: 6px;font-size: 13px;cursor: pointer;"
                                                :style="{ backgroundColor: item.status == 0 ? '#a3329e' : '#cc7c21' }">

                                                {{ item.status == 0 ? '启用' : '禁用' }}</div>
                                            <div @click="openEditVip(item)"
                                                style="background-color: #b2ecf7;display: flex;color: #000;padding: 1px 5px;border-radius: 6px;font-size: 13px;cursor: pointer;">
                                                编辑</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else style="flex: 1; display: flex; width: 100%; flex-direction: column">
                        <router-view></router-view>
                    </div>
                </div>

                <div class="buttnone">
                    <div class="buttnone-all">
                        <div v-for="menu in menuList" :key="menu.key" class="buttnone-alla"
                            :style="{ color: isMenuActive(menu.key) ? '#ac00ac' : '#000' }"
                            @click="activeMenu(menu.path)">
                            <Icon :icon="menu.icon" height="30" />
                            <div>{{ menu.mobileName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===================== 添加钱包弹窗 ===================== -->
        <div v-if="showAddModal" style="
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      " @click.self="showAddModal = false">
            <div style="
          width: 90%;
          max-width: 450px;
          background: #fff;
          border-radius: 10px;
          padding: 25px;
          position: relative;
        ">
                <div style="
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #a3329e;
            text-align: center;
          ">
                    添加钱包地址
                </div>

                <div style="margin-bottom: 15px">
                    <div style="margin-bottom: 6px; font-weight: 500">币种类型</div>
                    <input v-model="addForm.coin_type" placeholder="例如：USDT、TRX、ETH" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
            " />
                </div>

                <div style="margin-bottom: 15px">
                    <div style="margin-bottom: 6px; font-weight: 500">钱包地址</div>
                    <input v-model="addForm.address" placeholder="请输入钱包地址" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
            " />
                </div>

                <div style="
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          ">
                    <button @click="showAddModal = false" style="
              padding: 8px 20px;
              border: 1px solid #ddd;
              background: #f5f5f5;
              border-radius: 6px;
              cursor: pointer;
            ">
                        取消
                    </button>
                    <button @click="handleAddWallet" :disabled="addLoading" style="
              padding: 8px 20px;
              background: #a3329e;
              color: #fff;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            ">
                        {{ addLoading ? "提交中..." : "确认添加" }}
                    </button>
                </div>
            </div>
        </div>
        <div v-if="fjkfdlsojkgwl"
            style="position: fixed;left: 0; top: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.5); display: flex;flex-direction: column; align-items: center;justify-content: center;z-index: 9999;"
            @click.self="fjkfdlsojkgwl = false">
            <div
                style=" width: 90%; max-width: 450px;background: #fff;border-radius: 10px;padding: 35px;position: relative;">
                <div style="margin-bottom: 6px; font-weight: 500;color: #000;margin-bottom: 15px;">{{ textuek }}</div>
                <input v-model="addaddress"
                    style="width: 80%;padding: 10px;border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box;text-align: center;" />
                <div style="background-color: #a3329e;color: #fff;padding: 3px 10px;border-radius: 4px;font-size: 13px;margin: 30px 100px;cursor: pointer;"
                    @click="fkldilsjfk">
                    确定
                </div>
            </div>
        </div>
        <div v-if="fjkfdlsojkgwldsads"
            style="position: fixed;left: 0; top: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, 0.5); display: flex;flex-direction: column; align-items: center;justify-content: center;z-index: 9999;"
            @click.self="fjkfdlsojkgwldsads = false">
            <div
                style=" width: 90%; max-width: 450px;background: #fff;border-radius: 10px;padding: 35px;position: relative;">

                <!-- 弹窗标题 -->
                <div style="margin-bottom: 20px; font-weight: 500;color: #000; font-size:16px;">
                    添加小组
                </div>

                <!-- 用户名 -->
                <div style="margin-bottom:6px; font-size:14px; color:#333;">用户名</div>
                <input v-model="form.username"
                    style="width: 100%;padding: 10px;border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box;margin-bottom:15px;"
                    placeholder="请输入用户名" />

                <!-- 密码 -->
                <div style="margin-bottom:6px; font-size:14px; color:#333;">密码</div>
                <input v-model="form.password"
                    style="width: 100%;padding: 10px;border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box;margin-bottom:15px;"
                    placeholder="请输入密码" />

                <!-- 小组名称 -->
                <div style="margin-bottom:6px; font-size:14px; color:#333;">小组名称</div>
                <input v-model="form.group_user"
                    style="width: 100%;padding: 10px;border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box;margin-bottom:15px;"
                    placeholder="请输入小组名称" />

                <!-- 确定按钮 -->
                <div style="background-color: #a3329e;color: #fff;padding: 10px;border-radius: 6px;font-size:14px;cursor:pointer; text-align:center;"
                    @click="fkldilsjfkjfkdso">
                    确定添加
                </div>
            </div>
        </div>
        <!-- 套餐 新增/编辑 弹窗 -->
        <div v-if="showPackageDialog"
            style="position: fixed;left: 0;top: 0;right: 0;bottom: 0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 9999"
            @click.self="showPackageDialog = false">
            <div style=" width: 90%;max-width: 420px; background: #fff; border-radius: 10px;padding: 25px;">
                <div
                    style="font-size: 18px; font-weight: bold; color: #a3329e; text-align: center; margin-bottom: 20px; ">
                    {{ packageDialogType === 'add' ? '新增套餐' : '编辑套餐' }}
                </div>

                <div style="margin-bottom: 15px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">价格(美元)</div>
                    <input v-model="packageForm.package_price" type="number" placeholder="请输入价格"
                        style="width: 100%;padding: 10px; border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box; " />
                </div>

                <div style="margin-bottom: 15px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">服务时间</div>
                    <input v-model="packageForm.card_num" type="number" placeholder="请输入服务时间"
                        style="width: 100%;padding: 10px;border: 1px solid #ddd;border-radius: 6px;box-sizing: border-box;" />
                </div>

                <div style="margin-bottom: 20px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">状态</div>
                    <select v-model="packageForm.status"
                        style="width: 100%;padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                        <option :value="0">启用</option>
                        <option :value="1">禁用</option>
                    </select>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button @click="showPackageDialog = false"
                        style="padding: 8px 24px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 6px;cursor: pointer; ">
                        取消
                    </button>
                    <button @click="submitPackage" :disabled="packageSubmitLoading"
                        style=" padding: 8px 24px; background: #a3329e;color: #fff; border: none; border-radius: 6px; cursor: pointer; ">
                        {{ packageSubmitLoading ? '提交中...' : '确定' }}
                    </button>
                </div>
            </div>
        </div>
        <!-- VIP 编辑弹窗 -->
        <div v-if="showVipDialog"
            style="position: fixed;left: 0;top: 0;right: 0;bottom: 0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 9999;"
            @click.self="showVipDialog = false">
            <div style="width: 90%; max-width: 420px; background: #fff;border-radius: 10px;padding: 25px;">
                <div
                    style="font-size: 18px; font-weight: bold; color: #a3329e; text-align: center; margin-bottom: 20px; ">
                    编辑VIP配置
                </div>

                <div style="margin-bottom: 15px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">VIP等级</div>
                    <input v-model.number="vipForm.vip_level" type="number" placeholder="如：1、2、3"
                        style="width: 100%;padding: 10px;border: 1px solid #ddd; border-radius: 6px;box-sizing: border-box; " />
                </div>

                <div style="margin-bottom: 15px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">升级价格(美元)</div>
                    <input v-model.number="vipForm.recharge_amount" type="number" placeholder="请输入价格"
                        style=" width: 100%; padding: 10px;border: 1px solid #ddd;border-radius: 6px; box-sizing: border-box;" />
                </div>

                <div style="margin-bottom: 15px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">权益描述(用英语)</div>
                    <input v-model="vipForm.privilege_desc" placeholder="如：unlimitedChat"
                        style="width: 100%;padding: 10px;border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; " />
                </div>

                <div style="margin-bottom: 20px;text-align: left;color: #000;font-size: 13px;">
                    <div style="margin-bottom: 6px; font-weight: 500;">状态</div>
                    <select v-model.number="vipForm.status"
                        style=" width: 100%;padding: 10px;border: 1px solid #ddd;border-radius: 6px; box-sizing: border-box; ">
                        <option :value="0">启用</option>
                        <option :value="1">禁用</option>
                    </select>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button @click="showVipDialog = false"
                        style="padding: 8px 24px; border: 1px solid #ddd; background: #f5f5f5;border-radius: 6px;cursor: pointer;">
                        取消
                    </button>
                    <button @click="submitVip" :disabled="vipSubmitLoading"
                        style="padding: 8px 24px;background: #a3329e;color: #fff;border: none; border-radius: 6px;cursor: pointer;">
                        {{ vipSubmitLoading ? '提交中...' : '确定' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import router from "../../router";
import { useRoute } from "vue-router";
import request from '@/utils/request'
const route = useRoute();
const invitedadd = ref(false);

const userInfo = reactive(JSON.parse(localStorage.getItem("adminuser") || "{}"));

const textuek = ref('')
const fjkfdlsojkgwl = ref(false);
const fjkfdlsojkgwldsads = ref(false);
//添加小组
const form = reactive({
    username: '',
    password: '',
    group_user: '',
})
// 确定提交 添加小组
const fkldilsjfkjfkdso = async () => {
    if (!form.username || !form.password || !form.group_user) {
        return alert('请填写完整信息')
    }
    try {
        const res = await request.post('/api/admin/addGroup', {
            username: form.username,
            password: form.password,
            group_user: form.group_user
        })
        if (res.data.code === 100) {
            alert("用户名已存在，请重新录入！");
            form.username = ''
        }
        if (res.data.code === 200) {
            // 关闭弹窗
            fjkfdlsojkgwldsads.value = false
            recommendlist()
            // 清空表单
            form.username = ''
            form.password = ''
            form.group_user = ''
        }
    } catch (err) {
        console.error(err)
    }
}
//小组抽成比例
const xzjfkdwo = ref('')
const addaddress = ref('')
const jfkewk = ref('')
const usercuiocengioeps = (value: any) => {
    jfkewk.value = 'a'
    fjkfdlsojkgwl.value = true
    xzjfkdwo.value = value
    textuek.value = '小组抽成比例调整'
}
//员工抽成比例
const usercuiocenga = (value: any) => {
    jfkewk.value = 'b'
    fjkfdlsojkgwl.value = true
    xzjfkdwo.value = value
    textuek.value = '员工抽成比例调整'
}
//推荐抽成比例
const usercuiocengbaq = (value: any) => {
    jfkewk.value = 'c'
    fjkfdlsojkgwl.value = true
    xzjfkdwo.value = value
    textuek.value = '推荐抽成比例调整'
}
const fkldilsjfk = async () => {
    console.log(jfkewk.value)
    let dklaf = ''
    if (jfkewk.value == 'a') {
        dklaf = 'updateRegroupuser'//小组
    }
    if (jfkewk.value == 'b') {
        dklaf = 'updateReguserr'//员工
    }
    if (jfkewk.value == 'c') {
        dklaf = 'updateRecommendRate'//推荐
    }
    try {
        const { data: res } = await request.post('/api/admin/' + dklaf, {
            user_id: xzjfkdwo.value,
            recommend_rate: addaddress.value
        })
        if (res.code === 1) {
            recommendlist()
            fjkfdlsojkgwl.value = false
        }
    } catch (error) {
        console.error(error)
    }
}

const monthuser = ref('');
// const list = ref([]);
// 获取统计
// const getStats = async () => {
//     try {
//         let group_level = userInfo.group_level
//         const { data } = await request.get('/api/admin/groupUserWithdrawStats', {
//             params: {
//                 group_level,
//                 month: monthuser.value || ''
//             }
//         })
//         if (data.code === 1) {
//             list.value = data.data
//             console.log(list)
//         }
//     } catch (e) {
//         console.error('获取失败', e)
//     }
// }

const month = ref('')
const total = ref(0)
const groupuser = ref('')
// 获取小组提现统计
const getGroupWithdrawTotal = async () => {
    try {
        let group_user = userInfo.group_level
        let status = userInfo.status
        const { data } = await request.get('/api/admin/groupWithdrawTotal', {
            params: {
                group_user,
                status,
                month: month.value || ''
            }
        })
        if (data.code === 1) {
            total.value = data.data.total
            groupuser.value = data.data.group_user
        }
    } catch (e) {
        console.log("获取统计失败", e)
    }
}

const statisticslist = ref([])
const recommendlist = async () => {
    try {
        let group_user = userInfo.group_level;
        let status = userInfo.status;
        const { data } = await request.get('/api/admin/recommendlist', {
            params: {
                group_user,
                status
            }
        });
        if (data.code === 1) {
            statisticslist.value = data.data;
        }
    } catch (e) {
        console.log("统计加载失败", e);
    }
};

const menuList = ref([
    {
        key: "a",
        path: "/admin_index",
        pathPrefix: "/admin_index",
        namea: "首页",
        mobileName: "系统首页",
        icon: "ic:baseline-widgets",
    },
    {
        key: "b",
        path: "/admin_rueixisk",
        pathPrefix: "/admin_rueixisk",
        namea: "用户管理",
        mobileName: "用户管理",
        icon: "ic:baseline-rocket",
    },
    {
        key: "c",
        path: "/admin_publiczl",
        pathPrefix: "/admin_publiczl",
        namea: "资金管理",
        mobileName: "资金管理",
        icon: "ic:baseline-spa",
    },
    {
        key: "d",
        path: "/admin_ruklose",
        pathPrefix: "/admin_ruklose",
        namea: "贴子管理",
        mobileName: "贴子管理",
        icon: "material-symbols:article-rounded",
    },
    {
        key: "e",
        path: "/admin_shop",
        pathPrefix: "/admin_shop",
        namea: "商品管理",
        mobileName: "商品管理",
        icon: "material-symbols:shopping-cart-checkout-rounded",
    },
    {
        key: "f",
        path: "/admin_suoruotoji",
        pathPrefix: "/admin_suoruotoji",
        namea: "收入统计",
        mobileName: "收入统计",
        icon: "tabler:copy-check-filled",
    },
    {
        key: "g",
        path: "/admin_message",
        pathPrefix: "/admin_message",
        namea: "聊天查询",
        mobileName: "聊天查询",
        icon: "tabler:brand-messenger-filled",
    },
    {
        key: "h",
        path: "/admin_user",
        pathPrefix: "/admin_user",
        namea: "个人中心",
        mobileName: "个人中心",
        icon: "ic:baseline-face-6",
    },
]);

// 平台统计数据
const statistics = ref({
    total_user: 0,
    count_level_1: 0,
    count_level_2: 0,
    total_recharge_all: "0.00",
    total_withdraw_all: "0.00",
});

// 钱包列表
const walletList = ref<any[]>([]);
const loading = ref(false);

// 添加弹窗
const showAddModal = ref(false);
const addLoading = ref(false);
const addForm = ref({
    coin_type: "",
    address: "",
});

// ===================== 【新增】计算总计：提现笔数 + 充值金额 =====================
const totalWithdrawCount = computed(() => {
    return walletList.value.reduce((sum, item) => sum + (item.withdrawCount || 0), 0);
});

const totalRechargeAmount = computed(() => {
    const total = walletList.value.reduce((sum, item) => sum + (Number(item.totalRecharge) || 0), 0);
    return total.toFixed(2);
});

// 获取平台统计
const getStatistics = async () => {
    try {
        let group_user = userInfo.group_level;
        let status = userInfo.status;
        const { data } = await request.get('/api/admin/statistics', {
            params: {
                group_user,
                status
            }
        });
        if (data.code === 1) {
            statistics.value = data.data;
        }
    } catch (e) {
        console.log("统计加载失败", e);
    }
};

// 获取钱包列表
const getWalletList = async () => {
    loading.value = true;
    try {
        let group_user = userInfo.group_level;
        let status = userInfo.status;

        // 只请求一次，自带统计数据
        const { data } = await request.get('/api/admin/getRechargeWallet', {
            params: {
                group_user,
                status
            }
        });

        if (data.code !== 0) throw new Error(data.msg || "获取失败");

        // 直接赋值，无需循环调用接口
        walletList.value = data.list || [];
    } catch (err) {
        console.error("钱包列表异常：", err);
        alert("加载钱包列表失败");
    } finally {
        loading.value = false;
    }
};

// 切换状态
const handleChangeStatus = async (item) => {
    const nextStatus = item.status == 1 ? 2 : 1;
    const text = nextStatus == 1 ? "启用" : "停用";
    if (!confirm(`确定要${text}该钱包吗？`)) return;

    try {
        const { data } = await request.post('/api/admin/updateWalletStatus', {
            id: item.id,
            status: nextStatus
        });
        if (data.code !== 0) {
            alert(data.msg || "操作失败");
            return;
        }
        item.status = nextStatus;
        alert(`${text}成功`);
    } catch (err) {
        console.error(err);
        alert("请求失败");
    }
};

// ===================== 添加钱包 =====================
const handleAddWallet = async () => {
    const { coin_type, address } = addForm.value;
    if (!coin_type || !address) {
        alert("请填写完整信息");
        return;
    }
    let group_user = userInfo.group_level;
    console.log(group_user, coin_type, address)
    addLoading.value = true;
    try {
        const { data } = await request.post('/api/admin/addRechargeWallet', {
            coin_type,
            address,
            status: 1,
            remark: group_user
        });
        if (data.code !== 0) {
            alert(data.msg || "添加失败");
            return;
        }
        alert("添加成功！");
        showAddModal.value = false;
        addForm.value = { coin_type: "", address: "" };
        getWalletList();
    } catch (err) {
        console.error(err);
        alert("请求失败");
    } finally {
        addLoading.value = false;
    }
};

// 菜单高亮
const isMenuActive = (menuKey) => {
  const currPath = route.path
  // 首页
  if (menuKey === 'a') return currPath === '/admin_index'
  // 用户管理
  if (menuKey === 'b') return currPath === '/admin_rueixisk'
  // 资金管理
  if (menuKey === 'c') return currPath === '/admin_publiczl'
  // 帖子管理
  if (menuKey === 'd') return currPath === '/admin_ruklose'
  // 商品管理：匹配主页面 + 两个子页面
  if (menuKey === 'e') {
    return currPath === '/admin_shop' || currPath === '/admin_goodsmanage'
  }
  // 收入统计
  if (menuKey === 'f') return currPath === '/admin_suoruotoji'
  // 聊天查询
  if (menuKey === 'g') return currPath === '/admin_message'
  // 个人中心
  if (menuKey === 'h') return currPath === '/admin_user'

  return false
}

const activeMenu = (path) => {
    router.push(path);
    localStorage.setItem("last_path", path);
    invitedadd.value = path === "/admin_index";
};
// 获取套餐列表
const packageList = ref<any[]>([])
const getPackageList = async () => {
    try {
        const { data: res } = await request.get('/api/recharge/package/list')
        if (res.code === 200) {
            packageList.value = res.data || []
        }
    } catch {
    }
}
watch(
    () => route.path,
    (newPath) => {
        invitedadd.value = newPath === "/admin_index";
        localStorage.setItem("last_path", newPath);
        if (newPath === "/admin_index") {
            getStatistics();
            getWalletList();
        }
    },
    { immediate: true }
);
// 套餐弹窗类型：add=新增 / edit=编辑
const packageDialogType = ref<'add' | 'edit'>('add')
// 新增/编辑弹窗显示
const showPackageDialog = ref(false)
// 套餐表单
const packageForm = reactive({
    id: 0,
    package_price: '',
    card_num: '',
    status: 0 // 0启用 1禁用
})
// 提交加载
const packageSubmitLoading = ref(false)
const openAddPackage = () => {
    packageDialogType.value = 'add'
    // 重置表单
    packageForm.id = 0
    packageForm.package_price = ''
    packageForm.card_num = ''
    packageForm.status = 0
    showPackageDialog.value = true
}
const openEditPackage = (item: any) => {
    packageDialogType.value = 'edit'
    packageForm.id = item.id
    packageForm.package_price = item.package_price
    packageForm.card_num = item.card_num
    packageForm.status = item.status
    showPackageDialog.value = true
}
const togglePackageStatus = async (item: any) => {
    const newStatus = item.status === 0 ? 1 : 0
    const tip = newStatus === 0 ? '启用' : '禁用'
    if (!confirm(`确定${tip}该套餐？`)) return

    try {
        const { data } = await request.post('/api/recharge/package/changeStatus', {
            id: item.id,
            status: newStatus
        })
        if (data.code === 200) {
            alert(`${tip}成功`)
            // 刷新列表
            getPackageList()
        } else {
            alert(data.msg || '操作失败')
        }
    } catch (err) {
        alert('网络请求失败')
    }
}
const submitPackage = async () => {
    const price = Number(packageForm.package_price)
    const num = Number(packageForm.card_num)

    if (!packageForm.package_price || isNaN(price) || price <= 0) {
        alert('请输入合法价格')
        return
    }
    if (!packageForm.card_num || isNaN(num) || num <= 0) {
        alert('请输入合法服务数量')
        return
    }

    packageSubmitLoading.value = true
    try {
        const params = {
            package_price: price,
            card_num: num,
            status: packageForm.status
        }

        let res
        if (packageDialogType.value === 'add') {
            // 新增
            res = await request.post('/api/recharge/package/add', params)
        } else {
            // 编辑
            res = await request.post('/api/recharge/package/edit', {
                id: packageForm.id,
                ...params
            })
        }

        if (res.data.code === 200) {
            alert(packageDialogType.value === 'add' ? '新增成功' : '编辑成功')
            showPackageDialog.value = false
            getPackageList() // 刷新列表
        } else {
            alert(res.data.msg || '提交失败')
        }
    } catch (err) {
        alert('网络请求失败')
    } finally {
        packageSubmitLoading.value = false
    }
}

// VIP列表数据
const vipList = ref([])

// 拉取VIP配置列表
const getVipList = async () => {
    try {
        const { data: res } = await request.get('/api/datingcard/viplist')
        if (res.code === 200) {
            vipList.value = res.data || []
        }
    } catch (err) {
        console.error('获取VIP列表失败', err)
    }
}
// ========== VIP 新增/编辑弹窗 ==========
const vipDialogType = ref<'add' | 'edit'>('edit')
const showVipDialog = ref(false)
const vipSubmitLoading = ref(false)

// VIP 表单
const vipForm = reactive({
    id: 0,
    vip_level: '',
    recharge_amount: '',
    privilege_desc: '',
    icon_url: '',
    status: 0 // 0启用 1禁用
})
/**
 * 打开VIP编辑弹窗
 */
const openEditVip = (item: any) => {
    vipDialogType.value = 'edit'
    vipForm.id = item.id
    vipForm.vip_level = item.vip_level
    vipForm.recharge_amount = item.recharge_amount
    vipForm.privilege_desc = item.privilege_desc
    vipForm.icon_url = item.icon_url
    vipForm.status = item.status
    showVipDialog.value = true
}

/**
 * VIP 启用/禁用 状态切换
 */
const toggleVipStatus = async (item: any) => {
    const newStatus = item.status === 0 ? 1 : 0
    const tip = newStatus === 0 ? '启用' : '禁用'
    if (!confirm(`确定${tip}该VIP等级？`)) return
    console.log(item.id, newStatus)
    try {
        const { data } = await request.post('/api/vip/changeStatus', {
            id: item.id,
            status: newStatus
        })
        if (data.code === 200) {
            alert(`${tip}成功`)
            getVipList() // 刷新列表
        } else {
            alert(data.msg || '操作失败')
        }
    } catch (err) {
        alert('网络请求失败')
    }
}

/**
 * 提交VIP编辑
 */
const submitVip = async () => {
    const level = Number(vipForm.vip_level)
    const price = Number(vipForm.recharge_amount)

    // 简单校验
    if (!vipForm.vip_level || isNaN(level) || level <= 0) {
        alert('请输入合法VIP等级')
        return
    }
    if (!vipForm.recharge_amount || isNaN(price) || price <= 0) {
        alert('请输入合法价格')
        return
    }
    if (!vipForm.privilege_desc) {
        alert('请填写权益说明')
        return
    }

    vipSubmitLoading.value = true
    try {
        const params = {
            vip_level: level,
            recharge_amount: price,
            privilege_desc: vipForm.privilege_desc,
            icon_url: vipForm.icon_url,
            status: vipForm.status
        }

        const { data } = await request.post('/api/vip/edit', {
            id: vipForm.id,
            ...params
        })

        if (data.code === 200) {
            alert('编辑成功')
            showVipDialog.value = false
            getVipList()
        } else {
            alert(data.msg || '提交失败')
        }
    } catch (err) {
        alert('网络请求失败')
    } finally {
        vipSubmitLoading.value = false
    }
}
onMounted(() => {
    getPackageList()
    recommendlist()
    getGroupWithdrawTotal()
    // getStats()
    getVipList()
    const adminStr = localStorage.getItem('adminuser');
    if (!adminStr) {
        router.replace('/admin_login');
    }
});
</script>

<style scoped>
.topone {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.main {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    font-family: "Consolas";
    overflow-y: hidden;
    color: #b2ecf7;
}

.allar-top {
    display: flex;
    flex-direction: row;
    padding: 10px;
    font-size: 14px;
    background-color: #e9e9e9;
    color: #000;
    border-bottom: 1px solid #999898;
}

.allar-top-a {
    margin: 0 15px;
    font-size: 18px;
    font-weight: bold;
    color: #a3329e;
    width: 100%;
}

.allar-top-r {
    text-align: right;
    margin-left: auto;
}

.alla {
    background-color: #fff;
    display: flex;
    flex-direction: row;
    color: #000;
    /* flex: 1; */

}

.allal {
    height: 100%;
    width: 80px;
    background-color: #e7e7e7;
    display: flex;
    flex-direction: column;
    border-right: 5px solid #c5c5c5;
}

.allal-top {
    display: flex;
    flex-direction: column;
    width: 80px;
    background-color: #a3329e;
}

.allal-top-b {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    margin-top: -0.5px;
}

.allal-top-ba {
    width: 100%;
    height: 60px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #e7e7e7;
    border-bottom: 1px solid #b67676;
}

.allal-top-ba:hover {
    background-color: #e64dde;
    color: #fff;
}

.allal-top-babutt {
    width: 100%;
    height: 60px;
    background-color: #a3329e;
    cursor: pointer;
    font-size: 13px;
    color: #fff;
    pointer-events: none;
}

.allar {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.lksfokof {
    overflow-y: auto;
    height: 100vh;
    display: flex;
}

.lksfokof-all {
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 1;
}

.lksfokof-all-texta {
    font-size: 22px;
    font-weight: bold;
    color: #9e026a;
}

.lksfokof-all-textb {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    text-align: right;
    margin-left: auto;
}

.lksfokof-all-textb-a {
    margin: 5px 0;
}

.buttnone {
    position: fixed;
    bottom: 0;
    padding: 10px 10px 40px 10px;
    display: none;
    width: 100%;
    background-color: #e9e9e9;
    color: #000;
    border-top: 1px solid #999898;
}

.buttnone-all {
    display: flex;
    flex-direction: row;
    font-size: 13px;
    line-height: 14px;
}

.buttnone-alla {
    width: 20%;
    text-align: center;
    cursor: pointer;
}

::-webkit-scrollbar {
    display: none;
}

@media (max-width: 780px) {
    .buttnone {
        display: block;
    }

    .allal {
        display: none;
    }

    .topone {
        flex-direction: column;
    }
}
</style>