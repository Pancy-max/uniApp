<template>
	<view>
		<view class="head">
			<view class="head_box">
				<view class="head_right" @tap='addBer'>
					<view class="ber_new">添加儿童</view>
				</view>
			</view>
		</view>
		<BerList :berList='berList' @check='check' />
		<view class="noMore">没有更多了</view>
	</view>
</template>

<script>
	import BerList from '../../components/familyBer/ber_list.vue'
	export default {
		components:{
			BerList
		},
		data() {
			return {
				berList: [], //家庭成员列表
			}
		},
		onLoad() {
			this.getBerList();
		},
		onShow() {
			this.getBerList();
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0) {
				uni.navigateTo({
					url:'../addBer/addBer'
				})
			}
		},
		methods: {
			check(id){
				console.log('berDetail/berDetail?id=', id)
				uni.navigateTo({
					url:'../berDetail/berDetail?id='+id
				})
			},
			addBer(){
				uni.navigateTo({
					url:'../addBer/addBer'
				})
			},
			//家庭成员列表
			getBerList(){
				this.request({
					url: '/mini/getChildInfo',
					method: 'GET'
				}).then((res)=>{
					this.berList = res.data.userInfo
					getApp().globalData.childList = this.berList
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		border-bottom: 1px solid #e6e6e6;
		.head_box {
			width: 690rpx;
			height: 68rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.head_left {
				display: flex;
				align-items: center;
				.ber_num {
					font-size: 28rpx;
					color: #808080;
				}
			}
			.head_right {
				display: flex;
				align-items: center;
				.ber_new {
					font-size: 32rpx;
					color: #000;
					font-weight: bold;
				}
			}
		}
	}
	.noMore {
		font-size: 26rpx;
		color: #b3b3b3;
		margin-top: 25rpx;
		width: 100%;
		text-align: center;
	}
</style>
