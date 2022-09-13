<template>
 <view class="test-wrapper">
	 <view class="title-wrapper">
		 <view class="imageWrapper">
		 	<image 
		 		src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com%2Fuploads%2Fimage%2F2019%2F11%2F20%2Fb6820f40f5e2e96257f5e5359c65f6b5.png&refer=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662444400&t=ab6410c9d431918de67c3d3a7309414a"
		 		class="image"
		 	/>
		 </view>
		 <view class="title">{{item.title}}</view>
		 <view class="subtitle">{{item.subtitle}}</view>
		 <view class="desc">共{{item.evaTopicList.length}}道题目 | 预计作答{{item.estimateTime/60}}分钟 </view>
	 </view>
	 <view class="tt-wrapper-box">
	 	<view class="tt-wrapper">
			 <view class="content-desc">测评简介</view>
			 <view class="content" v-html="item.content"></view>
	 	</view>
	 </view>
	<view class="selectedChild" v-if="childId">
		已选儿童：{{berList.find(item => item.ID === +childId).nickname}}
	</view>
	<view class="tabbar-test" v-if="showEnter">
		<view v-if="item.type === 1" class="tabbar-btn btn-left" @tap="selectChild">
			<block v-if="berList.length === 0">
				<span class="nav-addchild">
					添加儿童
				</span>
			</block>
			<block v-if="berList.length > 0">
				<span class="nav-addchild">
					选择儿童
				</span>
			</block>
		</view>
		<view class="tabbar-btn btn-right" @tap="jdugeTest" >
			<span class="test-btn">进入测评</span>
		</view>
	</view>
	<view class="pay_btn tabbar" v-if="showPay">
		<view class="price-box">
			<text class="origin-price">￥{{price}}</text>
			<text class="sel-price" v-if="selPrice">活动价 ￥{{selPrice}}</text>
		</view>
		<button @click="goPay" class="go-buy">购买</button>
	</view>
	<!-- <uni-popup ref="childPopup" type="bottom"  background-color="#fff"> -->
	<!-- </uni-popup> -->
 </view>
</template>
 
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
		item: {},
		showEnter: false,
		showPay: false,
		myInfo: {},
		childId: null,
		price: null,
		selPrice: null,
		goodsSn: null,
		payTimer: null,
		maxTry: 0,
		berList: [],
		mcode: null,
		selectChildIndex: null
	}
  },
  onShow() {
	 this.getBerList() 
	 this.childId = getApp().globalData.childId
  },
  async onLoad(option) {
  	// this.childId=getApp().globalData.childId
	console.log('option', option)
	this.mcode = option.mcode
	this.checkLogin()
	this.getBerList()
	this.getCurrentItem(option.mcode)
	if (!this.item.isfree) { // 查询商品价格
		await this.getGoods()
		this.getPayStatus()
	} else {
		this.showEnter = true
	}
  },
  beforeDestroy() {
	clearInterval(this.payTimer)
	this.payTimer = null  
  },
  async created() {
	  this.myInfo = uni.getStorageSync('myinfo');
  },
  computed: {},
  methods: {
	  getCurrentItem(mcode) {
		 const evaListInfo = getApp().globalData.evaListInfo
		 for (let ele of evaListInfo) {
			 for (let item of ele.eva_form_list) {
			 	if (item.code === mcode) {
			 		item.evaTopicList.sort((a, b) => {
			 			return a.sortOrder > b.sortOrder ? 1 : (a.sortOrder === b.sortOrder ? 0 : -1)
			 		})
			 		getApp().globalData.testItem = item;
			 		this.item = item
					return
			 	}
			 }
		 	
		 }
	  },
	  checkLogin() {
	  	if (!this.myInfo) {
			uni.showModal({
				title: '提示信息',
				content: '请先登录',
				showCancel: false,
			})
			// uni.showModal({
			// 	title: '提示信息',
			// 	content: '请先登录',
			// 	cancelText: '去登录',
			// 	confirmText: '取消',
			// 	confirmColor: "#262626",
			// 	success(res) {
			// 		if (res.confirm) {
			// 			debugger
						
			// 			uni.navigateTo({
			// 				url: '../login/index'
			// 			})
			// 		} else if (res.cancel) {
			// 			debugger
			// 		}
			// 	}
			// })
	  	}
	  },
	  // 获取商品
	  getGoods() {
		this.request({
			url: '/mini/getGoods',
			method: 'POST',
			data: {
				goodsSn: this.item.code,
				name: this.item.title
			}
		}).then(res => {
			const {goodsInfo = {}} = res.data
			this.price = goodsInfo.lineatePrice / 100
			this.goodsSn = goodsInfo.goodsSn
			this.selPrice = goodsInfo.price / 100
		})
	  },
	  
	  getPayStatus() {
		  this.request({
			  url: '/mini/getUserEvaPayStatus',
			  method: 'POST',
			  data: {
				mcode: this.item.code,
				username: this.myInfo.user.username,
				// childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				// isAll: false
			  }
		  }).then(res => {
			  if (res.data.userEvaPayStatus && res.data.userEvaPayStatus.ispay) {
				  this.showEnter = true
			  } else {
				  this.showPay = true
			  }
			 //  if (res.code === 7 && res.msg.includes('未支付')) {
				// this.showPay = true
			 //  } else {
				// this.showEnter = true
			 //  }
		  })
	  },
	  getBerList(){
	  	this.request({
	  		url: '/mini/getChildInfo',
	  		method: 'GET'
	  	}).then((res)=> {
	  		this.berList = res.data.userInfo
	  	})
	  },
	  selectChild() {
		if (this.berList.length === 0) {
			uni.navigateTo({
				url: '../addBer/addBer'
			})
		} else {
			uni.navigateTo({
				url: '../familyBer/familyBerSelect'
			})
		}
	  },
	  jdugeTest() {
		  if (this.item.type === 1) { // 儿童
			// this.$refs.childPopup.open()
			if (!this.childId) {
				uni.showToast({
					title: '请添加儿童信息进行测评',
					icon: 'none',
					duration: 2000
				})
				return
			}
			this.goTest()
			// this.getBerList()
		  } else {
			getApp().globalData.childId = null
			this.goTest()
		  }
	  },
	  goTest(){
		  
		this.request({
			url: '/mini/getUserEvaProgress',
			method: 'POST',
			data: {
				mcode: this.item.code,
				username: this.myInfo.user.username,
				childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				isAll: false
			}
		}).then(res => {
			const data = res.data
			if (data && data.userEvaProgress && data.userEvaProgress[0] && data.userEvaProgress[0].hasFinished) {
				uni.redirectTo({
					url: `./testResult?mcode=${this.item.code}&childId=${this.item.type === 1 ? this.childId : 0}&type=${this.item.type}`
				})
			} else {
				uni.navigateTo({
					url: './test'
				})
			}
		})
	  },
	  async goPay() {
		const res = await this.request({
			url: '/wxpay/getPayCode',
			method: 'POST',
			data: {
				goodSn: this.goodsSn,
				openid: this.myInfo.user.weixinOpenid,
			}
		})
		if (res.code === 7) {
			uni.showToast({
				title: res.msg,
				icon: 'none',
				duration: 2000
			})
			return
		}
		uni.requestPayment({
			provider: "wxpay",
			"timeStamp": res.data.timeStamp,
			"nonceStr": res.data.nonceStr,
			"package": res.data.package,
			"signType": "RSA",
			"paySign": res.data.paySign,
			// success: (e) => {
			// 	uni.showToast({
			// 		title: "支付成功",
			// 		icon: 'none',
			// 		duration: 2000
			// 	})
			// 	this.showPay = false
			// 	this.showEnter = true
			// 	// 查询支持结果
			// 	console.log('success', e)
			// },
			fail: (err) => {
				console.log('失败', err)
				uni.showToast({
					title: "支付失败",
					icon: 'none',
					duration: 2000
				})
				clearInterval(this.payTimer)
				this.payTimer = null
			}
		})
		// 两秒后轮询结果
		setTimeout(() => {
			this.payTimer = setInterval(() => {
			  this.maxTry = 0
			  this.searchPayResult(res.data.outTradeNo)
			}, 500)
		}, 2000)
	  },
	  searchPayResult(id) {
		  this.maxTry++
		  if (this.maxTry > 100) {
			  uni.showToast({
					title: "支付超时",
					icon: 'none',
					duration: 2000
				})
				clearInterval(this.payTimer)
				this.payTimer = null
			  return
		  }
		  try{
		  	this.request({
		  		url: `/wxpay/getOrderById`,
				method: 'POST',
				data: {
					outTradeNo: id
				}
		  	}).then(res => {
		  		console.log('查询支付结果', res)
				const tradeState = res.data && res.data.tradeState
				  if (res.code === 0 && tradeState === 'SUCCESS') {
					  uni.showToast({
							title: "支付成功",
							icon: 'none',
							duration: 2000
						})
						this.showPay = false
						this.showEnter = true
					  clearInterval(this.payTimer)
					  this.payTimer = null
				  }
				  if (!res || (typeof res === 'string' && res.includes('404'))) {
					uni.showToast({
						title: "支付失败",
						icon: 'none',
						duration: 2000
					})
				  }
				  if (['PAYERROR', 'REVOKED', 'REFUND', 'CLOSED'].includes(tradeState)) {
					  let msg = ''
					  switch (tradeState){
					  	case 'PAYERROR':
							msg = '支付失败'
					  		break;
						case 'REVOKED':
							msg = '已撤销'
							break;
						case 'PAYERROR':
							msg = '转入退款'
							break;
						case 'CLOSED':
							msg = '已关闭'
							break;
					  	default:
					  		break;
					  }
					  uni.showToast({
					  	title: msg,
					  	icon: 'none',
					  	duration: 2000
					  })
				  	clearInterval(this.payTimer)
				  	this.payTimer = null
				  }
		  	}).catch(e => {
				console.error('e', e)
				clearInterval(this.payTimer)
				this.payTimer = null
				uni.showToast({
					title: "支付失败",
					icon: 'none',
					duration: 2000
				})
			})
		  }catch(e){
		  	//TODO handle the exception
			clearInterval(this.payTimer)
			this.payTimer = null
			uni.showToast({
				title: "支付失败",
				icon: 'none',
				duration: 2000
			})
		  }
	  }
  },
};
</script>

<style lang="less" scoped>
	@import '../../common/common.css';
	.test-wrapper {
		height: calc(100vh - 100rpx);
		background: #9e9e9e14;
		// padding: 40rpx;
		display: flex;
		flex-direction: column;
		overflow: auto;
		
		.title-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background: #fff;
			border: #fff;
			border-radius: 40rpx;
			margin: 40rpx;
			padding: 40rpx 0;
			.imageWrapper {
				.image {
					width: 150rpx;
					height: 100rpx;
				}
			}
			.title{
				font-size: 50rpx;
				font-weight: 500;
				margin: 20rpx 0;
			}
			.subtitle{
				font-size: 30rpx;
				font-weight: 500;
				padding: 0 20rpx;
			}
			.desc{
				margin-top: 40rpx;
				font-size: 25rpx;
			}
		}
		.tt-wrapper-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			// overflow: auto;
		}
		.tt-wrapper {
			margin: 40rpx;
			justify-content: baseline;
			align-items: baseline;
			padding: 40rpx 20rpx;
			// overflow: auto;
			background: #fff;
			border: #fff;
			border-radius: 40rpx;
			.content-desc {
				font-size: 30rpx;
				font-weight: 600;
			}
			.content {
				font-size: 30rpx;
				margin-top: 20rpx;
				// max-height: 40vh;
			}
		}
	}
	.tabbar {
		position: fixed;
		width: 90%;
		bottom: 1vh;
		left: 5%;
		background: #9e9e9e14;
	}
	.tabbar-test {
		position: fixed;
		width: 100%;
		bottom: 0vh;
		height: 100rpx;
		left: 0%;
		background: #fff;
		display: flex;
		align-items: center;
		text-align: center;
	}
	.tabbar-btn {
		// width: 50%;
		flex: 1;
		line-height: 100rpx;
	}
	.btn-left {
		background-color: #7878b3;
		color: #fff;
	}
	.btn-right {
		background-color: #55557f;
		color: #fff;
	}
	.nav-addchild {
		color: #fff;
	}
	.pay_btn {
		display: flex;
		justify-content: space-between;
		background: #fff;
		.price-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.origin-price {
			color: #000;
			font-size: 40rpx;
		}
		.sel-price {
			color: red;
			font-size: 30rpx;
		}
		.go-buy {
			background: #FF5000;
			color: #f5f5f2;
			position: absolute;
			right: 1vw;
			top: 6rpx;
			width: 30vw;
		}
	}
	.my_tabs {
		display: flex;
		margin: 0 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		
		.tabs_left {
			margin: 34rpx 0;
			margin-left: 40rpx;
			margin-right: 36rpx;
			color: #333;
	
			image {
				width: 48rpx;
				height: 48rpx;
				margin-top: 8rpx;
			}
			.eva-title {
				border-left: 6rpx solid #143d72;
				padding-left: 20rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #444;
			}
		}
		.tabs_right {
			flex: 1;
			display: flex;
			justify-content: start;
			flex-direction: column;
			
			text {
				margin: 10rpx 0;
				font-size: 32rpx;
				color: #262626;
				.nick-name {
					color: #000;
					font-weight: bold;
					font-size: 38rpx;
				}
			}
			
			image {
				margin-right: 38rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
	.selectedChild {
		display: inline-block;
		font-size: 34rpx;
		margin-bottom: 10rpx;
		margin-left: 30rpx;
	}
</style>
