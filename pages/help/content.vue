<template>
	<view class="wrapper">{{content}}</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			content() {
				return getApp().globalData.help.content;
			}
		}
	}
</script>

<style scoped>
	.wrapper {
		padding: 30rpx;
		background-color: #f1f1f1;
		height: 100vh;
	}
</style>