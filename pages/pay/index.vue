<template>
	<div>
		 <qrcode-vue 
		 :value="value"     // 需要生成二维码图片的url地址
		 :size="size"  // 二维码图片大小
		 />
	</div>
</template>

<script>
	import QrcodeVue from 'qrcode.vue'
	
	export default {
		components: {
			QrcodeVue
		},
		props: {
			value: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				required: true
			},
			orderID: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				timer: null;
				isPay: false;
			}
		}
		mounted() {
			this.timer = setInterval(() => {
				this.request({
					url: '/wxpay/getOrderById',
					method: 'Get',
					data: {
						orderID: this.orderID
					}
				}).then((res) => {
					if(res.status === 'SUCCESS') {
						console.log('支付成功');
						//路由跳转
					}
				});
			}, 2000)
		},
		unmounted() {
			this.timer = null;
		}

	}
</script>

<style>
</style>