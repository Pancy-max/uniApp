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
	 			 <view class="content">{{item.content}}</view>
	 	</view>
	 </view>

	<view class="tabbar" v-show="showEnter">
		<button @click="goTest" class="go_test">进入测评</button>
	</view>
	<view class="pay_btn" v-show="showPay">
		<view class="price-box">
			<text class="origin-price">￥{{price}}</text>
			<text class="sel-price" v-if="selPrice">券后价 ￥{{selPrice}}</text>
		</view>
		<button @click="goPay" class="go_buy">购买</button>
	</view>
 </view>
</template>

<script>
// import crypto from 'crypto-js'
import { KEYUTIL, KJUR, hextob64, hextob64u } from 'jsrsasign';
export default {
  components: {},
  props: {},
  data() {
    return {
		item: {},
		showEnter: false,
		showPay: false,
		myInfo: {},
		// childId: null
		price: null,
		selPrice: null,
		goodsSn: null,
	}
  },
  onLoad(option) {
  	// this.childId=option.childId
	this.checkLogin()
  },
  async created() {
	  this.item = getApp().globalData.testItem
	  this.myInfo = uni.getStorageSync('myinfo');
	  if (!this.item.isfree) { // 查询商品价格
		await this.getGoods()
		this.getPayStatus()
	  } else {
		  this.showEnter = true
	  }
  },
  computed: {},
  methods: {
	  checkLogin() {
	  	if (!this.myInfo) {
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
			  url: '/mini/getUserEvaInfo',
			  method: 'POST',
			  data: {
				mcode: this.item.code,
				username: this.myInfo.user.username,
				childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				isAll: false
			  }
		  }).then(res => {
			  if (res.code === 7 && res.msg.includes('未支付')) {
				this.showPay = true
			  } else {
				this.showEnter = true
			  }
		  })
	  },
	  goTest(){
		  uni.navigateTo({
			url: './test'
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
		const timeStamp =  Math.floor(Date.now() / 1000) + '';
		const nonceStr = this._generateNonceStr();
		const packageStr = "prepay_id=" + res.data.orderID;
		const originStr = `${this.$appKey}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`;
		const paySign = this._sha256withRSA(originStr);
		uni.requestPayment({
			provider: "wxpay",
			"timeStamp": timeStamp,
			"nonceStr": nonceStr,
			"package": packageStr,
			"signType": "RSA",
			"paySign": paySign,
			success: (e) => {
				// uni.navigateTo({
				// 	url: '../LivingExpenses/LivingExpenses'
				// })
			},
			fail: (err) => {
				console.log('失败', err)
				uni.showToast({
					title: "支付失败",
					icon: 'none',
					duration: 2000
				})
			}
		})
	  },
	  // 获取签名
	  _getRsaSign(originStr) {
		  const RASkey = 'nonceStr'
		  var encrypt=new crypto();
		  encrypt.setPrivateKey(RASkey);
		  let data =encrypt.encrypt(originStr)
		  return data;
	  },
	  _sha256withRSA(inputString) {
		  const privateKeyString = ``
	      const key = KEYUTIL.getKey(privateKeyString);
	      // 创建 Signature 对象，设置签名编码算法
	      const signature = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
	      // 初始化
	      signature.init(key);
	      // 传入待加密字符串
	      signature.updateString(inputString);
	      // 生成密文
	      const originSign = signature.sign();
	      // const sign64 = hextob64(originSign);
	      // console.log('sign base64 =======', sign64);
	      // const sign64u = hextob64u(originSign);
	      // console.log('sign base64u=======', sign64u);
	      return originSign;
	  },
	  // 生成随机字符串
	  _generateNonceStr() {
	      const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	      const arr = new Array(32)
			for (let i = 0; i < arr.length; i++) {
				const number = Math.floor(Math.random() * str.length)
				arr[i] = str[number]
			}
		  return arr.join('');
	  }
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		height: calc(100vh - 0rpx);
		background: #9e9e9e14;
		// padding: 40rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		
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
			overflow: auto;
		}
		.tt-wrapper {
			margin: 40rpx;
			justify-content: baseline;
			align-items: baseline;
			padding: 40rpx 20rpx;
			overflow: auto;
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
				max-height: 40vh;
			}
		}
	}
	.tabbar {
		// position: absolute;
		// width: 90%;
		// bottom: 5vh;
		.go_test {
			background-color: #ffff00bd;
		}
	}
	.pay_btn {
		display: flex;
		justify-content: space-between;
		background: #fff;
		padding: 40rpx;
		.go_buy {
			background: #ffff00bd;
			color: #000;
			width: 250rpx;
			margin-right: 0;
		}
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
	}
</style>
