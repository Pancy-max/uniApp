<template>
	<view class="uni-popup-share">
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="uni-share-content-item" v-for="(item,index) in bottomData" :key="index" @click.stop="select(item,index)">
					<template v-if="item.name === 'wx'">
						<button open-type="share" class="share-btn">
							<image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
						</button>
						<text class="uni-share-text">{{item.text}}</text>
					</template>
					<template v-else>
						<image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
						<text class="uni-share-text">{{item.text}}</text>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '分享到'
			}
		},
		inject: ['popup'],
		data() {
			return {
				bottomData: [
					{
						text: '微信好友',
						icon: '../../static/common/wechatfriend.png',
						name: 'wx'
					},
					{
						text: '画报分享',
						icon: '../../static/common/share.jpeg',
						name: 'paint'
					}
				]
			}
		},
		created() {},
		methods: {
			/**
			 * 选择内容
			 */
			select(item, index) {
				this.$emit('select', {
					item,
					index
				}, () => {
					this.popup.close()
				})
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup-share {
		background-color: #fff;
	}
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 10px;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 100%;
		justify-content: space-around;
		padding: 10px 0;
	}
	
	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}
	
	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}
	
	.uni-share-image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	
	.uni-share-text {
		margin-top: 10px;
		font-size: 14px;
		color: #3B4144;
	}
	
	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 10px 15px;
	}
	
	.uni-share-button {
		flex: 1;
		border-radius: 50px;
		color: #666;
		font-size: 16px;
	}
	
	.uni-share-button::after {
		border-radius: 50px;
	}
	.share-btn {
		background: #fff;
		padding: 0;
		margin: 0;
		height: 40px;
		border-radius: 50%;
	}
</style>
