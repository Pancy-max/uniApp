<template>
	<view class="">
		

	<view class="wrapper" :style="{backgroundColor: backColor}" @click="doTest">
		<view class="">
			<view class="title">
				{{title}}
			</view>
			<!-- <view class="subTitle">{{subTitle}}</view> -->
			<!-- <view class="footTitle">预计耗时{{needTime/60}}分钟</view> -->
			<view class="read-count" v-if="readCount">
				测评 <span class="count-number">
				{{readCountText()}}
				</span>人次
			</view>
			<view class="title-time">
				预计耗时{{needTime/60}}分钟
			</view>
		</view>
		<view class="imageWrapper">
			<image 
				src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com%2Fuploads%2Fimage%2F2019%2F11%2F20%2Fb6820f40f5e2e96257f5e5359c65f6b5.png&refer=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662444400&t=ab6410c9d431918de67c3d3a7309414a"
				class="image"
			/>
		</view>
	</view>
</view>
</template>

<script>
	export default {
		props: {
			title: {type: String, required: true},
			subTitle: {type: String, required: true},
			iconUrl: {type: String, required: true},
			needTime: {type: Number, required: true},
			index: {type: Number, default: -1},
			readCount: {type: Number, default: 0},
		},
		data() {
			return {
				colorList: ['#607d8b85', '#4ac3bd73', '#4a86c373', '#86608b6b', '#ffeb3b6b', '#0096888c']
			}
		},
		methods: {
			doTest() {
				this.$emit('doTest')
			},
			readCountText() {
				return this.readCount >= 10000 ? Math.floor(this.readCount / 100) / 100 + '万' : 
				(this.readCount >= 1000 ? Math.floor(this.readCount / 10) / 100 + '千' : this.readCount)
			}
		},
		computed: {
			backColor() {
				const length = this.colorList.length;
				if(this.index !== -1) return this.colorList[this.index % length];
				const randomIndex = Math.floor(Math.random() * length);
				return this.colorList[randomIndex];
			}
		}
	}
</script>

<style scoped lang="scss">
	.title {
		font-size: 32rpx;
		text-align: center;
		margin-top: 15rpx;
	}
	.title-time {
		color:#333;
		font-size: 28rpx;
		position: absolute;
		bottom: 20rpx;
	}
.wrapper {
	display: flex;
	justify-content: space-between;
	width: 80%;
	margin: auto;
	overflow: hidden;
	height: 170rpx;
	border-radius: 20rpx;
	padding: 20rpx 40rpx;
	position: relative;
	// box-shadow: 2rpx 2rpx 0 2rpx rgba(0, 0, 0, 0.2);
	.read-count {
		font-size: 28rpx;
		// margin-left: 10rpx;
		position: absolute;
		right: 0;
		bottom: 0rpx;
		padding: 15rpx;
		color: #fff;
		width: 300rpx;
		text-align: right;
		background-image: linear-gradient(to left, #666, transparent);
		.count-number {
			color: #143d72;
			display: inline-block;
			font-weight: bold;
			margin: 0 10rpx;
		}
	}
	.subTitle {
		font-size: 28rpx;
		overflow: hidden;
		width: 54vw;
		margin-top: 10rpx;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.footTitle {
		font-size: 22rpx;
		margin-top: 40rpx;
	}
	.imageWrapper {
		display: flex;
		align-items: top;
		.image {
			width: 150rpx;
			height: 100rpx;
		}
	}
}
</style>
