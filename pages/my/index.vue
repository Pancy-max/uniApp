<template>
	<view class='my'>
		<view class="my_header">
			<view class="title block-view" @click="login()" v-if="userInfo ===''">
				<view class="t_left">
					<image src="../../static/my/default@2x.png" mode=""></image>
				</view>
				<view class="t_right">
					<view class="r_left">
						<view class="r_text1">未登录</view>
						<view class="r_text2">请登录后使用</view>
					</view>
					<view class="r_right">
						<view class="r_image">
							<image src="../../static/my/btn_01.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="title" v-else>
				<view class="t_left">
					<image :src="avatar" mode=""></image>
				</view>
				<view class="t_right">
					<view class="r_left">
						<view class="r_textinfo1">
							<view class="name1">{{ myinfo.user && myinfo.user.username }}</view>
						</view>
						<view class="r_text2">用户等级：{{ myinfo.user && myinfo.user.userLevel }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="block-view">

			<view class="my_tabs" @click="getMemberList">
				<view class="tabs_left">
					<my-icon type="staff" size="26" />
				</view>
				<view class="tabs_right">
					<text>儿童信息</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>

			<view class="fengexian"></view>

			<view class="my_tabs" @click="myTest">
				<view class="tabs_left">
					<image src="../../static/common/btn_08.png" mode=""></image>
				</view>
				<view class="tabs_right">
					<text>我的测评</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>

			<view class="fengexian"></view>


			<view class="my_tabs" @click="share">
				<view class="tabs_left">
					<my-icon type="redo" size="26" />
				</view>
				<view class="tabs_right">
					<text>分享给朋友</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
			<view class="fengexian"></view>

			<view class="my_tabs" @click="help">
				<view class="tabs_left">
					<my-icon type="chatboxes" size="26" />
				</view>
				<view class="tabs_right">
					<text>联系客服</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
			<view class="fengexian"></view>

			<view class="my_tabs" @click="about">
				<view class="tabs_left">
					<my-icon type="info" size="26" />
				</view>
				<view class="tabs_right">
					<text>关于我们</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
			<view class="fengexian"></view>
		</view>

		<uni-popup ref="shardPop" type="share" safeArea backgroundColor="#fff">
			<uni-popup-share @select="selectShareItem"></uni-popup-share>
		</uni-popup>
		<view class="my_tabs" v-if="userInfo !=''" @click="logOut">
			<view class="tabs_left">
				<image src="../../static/my/icon5.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>退出登录</text>
				<image src="../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog mode="base" message="成功消息" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm" content="确定要退出当前账号吗" title="退出账号" msgColor="msgColor"></uni-popup-dialog>
		</uni-popup>

	</view>

</template>

<script>
	import {
		Base64
	} from '../../utils/base64.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniPopupShare from '@/components/uni-popup/uni-popup-share.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'

	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			uniPopupShare,
			uniIcons
		},
		name: 'vue',
		props: {},
		data() {
			return {
				userInfo: '', // 个人信息
				myinfo: '',
				vers: false,
				H5Status: true,
				avatar: '',
				Way: 1,
				ownerType: 1,
				ownerBangDing: 1,
			};
		},
		onShow() {
			this.getInfo()
			// 监听事件
			// uni.$on('login', (MYinfo) => {

			// })
			// console.log(this.userInfo)

		},
		onLoad() {
			// #ifdef H5
			this.H5Status = false
			// #endif
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('bangding');
		},
		//#ifdef MP-WEIXIN
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内转发按钮
				console.log('点击分享')
			}
			return {
				title: '',
				// path: '/pages/index/index',
				imageUrl: '/static/common/logo.png',
				// content: 'xxx',
				// desc: 'xxx'
				success: e => {
					console.log('分享成功', e)
				}
			}
		},
		//#endif
		methods: {
			// 转换成员类型
			changeOwnerType(item) {
				switch (item) {
					// case 1:
					// 	return "业主"
					// 	break;
					case 2:
						return "家庭成员"
						break;
						// case 3:
						// 	return "租户"
						// 	break;
					default:
						break;
				}
			},
			logOut() {
				this.$refs.popup2.open()
			},
			close() {
				this.$refs.popup2.close()
			},
			async confirm() {
				console.log('点击退出登录')
				const callback = function() {
					this.userInfo = ''
				}
				this.$logout(callback);
			},
			gologin() {
				if (uni.getSystemInfoSync().platform == 'ios') {
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						confirmText: '去登录',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/index'
								})
							} else if (res.cancel) {}
						}
					})
				} else {
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						cancelText: '去登录',
						confirmText: '取消',
						confirmColor: "#262626",
						success(res) {
							if (res.confirm) {

							} else if (res.cancel) {
								uni.navigateTo({
									url: '../login/index'
								})
							}
						}
					})
				}

			},
			closePopup() {
				this.$refs.shardPop.close();
			},
			openPopup() {
				this.$refs.shardPop.open();
			},
			getMemberList() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../familyBer/familyBer'
					})
				} else {
					this.gologin();
				}
			},
			help() {
				uni.navigateTo({
					url: '../help/index'
				})
			},
			about() {
				uni.navigateTo({
					url: '../About/index'
				})
			},
			// 分享
			share() {
				// if (this.userInfo != '') {
				this.openPopup()
				// } else {
				// 	this.gologin();
				// }
			},
			selectShareItem(val) {
				if (val.item && val.item.name === 'paint') { // 画报分享
					uni.navigateTo({
						url: '../shard/index?code=' + this.myinfo.community_code
					})
				} else { // 微信分享, h5
					// var strShareUrl = "https://uniapp.dcloud.io"
					// var strShareTitle = "测评"
					// var strShareSummary = "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！"
					// uni.share({
					// 	provider: "weixin",
					// 	title:"uniapp",
					// 	scene: "WXSceneSession",
					// 	type: 1,
					// 	summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					// 	success: function (res) {
					// 		console.log("uni-shard-success:" + JSON.stringify(res));
					// 	},
					// 	fail: function (err) {
					// 		console.log("uni-shard-fail:" + JSON.stringify(err));
					// 	}
					// })
				}
			},
			information() {
				if (this.userInfo != '') {
					// uni.navigateTo({
					// 	url: '../information/index?code=' + this.myinfo.community_code
					// })
				} else {
					this.gologin();
				}
			},
			// myMessage() {
			// 	if (this.userInfo != '') {
			// 		// uni.navigateTo({
			// 		// 	url: '../myMessage/index'
			// 		// })
			// 	} else {
			// 		this.gologin();
			// 	}
			// },
			// trading() {
			// 	if (this.userInfo != '') {
			// 		uni.navigateTo({
			// 			url: '../trading/index'
			// 		})
			// 	} else {
			// 		this.gologin();
			// 	}
			// },
			//显示个人信息
			async showinfo() {
				console.log('showinfo', this.userInfo)
				this.myinfo = this.userInfo
				// const access_token = this.userInfo.token

				// const user_id = this.userInfo.user.uuid
				// const app_key = this.$app_key;
				// if (data.code === 0) {
				// 	this.myinfo = data.data;
				// 	uni.setStorageSync('userInfo', data.data)
				// } else if (data.code == 400) {
				// 	uni.showToast({
				// 		title: '登录已过期',
				// 		icon: "none"
				// 	})
				// 	uni.removeStorage('myinfo');
				// 	uni.removeStorage('userInfo');
				// 	uni.navigateTo({
				// 		url: '../login/index'
				// 	})
				// } else {
				// 	uni.showModal({
				// 		title: data.desc,
				// 		icon: "none"
				// 	})
				// }

			},

			// 跳转到登录页面
			login() {
				uni.navigateTo({
					url: "../login/index"
				});
			},
			//账号管理
			myTest() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../doTest/list'
					});
				} else {
					this.gologin();
				}

			},
			//登录获取自己信息
			getInfo() {
				let value = uni.getStorageSync('myinfo');
				if (value) {
					if (!value || !value.user) {
						uni.removeStorage('myinfo');
					} else {
						this.userInfo = value
						this.avatar = value.user.avatar
						this.showinfo();
					}
				}
			}
		},
	};
</script>

<style lang="less">
	.my {
		padding: 30rpx;
		background-color: #f1f1f1;
		height: calc(100vh - 60rpx);

		.block-view {
			background: #fff;
			border-radius: 40rpx;
			margin-bottom: 30rpx;
			padding: 10rpx;
		}

		.my_header {
			margin-top: 40rpx;
		}
	}

	.btn_13_off {
		position: relative;
		margin-top: 40rpx;
	}

	.title {
		display: flex;
		margin-top: 160rpx;
		height: 140rpx;
		padding: 10rpx 0;

		.t_left {
			margin-right: 40rpx;
			height: 140rpx;
			width: 136rpx;
			margin: 0 auto;
			text-align: center;

			image {
				height: 120rpx;
				width: 120rpx;
				border-radius: 12rpx;
				margin-top: 10rpx;
			}
		}

		.t_right {
			flex: 1;
			display: flex;

			.r_left {
				margin-left: 30rpx;
				flex: 1;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.r_text1 {
					width: 100%;
					font-size: 40rpx;
					color: #333333;
					font-weight: 900;
					margin-bottom: 24rpx;
				}

				.r_text2 {
					width: 100%;
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.r_right {
				margin-right: 46rpx;
				display: flex;
				align-items: center;

				.r_image {
					image {
						height: 36rpx;
						width: 36rpx;
					}
				}
			}
		}
	}

	// banner
	.my_banner {
		margin-top: 24rpx;
		height: 188rpx;
		display: flex;
		margin-bottom: 28rpx;
		margin-left: 26rpx;

		image {
			width: 346rpx;
			height: 188rpx;
		}
	}

	.my_tabs {
		display: flex;
		margin: 0 20rpx;
		box-sizing: border-box;

		.tabs_left {
			margin: 34rpx 0;
			margin-left: 40rpx;
			margin-right: 36rpx;
			color: #999999;

			image {
				width: 48rpx;
				height: 48rpx;
				margin-top: 8rpx;
			}
		}

		.tabs_right {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				margin: 44rpx 0;
				font-size: 34rpx;
				color: #262626;
			}

			image {
				margin-right: 38rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}

	.r_textinfo {
		flex: 1;

		.name1 {
			font-size: 40rpx;
			font-weight: 700;
		}

		.binding {
			margin-left: 22rpx;
			font-size: 20rpx;
			color: #60C49A;
			height: 32rpx;
			line-height: 32rpx;
			text-align: center;
			margin-top: 10rpx;
			border: 1rpx solid #60C49A;
			border-radius: 20rpx;
			width: 90%;
		}

		.unbounded {
			margin-left: 22rpx;
			font-size: 20rpx;
			color: #ffb726;
			height: 32rpx;
			line-height: 32rpx;
			text-align: center;
			margin-top: 10rpx;
			width: 70rpx;
			border: 1rpx solid #ffb726;
			border-radius: 20rpx;
		}
	}

	.test {
		margin-left: 42rpx;
		font-size: 34rpx;
		color: #262626;
		font-weight: 900;
	}

	.r_textinfo1 {
		display: flex;
		width: 100%;
	}

	.fengexian {
		border-bottom: 1rpx solid #e6e6e6;
		width: 88%;
		margin: 0 auto;
		height: 1rpx;
	}
</style>
