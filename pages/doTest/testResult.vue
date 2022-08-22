<template>
 <view class="test-wrapper">
	 <view class="test-content">
	 	<view class="title">
	 	 	测评报告
	 	 </view>
	 	 <view class="desc">
	 	 	您的报告已生成，有问题可以预约咨询老师
	 	 </view>
	 	<view class="score">{{testResult.score}}分</view>
		<view class="content">
			维度：{{testResult.mainDim}}
		</view>
		<view class="content">
			结果评价：{{testResult.content}}
		</view>
	 </view>
 </view>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
		childId: 0,
		item: {},
		myInfo: {},
		testResult: null,
		mcode: ''
	}
  },
  computed: {},
  onLoad(e) {
	console.log('onLoad', e.mcode)
	if (e.mcode) {
		this.mcode = e.mcode
		this.type = e.type
		this.childId = e.childId
	} else {
		this.childId = getApp().globalData.childId
		this.item = getApp().globalData.testItem;
		this.mcode = this.item.code
		this.type = this.item.type
	}
	this.myInfo = uni.getStorageSync('myinfo');
	this.getUserEvaInfo()
  },
  methods: {
	  getUserEvaInfo() {
		  this.request({
		  	url: '/mini/getUserEvaInfo',
		  	method: 'POST',
		  	data: {
		  		mcode: this.mcode,
		  		username: this.myInfo.user.username,
		  		childId: this.type === 1 ? this.childId : 0, // 1-儿童 2-成人
		  		isAll: false
		  	}
		  }).then(res => {
		  	const data = res.data
			console.log('获取测评结果', data.userEvaInfo.MiniEvaUserDimension[0])
			this.testResult = data.userEvaInfo.MiniEvaUserDimension[0]
		  })
		  
	  }
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		padding: 40rpx;
		background: #f1f1ff;
		height: calc(100vh - 80rpx);
		overflow: auto;
		.test-content {
			padding: 30rpx;
			border-radius: 20rpx;
			background: #fff;
		}
		.title {
			font-size: 40rpx;
			color: #000;
		}
		.desc {
			font-size: 30rpx;
			color: #999;
		}
		.score {
			background: #ffff00;
			color: #222;
			font-size: 40rpx;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin: 50rpx auto;
			text-align: center;
			line-height: 120rpx;
		}
		.content {
			font-size: 30rpx;
			text-align: center;
			line-height: 50rpx;
		}
	}
</style>
