<template>
	<div class="wrapper">
		<uqrcode ref="qrcode" canvas-id="qrcode" :value="value" :options="options"/>
		<view class="text-wrapper">
			<view class="text">请保存二维码，在微信识别添加客服</view>
			<view class="text">客服人员将为你提供帮助</view>
			<view class="text">客服在线时间 10:00 - 18:00</view>
		</view>
		<button @click="save" class="button">保存二维码到相册</button>
		
	</div>
</template>
<script>
  export default {
    data() {
      return {
        value: 'https://doc.uqrcode.cn',
        size: 300,
		options: {
		}
      }
    },
	methods: {
		save() {
			this.$refs.qrcode.save({
			  success: () => {
			    uni.showToast({
			      icon: 'success',
			      title: '保存成功'
			    });
			  }
			});
		}
	},
  }
</script>

<style scoped>
	.wrapper {
		padding: 50rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.text-wrapper {
		margin-top: 100rpx;
	}
	.text {
		margin-top: 10rpx;
	}
	.button {
		background-color: yellow;
		margin-top: 100rpx;
		width: 80%;
	}
</style>