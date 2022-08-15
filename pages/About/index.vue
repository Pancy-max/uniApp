<template>
	<view class="wrapper">
		<view class="lo_icon">
			<view class="lo_image">
				<image src="../../static/common/logo.png" mode=""></image>
			</view>
		</view>
		<view class="block-view">
			<view class="my_tabs" @tap="getContent('userAggrement')">
				<view class="tabs_right">
					<text>用户协议</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
			<view class="fengexian"></view>

			<view class="my_tabs" @tap="getContent('privacyAggrement')">
				<view class="tabs_right">
					<text>隐私协议</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
			<view class="fengexian"></view>
			<view class="my_tabs" @tap="getContent('childrenAggrement')">
				<view class="tabs_right">
					<text>儿童个人信息保护规则</text>
					<image src="../../static/my/btn_01.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// aboutUsInfo: {
					
				// }
			}
		},
		onLoad() {
			this.getAboutUs()
		},
		methods: {
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
			getContent(key) {
				uni.navigateTo({
					url: './text?id=' + key
				})
			}
		},

	}
</script>
<style lang="less" scoped>
	.wrapper {
		padding: 30rpx;
		background-color: #f1f1f1;
		height: 100vh;
	}
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
				width: 200rpx;
				height: 200rpx;
			}
		}
		.lo_text{
			image{
				 width: 196rpx;
				height: 54rpx;
			}
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

	.fengexian {
		border-bottom: 1rpx solid #e6e6e6;
		width: 88%;
		margin: 0 auto;
		height: 1rpx;
	}
</style>
