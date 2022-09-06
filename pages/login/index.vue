<template>
	<view class='login'>

		<view class="lo_icon">
			<!-- <view class="lo_image">
				<image src="../../static/common/logo.png" mode=""></image>
			</view> -->
			<image :src="logoUrl" mode="heightFix"></image>
		</view>
		<view class="text-sub">
			请完成微信授权以继续使用
		</view>
		<view class="regbutton_login">
			<button class="button" open-type='getUserProfile' @tap='getUserProfile' :disabled="disabled">
				微信登录</button>
		</view>

		<checkbox-group @change="checkBoxF">
			<view class="read-text">
				<checkbox color="#55557f" style="transform:scale(0.7)" class="orange" ></checkbox>
					我已阅读并确认同意
					<text class="linkxy" @tap="getContent('userAggrement')">《用户协议》</text>和
					<text class="linkxy" @tap="getContent('privacyAggrement')">《隐私权保护声明》</text>
			</view>
			<view class="read-text">
				<checkbox color="#55557f" style="transform:scale(0.7)" class="orange"></checkbox>
					我已阅读并确认同意
					<text class="linkxy" @tap="getContent('childrenAggrement')">《儿童个人信息保护规则》</text>
			</view>
		</checkbox-group>
		<view class="lo_font">
			风和兴有限公司技术支持
		</view>
		<wyb-loading ref="loading" title="登录中..." />
	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		data() {
			return {
				disabled: true,
				checked: 0,
				isChecked: false,
				H5Wechat: true,
				appid: '',
				code: '',
				tel: '',
				openId: '',
				logoUrl: ''
			};
		},

		onLoad() {
			uni.clearStorageSync();
			// #ifdef H5
			// var ua = navigator.userAgent.toLowerCase();
			// if (ua.match(/MicroMessenger/i) == "micromessenger") {
			// 	this.H5Wechat = true
			// } else {
			// 	this.H5Wechat = false
			// }
			// this.getAppid()
			// this.getUrlParam()

			// #endif
			// #ifdef MP-WEIXIN
			this.H5Wechat = true
			// #endif
			this.getAboutUs()

		},
		components: {
			wybLoading
		},
		methods: {
			getContent(key) {
				let p = encodeURIComponent(getApp().globalData.aboutUsInfo[key])
				uni.navigateTo({
					url: `/pages/webview/index?path=${p}`
				})
			},
			checkBoxF(e) {
				this.disabled = e.detail.value.length < 2;
			},
			getUserProfile() {
				 wx.getUserProfile({
				    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					// provider: "weixin",
					success: (infoRes) => {
						// #ifdef MP-WEIXIN||APP-PLUS
						// #ifdef MP-WEIXIN
						// getData = {
						// 	code: loginRes.code,
						// 	encryptedData: infoRes.encryptedData,
							// iv: infoRes.iv,
							// time_stamp: time_stamp,
							// nonce: nonce,
							// signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
							// 	this.$appKeyTi + `&nonce=` + nonce +
							// 	`&time_stamp=` +
							// 	time_stamp),
							// app_key: this.$appKey
						// }
						getApp().globalData.wechatInfo = infoRes
						// #endif
						this.$refs.loading.hideLoading()
						// 跳到到微信登录
						uni.navigateTo({
							url: '/pages/login/wechat'
						})
						// #endif
					}
				})
			},
			wechatLogin() {
				let that = this
				this.$refs.loading.showLoading()
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				let getData = {}
				let natUrl = "/pages/login/wechat"
				// #ifdef MP-WEIXIN || APP-PLUS
				uni.login({
					provider: "weixin",
					success: (loginRes) => {
						uni.getUserProfile({
							provider: "weixin",
							success: (infoRes) => {
								// #ifdef MP-WEIXIN||APP-PLUS
								// #ifdef MP-WEIXIN
								getData = {
									code: loginRes.code,
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$appKeyTi + `&nonce=` + nonce +
										`&time_stamp=` +
										time_stamp),
									app_key: this.$appKey
								}
								natUrl = "/pages/login/wechat"
								// #endif
								// #ifdef APP-PLUS
								getData = {
									user_info: JSON.stringify(infoRes.userInfo),
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$appKeyTi + `&nonce=` + nonce +
										`&time_stamp=` +
										time_stamp),
									app_key: this.$appKey
								}
								natUrl = "/pages/login/bindtel"
								// #endif
								this.$refs.loading.hideLoading()
								console.log('getData', getData)
								// 跳到到微信登录
								uni.navigateTo({
									url: natUrl
								})
								// #endif
							}
						})
					}
				})
				// #endif
			},
			getUrlParam() {
				let url = window.location.href.split('#')[0]
				let serch = url.split('?')[1]
				let _this = this;
				if (serch) {
					let arr = serch.split('&')
					let code = arr[0].split('code=')[1]
					_this.code = code
					_this.H5WechatLogin()
					// 此时获取到的code码需要你传给后端，因为微信的安全机制，前端不能做处理
				} else {
					return null
				}
			},
			getAboutUs() {
				this.request({
					url: '/mini/getAboutUs',
					method: 'GET'
				}).then(res => {
					// this.aboutUsInfo = res.data.aboutUs
					getApp().globalData.aboutUsInfo = res.data.aboutUs
					getApp().globalData.logoUrl = res.data.aboutUs.aboutUrl
					this.logoUrl = getApp().globalData.logoUrl
				}).catch(e => {
					console.error(e)
					// this.aboutUsInfo = {};
				})
			},
		},
	};
</script>

<style lang="less">


	.lo_icon {
		margin-bottom: 95rpx;
		margin-top: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.lo_image {
			margin-bottom: 22rpx;

			image {
				width: 124rpx;
				height: 124rpx;
			}
		}

		.lo_text {
			image {
				width: 196rpx;
				height: 54rpx;
			}
		}
	}

	.regbutton_login {
		width: 630rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		border: #b2b2b2 1rpx;
		margin: 70rpx auto;
	}

	.lo_font {
		width: 100%;
		position: absolute;
		bottom: 145rpx;
		font-size: 24rpx;
		color: #808080;
		text-align: center;
	}

	.button {
		background-color: #65bb25;
		// font-size: 32rpx;
		// border-radius: 50rpx;
		color: #FFFFFF;
	}

	.regbutton {
		background-color: #FFFFFF;
		font-size: 32rpx;
		color: #4D4D4D;
	}

	.auth-clause {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #909090;
		margin-top: 80rpx;
		margin-left: 50rpx;
	}
	
	checkbox .wx-checkbox-input{
	  border-radius: 50%;
	}
	
	switch.orange[checked] .wx-switch-input,
	checkbox.orange[checked] .wx-checkbox-input,
	radio.orange[checked] .wx-radio-input,
	switch.orange.checked .uni-switch-input,
	checkbox.orange.checked .uni-checkbox-input,
	radio.orange.checked .uni-radio-input {
		background-color: #686868 !important;
		border-color: #000000 !important;
		color: #ffffff !important;
		border-radius: 50%;
	}
	
	
	.read-text {
		display: flex;
		font-size: 25rpx;
		align-items: center;
		margin-left: 50rpx;
		margin-bottom: 20rpx;
	}
	.linkxy {
		color: #0055ff;
	}
	
	.text-sub {
		width: 100%;
		font-size: 24rpx;
		color: #808080;
		text-align: center;		
	}
</style>
