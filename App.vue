<script>
	// import md5 from 'common/md5.js'
	import {
		Base64
	} from './utils/base64.js'
	export default {
		globalData: {
			testItem: {}, // 当前测试题目
			testResult: {}, // 当前测试结果
			childList: [],
			childId: null, // 当前测试的儿童id
			aboutUsInfo: {}, // 关于我们协议相关信息
			evaListInfo: [],
			help: {},
			logoUrl: '',
			wechatInfo: {}
		},
		onLaunch: function() {
			let that = this
			uni.getStorageSync({
				key: 'myinfo',
				success: function(res) {
					const user = res.data && res.data.user
					if (!user) {
						return
					}
					let token = res.data.token;
					let uuid = res.data.user.uuid;
					const open_id = res.data.user.weixinOpenid
					let header = {
						'x-token': res.data.token,
						'authentication': 'USERID ' + Base64.encode(open_id + ':' + token + ':' + uuid)
					}
					//当前时间
					const timestamp = Math.round(new Date().getTime() / 1000).toString();
					// 刷新token有效期
					let expires_time = res.data.expiresAt / 1000
					console.log('時間差', expires_time - parseInt(timestamp))
					if (expires_time - parseInt(timestamp) < 43200) {
						console.log('difftime', expires_time - parseInt(timestamp))
						//TODO:改时间
						uni.request({
							url: that.$websiteUrl + '/mini/refresh',
							method: 'GET',
							header: header
						}).then((accessToken) => {
							if (accessToken[1].statusCode === 200) {
								uni.setStorage({
									key: 'myinfo',
									data: {
										...res.data,
										token: accessToken[1].data.token,
										expiresAt: accessToken[1].data.expiresAt
									},
									success: function() {
										uni.reLaunch({
											url: 'pages/index/index'
										})
									}
								});

							}
						})
					}
					// 
					if (expires_time - parseInt(timestamp) < 60) {
						uni.showToast({
							title: '登录已过期',
							icon: none
						})
						this.$logout();
					}

				},
				error: function(e) {
					console.log(e)
				}
			});
			// #ifdef APP-PLUS  
			const _self = this;
			const _handlePush = function(message) {
				// TODO  
				let natUrl = message.payload
				uni.navigateTo({
					url: natUrl
				});
			};
			plus.push.addEventListener('click', _handlePush);
			plus.push.addEventListener('receive', _handlePush);
			// #endif  
		},
		onShow() {
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// console.log(res)
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										// console.log("更新了")
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			} else {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		},
	onHide: function() {}
	// onShareAppMessage: function(res) {
	// 	return {
	// 	        title: 'xxx',
	// 	        imageUrl: '/static/images/index/share_logo.png',
	// 	        path: '/pages/index/index'
	// 	}
	// }
	}
</script>

<style>
	/*每个页面公共css */
	/* uni-rich-text img {
		max-width: 100% !important;
		} */
	/* .nothingImg {
			width: 600rpx;
			height: 400rpx;
			margin: 0 auto;
			margin-top: 200rpx;
		} */
	// #ifndef APP-PLUS-NVUE
	.nothingImg {
		width: 600rpx;
		height: 400rpx;
		margin: 0 auto;
		margin-top: 200rpx;
	}

	// #endif
</style>
