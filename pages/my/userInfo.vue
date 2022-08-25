<template>
  <view class='information'>
	  <view class="inform">
	  	<view class="in_message">
	  		<view class="message">个人信息</view>
			<view class="zhuxiao" @tap="logOut" >退出登录</view>
	  	</view>
		
		<view class="in_info">
					
			<view class="in_item">
			 <view>昵称</view>
			 <view class="item_color">{{userInfo.nickname}}</view>
			</view>
			<view class="in_item">
				<view>ID</view>
				<view class="item_color">{{userInfo.ID}}</view>
			</view>
			<view class="in_item">
				<view>手机号</view>
				<view class="item_color">{{userInfo.mobile}}</view>
			</view>
			<view class="in_item" v-if="userInfo.CreatedAt">
				<view>创建时间</view>
				<view class="item_color">{{userInfo.CreatedAt.slice(0, 10)}} {{ userInfo.CreatedAt.slice(11, 19)}}</view>
			</view>

		</view>
		</block>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog mode="base" message="成功消息" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm" content="确定要退出当前账号吗" title="退出账号" msgColor="msgColor"></uni-popup-dialog>
		</uni-popup>
	  </view>
  </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
	
  props: {},
  components: {
  	uniPopup,
  	uniPopupDialog,
  	// uniIcons
  },
  data() {
    return {
		userInfo: {}
	};
  },
  computed: {},
  onLoad(data) {
	const myinfo = uni.getStorageSync('myinfo');
	this.userInfo = myinfo.user
  },
  methods: {
	  logOut() {
	  	this.$refs.popup2.open()
	  },
	  close() {
	  	this.$refs.popup2.close()
	  },
	  async confirm() {
	  	console.log('点击退出登录')
		const that = this
	  	const callback = function() {
	  		that.userInfo = ''
	  	}
	  	this.$logout(callback);
	  },
  },
};
</script>

<style lang="less">
	.information{
		margin: 0 28rpx;
		.in_message{
			border-bottom: 1rpx solid #e6e6e6;
			padding-top: 12px;
			padding-bottom: 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.message{
				font-size: 40rpx;
				font-weight: 500;
				color: #333333;
			}
			.zhuxiao{
				color: #F0AD4E;
				font-size: 30rpx;
			}
		}
		.in_info{
			.in_item{
				font-size: 36rpx;
				display: flex;
				justify-content: space-between;
				margin-top: 28rpx;
				.item_color{
					color: #808080;
				}
			}
		}
	}
	.inform{
		background-color: #FFFFFF;
		height: 540rpx;
	}
	
</style>
