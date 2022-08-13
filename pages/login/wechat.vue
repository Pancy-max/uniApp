<template>
	<view>
		<view class="lo_icon">
			<view class="lo_image">
				<image src="../../static/common/logo.png" mode=""></image>
			</view>
		</view>
		
		<view class="content" style="border-top: 1px solid #CCCCCC;">
			<view>申请获取以下权限</view>
			<view class="content_text">获得你的公开信息(昵称、头像等)</view>
			<!-- <button type="primary" style="background-color: #65bb25;" open-type="getUserInfo" @getuserinfo="getUserInfo">微信验证登录</button> -->
			<button type="primary" style="background-color: #65bb25;" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信验证登录</button>
			
			<button type="default" @tap="cancel">取消登录</button>
			<wyb-loading ref="loading" title="登录中..."/>
		</view>
	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	import WXBizDataCrypt from "@/common/WXBizDataCrypt.js";        //请以你的实际地址为准

	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		data(){
			return {
				tel: '',
				loginRes: '',
				wxKeys: {
					openid: '',       // openid 用户唯一标识
					unionid: ',',    // unionid 开放平台唯一标识  
					session_key: ''  // session_key  会话密钥  
				}
			}
		},
		components:{
			wybLoading
		},
		onLoad() {
			const that = this
			wx.login({
			      success: res => {
					//1.微信登录成功后拿到code
			        this.loginRes = res.code
					// 2.用code 换取 session 和 openid/unionid
					uni.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session',  
						method:'GET',
						header: {
						  'content-type': 'application/x-www-form-urlencoded'
						},
						data: {  
							appid: this.$appKey,        //你的小程序的APPID  
							secret: this.$app_secret,       //你的小程序的secret,  
							js_code: res.code,            //wx.login 登录成功后的code 
							grant_type: 'authorization_code'
						},
						success: (cts) => {
							// 换取成功后 暂存这些数据 留作后续操作  
							this.wxKeys.openid=cts.data.openid     //openid 用户唯一标识  
							// this.wxKeys.unionid=cts.data.unionid     //unionid 开放平台唯一标识  
							this.wxKeys.session_key=cts.data.session_key     //session_key  会话密钥  
						}  
					});
			      }
			    })
		},
		methods:{
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			getWxUserInfo(e) {
				const that = this
				wx.getUserInfo({
				  success: function(res) {
					that.getUserInfo(e, res.userInfo)
				  }
				})
			},
			
			
			async getUserInfo(e, userInfo) {
				const that = this
				console.log('getUserInfo', e.detail)
				// 1.获取敏感信息
				let pc = new WXBizDataCrypt(this.$appKey, this.wxKeys.session_key);
				const evcrytedInfo = pc.decryptData(e.detail.encryptedData, e.detail.iv); 
				console.log('evcrytedInfo', evcrytedInfo)
				// 2.获取已注册的用户信息
				// const res = await this.request({
				//   url:'/mini/getUserInfo',
				//   method:'POST'
				// })
				// const mobile = evcrytedInfo.countryCode + evcrytedInfo.phoneNumber
				const mobile = evcrytedInfo.phoneNumber
				const pwd = md5(mobile.split('').reverse().join(''))
				const data = {
					  "avatar": userInfo.avatarUrl,
					  "gender": userInfo.gender,
					  "nickname": userInfo.nickName,
					  "province": userInfo.province || '未知',
					  "password": pwd,
					  "weixinOpenid": this.wxKeys.openid,
					  "mobile": mobile,
					  "userName": userInfo.nickName
				}
				const loginData = {
					  "nickname": userInfo.nickName,
					  "password": pwd,
					  "mobile": mobile,
				}
				this.request({
				  url:'/mini/register',
				  method:'POST',
				  data: JSON.stringify(data)
				}).then((res)=>{
					console.log('login===res', res)
					if (res.code === 0) { // 注册成功
						this.userLogin(loginData)
					} else if (res.code === 7 && res.msg.includes('已注册')) { // 已注册
						this.userLogin(loginData)
					} else {
						that.$refs.loading.hideLoading()
						uni.showToast({
							title: res.msg,
							icon:"error"
						})
					}
				})
			},
			
			userLogin(data) {
				const that = this
				this.request({
				  url:'/mini/login',
				  method:'POST',
				  data
				}).then((res)=>{
					that.$refs.loading.hideLoading()
					  if(res.code === 0){
						  // that.$save_client(res.data.user.uuid);
						  uni.showToast({
						  	title: res.msg,
						  	icon:"success"
						  })
						  uni.setStorage({
							 key: 'myinfo',
							 data: res.data,
							 success() {
							 }
						  })
						  uni.switchTab({
							 url:'../my/index'
						  })
					  }
					  // else if(res.code == 400){
						 //  uni.showModal({
						 //  	title:res.msg,
							// showCancel:false,
							// success() {
							// 	uni.switchTab({
							// 		url:'../index/index'
							// 	})
							// }
						 //  })
					  // }
					  else{
						  uni.showToast({
							  title:res.msg,
							  icon:"none"
						  })
					  }
				})
			},
			weChat(){
				let that = this
				this.$refs.loading.showLoading() 
				let nonce = Math.random().toString(36).substr(2)
				let  time_stamp = Date.parse(new Date())/1000
				let getData = {}
				uni.login({
					provider:"weixin",
					success:(loginRes) =>{
						uni.getUserInfo({
							provider:"weixin",
							success: (infoRes)=> {
								// #ifdef MP-WEIXIN
									getData={
										 code:loginRes.code,
										 encryptedData:infoRes.encryptedData,
										 iv:infoRes.iv,
										 time_stamp:time_stamp,
										 nonce:nonce,
										 signature:md5(`app_key=`+this.$appKey+`&app_secret=`+this.$app_secret+`&nonce=`+nonce+`&time_stamp=`+time_stamp),
										 app_key:this.$appKey,
										 times: 2,
										 os_type:1,
										 mobile: that.tel
								}
								// #endif
								that.request({
								  url:'/mini/register',
								  method:'POST',
								  data:getData
								}).then((res)=>{
									that.$refs.loading.showLoading() 
									  if(res.code === 200){
										  uni.setStorage({
											 key: 'myinfo',
											 data: res.data,
											 success() {
											 }
										  })
										  uni.switchTab({
											 url:'../index/index'
										  })
									  }else if(res.code == 400){
										  uni.showModal({
										  	title:res.desc,
											showCancel:false,
											success() {
												uni.switchTab({
													url:'../index/index'
												})
											}
										  })
									  }else{
										  uni.showToast({
											  title:res.desc,
											  icon:"none"
										  })
									  }
								})
							}
						})
					}
				})
			},
			getPhoneNumber(e){
				console.log('e',e)
				let that = this
				that.$refs.loading.showLoading() 
				if (!e.target.iv) {
				    uni.showModal({
				      content: '获取手机号失败！',
				      showCancel: false
				    })
					that.$refs.loading.hideLoading() 
				    return;
				}
				
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date())/1000
				let getData = {}
				uni.checkSession({
					success() {
					},
					fail() {
						wx.login({
						      success: res => {
							    console.log('wx.login', res)
						        that.loginRes = res.code
						      }
						    })
					},
					complete() {
						// 获取用户信息
						that.$refs.loading.hideLoading()
						// that.getUserInfo(e)
						that.getWxUserInfo(e)
					}
				})
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.lo_icon{
		margin-bottom: 95rpx;
		margin-top: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.lo_image{
			margin-bottom: 22rpx;
			image{
				width: 124rpx;
				height: 124rpx;
			}
		}
		.lo_text{
			image{
				width: 196rpx;
				height: 54rpx;
			}
		}
	}
	.content {
		width: 80%;
		margin: 0 auto;
		padding: 20rpx 0;
		.content_text {
			font-size: 24rpx;
			color: #CCCCCC;
			margin: 30rpx 0 60rpx 0;
		}
		button{
			margin-bottom: 30rpx;
		}
	}
</style>
