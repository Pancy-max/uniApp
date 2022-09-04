<template>
	<view class='my'>
		<text class="title">常见问题</text>
		<view class="block-view">
			<block v-for="(item, index) in aboutUsInfo" :key="index">
<!-- 				<view class="title">
					{{item.firstTitle}}-{{item.mainTitle}}
				</view> -->
				<view class="my_tabs" @click="getContent(item)">
					<!-- <view class="tabs_left">
						<my-icon type="staff" size="26" />
					</view> -->
					<view class="tabs_right" >
						<!-- <text>{{item.content}}</text> -->
						<text>{{item.mainTitle}}</text>
						<image src="../../static/my/btn_01.png" mode=""></image>
					</view>
				</view>
				
				<view class="fengexian"></view>
			</block>
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
				aboutUsInfo: []
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
					this.aboutUsInfo = res.data.helpInfo
				}).catch(e => {
					console.error(e)
					this.aboutUsInfo = []
				})
			},
			getContent(item) {
				getApp().globalData.help = item;
				console.log('key', item);
				uni.navigateTo({
					url: './content'
				})
			}
		},
	};
</script>

<style lang="less" scoped>
	.my {
		background-color: #f1f1f1;
		// padding: 30rpx;
		height: calc(100vh);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.block-view {
			background: #fff;
			border-radius: 40rpx;
			// margin-bottom: 30rpx;
			// padding: 0 20rpx 20rpx 20rpx;
			margin: 30rpx 20rpx;
			// flex: 1;
			// overflow: auto;
		}
		.title {
			margin-left: 30rpx;
			font-size: 36rpx;
			font-weight: bold;
			line-height: 60rpx;
			margin-top: 30rpx;
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
