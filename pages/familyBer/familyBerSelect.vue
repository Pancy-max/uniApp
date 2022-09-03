<template>
	<view>
		<view class="head">
			<view class="head_box">
				<view class="title-tip">本测量表适用于出生日期早于{{childAge}}出生的儿童，请选择适龄儿童</view>
			</view>
			<view class="head_right" @tap='addBer'>
				<view class="ber_new">添加儿童</view>
			</view>
		</view>
		<BerList :berList='berList' @select='select' :showDetail="false" :mcode="mcode"/>
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
				childAge: '',
				childNum: 3,
				mcode: ''
			}
		},
		onLoad() {
			this.getBerList();
			const item = getApp().globalData.testItem
			this.childAge = item.childAge
			this.childNum = item.childNum
			this.mcode = item.code
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
			select(id){
				// console.log('berDetail/berDetail?id=', id)
				// uni.navigateTo({
				// 	url:'../berDetail/berDetail?id='+id
				// })
				uni.navigateBack({
					delta: 1
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
			},
			addBer(){
				uni.navigateTo({
					url:'../addBer/addBer'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		// border-bottom: 1px solid #e6e6e6;
		.head_box {
			width: 690rpx;
			height: 68rpx;
			margin: 60rpx auto;
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
		}
		.head_right {
			display: flex;
			align-items: center;
			margin-left: 20rpx;
			.ber_new {
				// font-size: 32rpx;
				// color: #000;
				// font-weight: bold;
				// width: 50vw;
				// position: fixed;
				// bottom: 20%;
				// left: 25%;
				// height: 104rpx;
				border-radius: 20rpx;
				text-align: center;
				line-height: 75rpx;
				color: #fff;
				font-size: 33rpx;
				background-color: #55557f;
				width: 200rpx;
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
