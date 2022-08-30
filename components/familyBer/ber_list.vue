<template>
	<view class="pop-child">
		<scroll-view scroll-y="true">
			<view class="child-box mer_list" 
				:class="selectChildIndex === i ? 'select-child' : ''"
				v-for="(item, index) in berList" 
				:key='item.id' 
				@click="selectChild(index)" >
				<!-- <image src="../../static/images/familyBer/ico_01.png" mode="scaleToFill" style="width: 78rpx; height: 78rpx; margin-right: 32rpx;" /> -->
				<view class="mer_content">
					<view class="ber_text">
						<view class="ber_name">{{ item.nickname }}</view>
						<view class="ber_num">出生日期: {{ item.birthday }}</view>
					</view>
					<view class="ber_check" @tap="check(index)">
						<view>查看</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	
</template>

<script>
	export default {
		props:{
			berList: {
				type: Array
			}
		},
		data() {
			return {
				selectChildIndex: null
			}
		},
		methods:{
			check(index) {
				this.$emit('check', this.berList[index].userUuid)
			},
			selectChild(idx) {
				const childAge = getApp().globalData.testItem.childAge
				this.selectChildIndex = null
				console.log('selectChild', this.berList, idx, childAge)
				if (this.berList[idx].birthday > childAge) {
					uni.showToast({
						title: '儿童出生日期必须大于' + childAge + ',请重新选择！',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.selectChildIndex = idx
				// this.$refs.childPopup.close()
				getApp().globalData.childId = this.berList[idx].ID
				// this.goTest()
				this.$emit('select', this.berList[idx].ID)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mer_list {
		display: flex;
		width: 690rpx;
		height: 164rpx;
		margin: 0 auto;
		align-items: center;
		border: 1px solid #ccc;
		border-radius: 30rpx;
		margin-top: 40rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		.mer_content {
			width: 80%;
			display: flex;
			justify-content: space-between;
			margin-left: 10%;
			.ber_text{
				.ber_name {
					font-size: 34rpx;
					color: #262626;
				}
				.ber_num {
					font-size: 24rpx;
					color: #808080;
					margin-top: 11rpx;
				}
			}
			.ber_check {
				display: flex;
				font-size: 26rpx;
				color: #60C49A;
				align-items: center;
			}
			.pop-child {
				background: #fff;
				border: #fff;
				border-radius: 40rpx;
				margin: 40rpx;
				padding: 40rpx;
				.title-tip {
					padding: 10rpx 0;
					font-size: 32rpx;
					line-height: 40rpx;
					text-align: left;
				}
				.nav-addchild {
					width: 300rpx;
					margin-top: 20rpx;
					background: #55557f;
					color: #fff;
				}
				.nav_text {
					font-size: 32rpx;
					color: #262626;
					margin-top: 10rpx;
					text-align: center;
					width: 100%;
				}
			}
		}
		.select-child {
			border: 5rpx solid #55557f;
		}
	}
</style>
