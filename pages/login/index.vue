<template>
	<view class='login'>

		<view class="lo_icon">
			<view class="lo_image">
				<image src="../../static/common/logo.png" mode=""></image>
			</view>
		</view>
		<!-- 同意服务条款 -->
		<checkbox-group class="auth-clause" @change="CheckboxChange">
			<checkbox class="orange" :class="checked == 2 ? 'checked' : ''" :checked="checked == 2 ? true : false"
				value="2" />
			<view style="padding-right: 30rpx;">
				我已阅读<text class="linkxy" @tap="getContent('userAggrement')">用户协议</text>、<text class="linkxy"
					@tap="getContent('privacyAggrement')">隐私权保护声明</text>及<text class="linkxy"
					@tap="getContent('childrenAggrement')">儿童个人信息保护规则</text>
			</view>
		</checkbox-group>
		<view class="regbutton_login" @click='wechatLogin'>
			<button class="button" open-type='getUserInfo'>微信登录{{agreeF}}</button>
		</view>

		<checkbox-group class="read-text" @change="checkBoxF">
			<checkbox color="#55557f" style="transform:scale(0.7)" class="orange" :checked="agreeF == 2 ? true : false"></checkbox>
				我已阅读并确认同意
				<text class="linkxy" @tap="getContent('userAggrement')">《用户协议》</text>和
				<text class="linkxy" @tap="getContent('privacyAggrement')">《隐私权保护声明》</text>
		</checkbox-group>
		
		<view class="read-text">
			<checkbox color="#55557f" style="transform:scale(0.7)" class="orange" v-model="agreeS"></checkbox>
				我已阅读并确认同意
				<text class="linkxy" @tap="getContent('childrenAggrement')">《儿童个人信息保护规则》</text>
		</view>

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
				agreeF: 0,
				agreeS: false,
				checked: 0,
				isChecked: false,
				H5Wechat: true,
				appid: '',
				code: '',
				tel: '',
				openId: ''
			};
		},

		onLoad() {

			uni.clearStorageSync();
			// #ifdef H5
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.H5Wechat = true
			} else {
				this.H5Wechat = false
			}
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
			CheckboxChange(e) {
				console.log('111', e.detail.value);
				this.checked = e.detail.value;
				this.isChecked = !this.isChecked
			},
			checkBoxF(e) {
				console.log('1111',e.detail.value);
				this.agreeF = e.detail.value;
			},
			wechatLogin() {
				if (!this.isChecked) {
					uni.showToast({
						title: '请勾选同意选项',
						icon: 'none',
						duration: 2000,
					});
					return
				}
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
						uni.getUserInfo({
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
										this.$app_secret + `&nonce=` + nonce +
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
										this.$app_secret + `&nonce=` + nonce +
										`&time_stamp=` +
										time_stamp),
									app_key: this.$appKey
								}
								natUrl = "/pages/login/bindtel"
								// #endif
								this.$refs.loading.hideLoading()
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
		font-size: 32rpx;
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
</style>
