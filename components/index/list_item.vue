<template>
	<view class="news_list">
		<view class="list_box" v-for="(item, index) in list" :key="index">
			<image style="width: 200rpx; height: 140rpx; border-radius: 6rpx;" :src="item.picUrl" mode="scaleToFill" lazy-load v-if="item.picUrl != ''" />
			<image style="width: 200rpx; height: 140rpx; border-radius: 6rpx; z-index: 999;" src="../../static/common/noImg.png" v-if="item.picUrl == ''" mode="scaleToFill" lazy-load></image>
			<view class="box_detail">
				<view class="title">{{ item.title }}</view>
				<view v-if="item.subtitle" class="desc">{{item.subtitle}}</view>
				<view class="detail">
					<view v-if="item.content" class="detail_source">{{item.content}}</view>
					<button class="test_button" @click="doTest(item.ID)">立即测评</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { timeStamp } from '../../utils/time.js'
	export default {
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		filters:{
			timeStamp
		},
		methods:{
			doTest(id){
				this.$emit('doTest', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news_list {
		width: 95%;
		margin: 0 auto;
		margin-top: 34rpx;
	}
	.list_box {
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		.box_detail {
			margin-left: 36rpx;
			.title {
				width: 472rpx;
				height: 40rpx;
				font-size: 30rpx;
				color: #323232;
				line-height: 40rpx;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient:vertical;
				overflow: hidden;
				word-break:break-all;
				font-weight: bold;
			}
			.desc {
				width: 472rpx;
				height: 60rpx;
				font-size: 30rpx;
				color: #868686;
				line-height: 30rpx;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient:vertical;
				overflow: hidden;
				word-break:break-all;
			}
			.detail {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.detail_text {
					font-size: 24rpx;
				}
			}
			.detail_source{
				margin-top: 15rpx;
				font-size: 22rpx;
				color: #ffaa00;
			}
		}
	}
	.list_box:last-child {
		border-bottom: none;
	}
	.test_button {
		width: 160rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		border: #b2b2b2 1rpx;
		background: #ffaa00;
		color: #fff;
		font-size: 30rpx;
		border-radius: 30rpx;
		margin: 0;
		padding: 0 10rpx;
		float: right;
	}
</style>
