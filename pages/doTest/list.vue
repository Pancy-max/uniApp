<template>
 <view class="test-wrapper">
	<view class="block-view">
	
		<view class="my_tabs" @tap="goTest(index)" v-for="(item, index) in testList" :key="index">
			<view class="tabs_left">
				<my-icon type="vip" size="30" />
			</view>
			<view class="tabs_right">
				<view class="">
					<view>{{item.title}}</view>
					<view>{{item.endTime}}</view>
				</view>
				
				<image src="../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>
	
		<view class="fengexian"></view>
	</view>
	 
	 <!-- <view class="tt-wrapper">
		 <view class="content-desc">测评简介</view>
		 <view class="content">{{item.content}}</view>
	 </view>

	<view class="tabbar" v-show="showEnter">
		<button @click="goTest" class="go_test">进入测评</button>
	</view> -->
 </view>
</template>

<script>

export default {
  components: {},
  props: {},
  data() {
  	return {
  		testList: [], //列表
  	}
  },
  onLoad() {
  	this.getTestList();
  },
  onShow() {
  	this.getTestList();
  },
  onReachBottom() { //上拉触底函数
  	this.getTestList(); //加载的数据
  },
  onPullDownRefresh() {
  	this.getTestList();
  	setTimeout(function() {
  		uni.stopPullDownRefresh();
  	}, 1000);
  },
  computed: {},
  methods: {
	  getTestList() {
		let value = uni.getStorageSync('myinfo');
		this.request({
			url: '/mini/getUserEvaProgress',
			method: 'POST', 
			data: {
				username: value.user.username,
				isAll: true,
				childId: 0,
				mcode: ''
			}
		}).then(res => {
			// const lastInfo = res.data.userEvaInfo
			this.testList = res.data.userEvaProgress
		}).catch(e => {
			console.error(e)
			this.testList = [];
		})
	  },
	  goTest(index){
		  const item = this.testList[index]
		  if (item && item.hasFinished) {
		  	uni.redirectTo({
		  		url: './testResult?mcode=' + item.code
		  	})
		 } else {
			 uni.showToast({
			 	title: "题目未完成",
			 	icon: 'none',
			 	duration: 2000
			 })
		 }
	  },
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		height: calc(100vh - 80rpx);
		background: #9e9e9e14;
		padding: 40rpx;
	}
	.tabbar {
		position: absolute;
		width: 90%;
		bottom: 100rpx;
		.go_test {
			background-color: #ffff00bd;
		}
	}
	.block-view {
		background: #fff;
		border-radius: 40rpx;
		margin-bottom: 30rpx;
		padding: 10rpx;
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
</style>
