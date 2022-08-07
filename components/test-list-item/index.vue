<template>
	<view class="wrapper" :style="{backgroundColor: backColor}" @click="doTest">
		<view>
			<view class="title">{{title}}</view>
			<view class="subTitle">{{subTitle}}</view>
			<view class="footTitle">预计耗时{{needTime/60}}分钟</view>
		</view>
		<view class="imageWrapper">
			<image 
				src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com%2Fuploads%2Fimage%2F2019%2F11%2F20%2Fb6820f40f5e2e96257f5e5359c65f6b5.png&refer=http%3A%2F%2Fsaas1.oss-cn-beijing.aliyuncs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662444400&t=ab6410c9d431918de67c3d3a7309414a"
				class="image"
			/>
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
			index: {type: Number, default: -1}
		},
		data() {
			return {
				colorList: ['#607d8b85', '#4ac3bd73', '#4a86c373', '#86608b6b', '#ffeb3b6b', '#0096888c']
			}
		},
		methods: {
			doTest() {
				this.$emit('doTest')
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
.wrapper {
	display: flex;
	justify-content: space-between;
	width: 80%;
	margin: auto;
	height: 200rpx;
	border-radius: 20rpx;
	padding: 20rpx 40rpx;
	
	.title {
		font-size: 36rpx;
	}
	
	.subTitle {
		font-size: 20rpx;
	}
	.footTitle {
		font-size: 20rpx;
		margin-top: 80rpx;
	}
	.imageWrapper {
		margin-top: 50rpx;
		.image {
			width: 150rpx;
			height: 100rpx;
		}
	}
}
</style>
