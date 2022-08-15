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
		 <view class="desc">共{{item.evaTopicList.length}}道题目 | 预计作答{{item.estimateTime/60}}分钟</view>
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
	</view>
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
		// childId: null
	}
  },
  onLoad(option) {
  	// this.childId=option.childId
	this.checkLogin()
  },
  mounted() {
	  this.item = getApp().globalData.testItem
  },
  computed: {},
  methods: {
	  checkLogin() {
	  	let userInfo = uni.getStorageSync('myinfo');
		const that = this
	  	if (!userInfo) {
			uni.showModal({
				title: '提示信息',
				content: '请先登录',
				cancelText: '去登录',
				confirmText: '取消',
				confirmColor: "#262626",
				success(res) {
					if (res.confirm) {
						// that.showEnter = true
					} else if (res.cancel) {
						uni.navigateTo({
							url: '../login/index'
						})
					}
				}
			})
	  	} else {
			this.showEnter = true
		}
	  },
	  goTest(){
		  uni.navigateTo({
		  	url: './test'
		  })
	  },
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		height: calc(100vh - 80rpx);
		background: #9e9e9e14;
		padding: 40rpx;
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
			margin-top: 5vh;
			margin-bottom: 5vh;
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
</style>
