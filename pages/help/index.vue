<template>
	<div class="wrapper">
		<!-- <uqrcode ref="qrcode" canvas-id="qrcode" :value="value" :options="options"/> -->
		<image :src="value" mode="aspectFit"></image>
		<view class="text-wrapper">
			<view class="text">
				{{text}}
			</view>
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
		text: '',
		options: {
		}
      }
    },
	onLoad() {
		this.getCustomerCenter()
	},
	methods: {
		getCustomerCenter() {
			this.request({
				url: '/mini/getCustomerCenter',
				method: 'GET'
			}).then(res => {
				const customCenter = res.data.customCenter
				if (customCenter) {
					this.value = customCenter.qrcodeUrl || 'https://doc.uqrcode.cn'
					this.text = customCenter.content || '请保存二维码，在微信识别添加客服'
				}
			}).catch(e => {
				console.error(e)
				// this.aboutUsInfo = {};
			})
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
		background-color: #55557f;
		color: #fff;
		margin-top: 100rpx;
		width: 80%;
	}
</style>