<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
	<view class="YmContent">
			<view class="all_orders_1">
				<text decode="true" class="all_orders_2">全部订单</text>
				<view class="orders">
					<view v-for="(item_orders, index) in list_orders" :key="index" class="item order-item">
						<view class="all_orders_5">
							<view class="all_orders_7">
								<image src="/static/all_orders/images/all_orders_8_8.jpg" mode="scaleToFill" border="0"    class="all_orders_8"></image>
								<text decode="true" class="address_from">{{item_orders.description}}</text>
							</view>
							<view class="all_orders_11">
								<image src="/static/all_orders/images/all_orders_12_12.jpg" mode="scaleToFill" border="0"    class="all_orders_12"></image>
								<text decode="true" class="address_to">{{item_orders.SuccessTime}}</text>
							</view>
							<view class="all_orders_14">
								<text decode="true" class="all_orders_15">订单号</text>
								<text decode="true" class="orderNo">{{item_orders.out_trade_no}}</text>
							</view>
						</view>
						<view class="all_orders_6">
							{{item_orders.tradeState === 'SUCCESS'? '交易成功' : '交易失败'}}
						</view>
					</view>
				</view>
			</view>
		

		<view class="loading">{{loadingText}}</view>
		<view class="ymBbottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadingText: '',
				list_orders: [],
				page:0,//当前分页页码
			}
		},
		components:{

		},
		onLoad(options) {

			this.page=0;

			this.refresh("init");

		},
		onShow() {
			console.log("on show");
			this.refresh();

		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.refresh();
		},
		methods: {
			
			//刷新数据
			refresh:function(_action) {
				console.log('allOrder');
				uni.showLoading();
				
				//提交到服务器
				var that = this
				this.request({
					url: '/wxpay/getOrderList',
					// data: {},
					method: 'GET'
				}).then(res => {

					// 隐藏导航栏加载框  
					uni.hideNavigationBarLoading();
					// 停止下拉动作  
					uni.stopPullDownRefresh();  

					// 隐藏加载框  
					uni.hideLoading();  

					var tmp = res.data;
					console.log(res)
					//初始化，对页面上的控件进行赋值操作
					if(_action=="init"){

					}

					//如果后端有返回消息，则弹出消息提示
					if (tmp.message != null && tmp.message != "") {
						uni.showToast({
						title: tmp.message,
						icon: 'none',
						duration: 2000
						})
					}



					//如果后端有返回页码，则更改当前页码
					if(tmp.page!=null && tmp.page!=""){
						page=tmp.page;
					}	
					that.list_orders = tmp

				})
			},
		}
	}

</script>

<style lang="scss" scoped>
   @import './all_order.scss'
</style>