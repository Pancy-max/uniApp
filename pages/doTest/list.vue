<template>
 <view class="test-wrapper">
	 <scroll-view scroll-y="true" >
	 	<view class="block-view">
	 	
	 		<view class="my_tabs" @tap="goTest(index)" v-for="(item, index) in testList" :key="index">
	 			<view class="tabs_left">
	 				<my-icon :type="item.hasFinished ? 'checkmarkempty' : 'map'" size="20" />
	 				<view class="tip">
	 					{{item.hasFinished ? '已完成' : '未完成'}}
	 				</view>
	 			</view>
	 			<view class="tabs_right">
	 				<view class="" >
	 					<view>{{item.title}}</view>
	 					<view>{{item.endTime}}</view>
	 				</view>
	 				
	 				<image src="../../static/my/btn_01.png" mode=""></image>
	 			</view>
	 		</view>
	 	
	 		<view class="fengexian"></view>
	 		<view class="noMore" v-if="testList && testList.length === 0">暂无数据</view>
	 		
	 	</view>
	 </scroll-view>
	
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
				// childId: 0,
				mcode: ''
			}
		}).then(res => {
			// const lastInfo = res.data.userEvaInfo
			this.testList = res.data.userEvaProgress || []
		}).catch(e => {
			console.error(e)
			this.testList = [];
		})
	  },
	  goTest(index){
		  const item = this.testList[index]
		  if (item && item.hasFinished) {
		  	uni.redirectTo({
		  		url: `./testResult?mcode=${item.code}&type=${item.type}&childId=${item.childId}`
		  	})
		 } else {
			 // uni.showToast({
			 // 	title: "题目未完成",
			 // 	icon: 'none',
			 // 	duration: 2000
			 // })
			 uni.navigateTo({
			 	url: './test'
			 })
		 }
	  },
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		height: calc(100vh);
		background: #9e9e9e14;
		// padding: 40rpx;
	}
	.block-view {
		background: #fff;
		border-radius: 40rpx;
		margin: 20rpx;
		padding: 10rpx;
	}
	
	.my_tabs {
		display: flex;
		margin: 0 20rpx;
		box-sizing: border-box;
	
		.tabs_left {
			margin: 34rpx 0;
			margin-right: 36rpx;
			color: #999999;
			text-align: center;
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
	.noMore {
		font-size: 26rpx;
		color: #b3b3b3;
		margin-top: 25rpx;
		width: 100%;
		text-align: center;
		height: 5vh;
		line-height: 5vh;
	}
</style>
