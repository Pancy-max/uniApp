<template>
	<div class="wrapper">
		<view class="text-wrapper">
			<view class="text" v-html="text"></view>
		</view>		
	</div>
</template>
<script>
  export default {
    data() {
      return {
        text: ''
      }
    },
	onLoad(e) {
		if (e.id) {
			let title = ''
			switch(e.id) {
				case 'userAggrement':
					title = '用户协议'
					break
				case 'privacyAggrement':
					title = '隐私协议'
					break
				case 'childrenAggrement':
					title = '儿童个人信息保护规则'
					break
				default:
					title = '协议'
					break
			}
			this.text = getApp().globalData.aboutUsInfo[e.id] || title
			uni.setNavigationBarTitle({
			  title: title
			})
		}
	},
	methods: {
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