<template>
	<view class='my'>

		<view class="block-view">
				<view class="my_tabs" @click="getContent">
					<!-- <view class="tabs_left">
						<my-icon type="staff" size="26" />
					</view> -->
					<view class="tabs_right">
						<text>问题1</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view>

				<view class="fengexian"></view>

				<!-- <view class="my_tabs" @click="myTest">
					<view class="tabs_left">
						<image src="../../static/common/btn_08.png" mode=""></image>
					</view>
					<view class="tabs_right">
						<text>我的测评</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view>

				<view class="fengexian"></view> -->


				<!-- <view class="my_tabs" @click="share">
					<view class="tabs_left">
						<my-icon type="redo" size="26" />
					</view>
					<view class="tabs_right">
						<text>分享给朋友</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view>
				<view class="fengexian"></view>

				<view class="my_tabs" @click="help">
					<view class="tabs_left">
						<my-icon type="chatboxes" size="26" />
					</view>
					<view class="tabs_right">
						<text>联系客服</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view> -->
				<!-- <view class="fengexian"></view>

				<view class="my_tabs" @click="about">
					<view class="tabs_left">
						<my-icon type="info" size="26" />
					</view>
					<view class="tabs_right">
						<text>关于我们</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view>
				<view class="fengexian"></view> -->
			</view>

	</view>

</template>

<script>
	export default {
		components: {
		},
		props: {},
		data() {
			return {
				
			};
		},
		onLoad() {
			this.getAboutUs()
		},
		methods: {
			getAboutUs() {
				this.request({
					url: '/mini/getHelpCenter',
					method: 'GET'
				}).then(res => {
					// this.aboutUsInfo = res.data.aboutUs
					// getApp().globalData.aboutUsInfo = res.data.aboutUs 
				}).catch(e => {
					console.error(e)
					// this.aboutUsInfo = {};
				})
			},
			getContent(key) {
				uni.navigateTo({
					url: './text?id=' + key
				})
			}
		},
	};
</script>

<style lang="less" scoped>
	.my {
		// padding: 30rpx;
		height: calc(100vh);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.block-view {
			background: #fff;
			// border-radius: 40rpx;
			// margin-bottom: 30rpx;
			padding: 20rpx;
			flex: 1;
			overflow: auto;
		}
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

	.fengexian {
		border-bottom: 1rpx solid #e6e6e6;
		width: 88%;
		margin: 0 auto;
		height: 1rpx;
	}
</style>
