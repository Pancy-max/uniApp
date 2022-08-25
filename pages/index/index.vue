<template>
	<view>
		<view class="image_content">
			<swiper :autoplay="true" :interval="5000" :duration="1000" :circular='true' indicator-dots="true" indicator-color="#999999"
			 indicator-active-color="#e4e4e4" duration="1000" class="swiperBox">
				<swiper-item v-for="(item, index) in bannerList" :key='index' @click="openLink(index)">
					<view class="swiper-item">
						<image style="width: 100%; height: 370rpx;" :src="item.image" lazy-load mode="scaleToFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="ten"></view>
		<scroll-view scroll-y="true" style="height: 100%;" >
		
			<view v-for="(item, index) in evaListInfo" :key="index">
				<view class="my_tabs">
					<view class="tabs_left">
						<text class="eva-title">{{item.title}}</text>
					</view>
				</view>
				<template v-if="item.eva_form_list && item.eva_form_list.length > 0">
					<view class="testItem" v-for="(_item, _index) in item.eva_form_list" :key="_index">
					<test-list-item
					@doTest='doTest(_item)'
					:index="(index + 1) * (_index + 1)"
					:title="_item.title"
					:readCount="_item.readCount"
					:subTitle="_item.subtitle" 
					:needTime="_item.estimateTime"
					:icon="_item.picUrl"
					></test-list-item>
					</view>
				</template>
				<template v-else>
					<div class="text-center">暂无数据</div>
				</template>
			</view>
		</scroll-view>
		<uni-popup ref="childPopup" type="bottom"  background-color="#fff">
			<view class="pop-child">
				<view class="title-tip">请选择儿童</view>
				<view v-if="berList.length > 0">
					<view class="my_tabs child-box" @click="selectChild(i)" v-for="(item, i) in berList" :key="i">
						<view class="tabs_left">
							<my-icon type="person" size="26" />
						</view>
						<view class="tabs_right">
							<text class="nick-name">{{item.nickname}}</text>
							<text>生日：{{item.birthday}}</text>
						</view>
					</view>
				</view>
				<view>
					<button class="nav-addchild" @tap="goChild">
						前往添加儿童
					</button>
				</view>
			</view>			
		</uni-popup>
		<!-- 弹出层 -->
		<view class="" v-if="vers">
			<view class="popup"></view>
			<view class="popup-info">
				<view class="top">发现新版本</view>
				<view class="content">
					<view class="con-top">更新内容</view>
					<view class="con-center">
						<rich-text :nodes="content"></rich-text>
					</view>
				</view>
				<view class="button">
					<view class="cancel" @click="cancel">取消</view>
					<view class="update" @click="update">更新</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TestListItem from '../../components/test-list-item/index.vue'
	export default {
		components: {
			TestListItem
		},
		data() {
			return {
				// listTest: [1,2,3,4,5,6,7,7],
				vers: false,
				oldversion: '',
				content: '',
				berList: [],
				isupdate: true,
				bannerList: [], //banner图片
				evaListInfo: [], //测评列表
				page: 1,
				limit: 5,
				// IndexClassList: [],
				status: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多'
				},
				isEnd: false, //isEnd用于判断是否还有数据，没有数组停止数组请求
				triggered: false,
				_freshing: false,
				listData: '',
				scrollTop: 0,
			}
		},
		onShow() {
			// this.IndexClass();
			this.getList();
		},
		 onPageScroll(e) {
			this.scrollTop = e.scrollTop
			// console.log(this.scrollTop)
			if(this.scrollTop >= 200){
				// #ifdef APP-PLUS
				void plus.navigator.setStatusBarStyle("dark"); 
				 // #endif
			}else {
				// #ifdef APP-PLUS
				void plus.navigator.setStatusBarStyle("light"); 
				 // #endif
			}
		},
		onLoad() {
			this.getbannerList();
			this.getList();
			// this.IndexClas·s();
			this._freshing = false;
			// this.gitlist();
			// this.check_update();
		},
		onReachBottom() { //上拉触底函数
			this.status = 'more'; //设置sataus是更多
			this.getList(); //加载的数据
		},
		onPullDownRefresh() {
			this.getbannerList();
			this.getList()
			// this.IndexClass();
			this._freshing = false;
			console.log('refreshList')
			// this.gitlist();
			// this.check_update();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			getbannerList(){
				//轮播图
				this.request({
					url: '/mini/getBannerInfo',
					method: 'get'
				}).then((res) => {
					if(res.data!='' && res.data.bannerInfo){
						this.bannerList = res.data.bannerInfo.map(item => {
							item.image = item.picUrl
							item.id = item.ID
							return item
						})
					}else{
						this.bannerList = [{
								"id": 1,
								"cid": 1,
								"name": "banner1",
								// "image": "../../static/images/index/banner1.png",
						},{
								"id": 2,
								"cid": 1,
								"name": "banner1",
								// "image": "../../static/images/index/banner2.png",
						}]
					}	
				});
			},
			gologin() {
				if(uni.getSystemInfoSync().platform == 'ios'){
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						confirmText: '去登录',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/index'
								})
							} else if (res.cancel) {
								uni.switchTab({
									url: '../index/index'
								})
							}
						}
					})
				}else{
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						cancelText: '去登录',
						confirmText:'取消',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '../index/index'
								})
							} else if (res.cancel) {
								uni.navigateTo({
									url: '../login/index'
								})
							}
						}
					})
				}
				
				
			},
			check_update() {
				// #ifdef APP-PLUS
				let platform = ''
				let that = this;
				uni.getSystemInfo({
					success: (data) => {
						platform = (data.platform === 'ios') ? 2 : 1
					}
				})
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					uni.request({
						url: that.$websiteUrl + '/v1/version_managers',
						method: 'GET',
						data: {
							version: widgetInfo.version,
							os_type: platform,
							appid: plus.runtime.appid
						}
					}).then(([err, res]) => {
						if (res.data.data != '') {
							that.phoneData = res.data.data
							that.content = that.phoneData.content.replace("\r\n", "<br/>");
							if (that.phoneData.oldversion < that.phoneData.newversion) {
								that.vers = true
							} else {
								that.vers = false
							}
						}
					})
				});
				// #endif
			},
			cancel() {
				this.vers = false
			},
			update() {
				// #ifdef APP-PLUS
				let platform = ''
				let that = this;
				uni.getSystemInfo({
					success: (data) => {
						platform = (data.platform === 'ios') ? 2 : 1
					}
				})
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					uni.request({
						url: that.$websiteUrl + '/v1/version_managers',
						method: 'GET',
						data: {
							version: widgetInfo.version,
							os_type: platform,
							appid: plus.runtime.appid
						}
					}).then(([err, res]) => {
						let phoneData = res.data.data
						if (phoneData.oldversion < phoneData.newversion && phoneData.downloadurl && phoneData.update_type === 1) {
							let downloadTask = uni.downloadFile({
								url: phoneData.downloadurl,
								success: (downloadurl) => {
									if (downloadurl.statusCode === 200) {
										plus.runtime.install(downloadurl.tempFilePath, {
											force: false
										}, function() {
											uni.showToast({
												title: '资源更新完成',
												icon:"none"
											})
											plus.runtime.restart();
										}, function(e) {});

									}
								}
							})
						} else if (phoneData.oldversion < phoneData.newversion && phoneData.downloadurl && phoneData.update_type ===
							2) {
							plus.runtime.openURL(phoneData.downloadurl);
						}
					})
				});
				// #endif
			},
			// gitNotiuce() {
			// 	let userInfo = uni.getStorageSync('myinfo');
			// 	if (!userInfo) {
			// 	this.gologin();
			// 	} else {
			// 		uni.navigateTo({
			// 			url: '../myMessage/index'
			// 		})
			// 	}
			// },
			// banner链接
			openLink(i){
				const item = this.bannerList[i]
				// const target = item.target
				// 标(1:普通url跳转,2:小程序跳转,3:唤醒其他小程序,4:唤醒app,5:客服消息)',
				switch (item.target){
					case 1:
						let p = encodeURIComponent(item.navigation)
						uni.navigateTo({
						    url: `/pages/webview/index?path=${p}`
						})
						break;
					case 2:
						uni.navigateTo({
						    url: item.navigation
						})
						break
					case 3:
						 wx.navigateToMiniProgram({
						    appId: item.appId,
						    path: item.navigation,
						    // extraData: {
						    //   foo: 'bar'
						    // },
						    success(res) {
							  console.log('打开成功')
						      console.info(res);
						    }
						  });
						break
					case 5:
						uni.navigateTo({
						    url: `/pages/help/index`
						})
						break
					default:
						break;
				}
			    
			},
			getMore() {
				uni.navigateTo({
					url: "../notice/notice"
				})
			},
			//点击进入详情
			doTest(item) {
				item.evaTopicList.sort((a, b) => {
					return a.sortOrder > b.sortOrder ? -1 : (a.sortOrder === b.sortOrder ? 0 : 1)
				})
				getApp().globalData.testItem = item;
				if (item.type === 1) { // 儿童
					this.$refs.childPopup.open()
					this.getBerList()
				} else {
					getApp().globalData.childId = null
					uni.navigateTo({
						url: '../doTest/index'
					})
				}
			},
			getBerList(){
				this.request({
					url: '/mini/getChildInfo',
					method: 'GET'
				}).then((res)=>{
					this.berList = res.data.userInfo
				})
			},
			selectChild(idx) {
				const childAge = getApp().globalData.testItem.childAge
				if (this.berList[idx].birthday > childAge) {
					uni.showToast({
						title: '儿童出生日期必须大于' + childAge + ',请重新选择！',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.$refs.childPopup.close()
				getApp().globalData.childId = this.berList[idx].ID
				uni.navigateTo({
					url: '../doTest/index'
				})
			},
			goChild() {
				uni.navigateTo({
					url: '../addBer/addBer'
				})
			},
			//获取列表
			getList() {
				// if (this.isEnd) {
				// 	return
				// }
				this.request({
					url: '/mini/getEvaListInfo',
					method: 'POST',
					data: {
						// page: this.page,
						// limit: this.limit
					}
				}).then((res) => {
					const evaListInfo = res.data && res.data.evaListInfo
					evaListInfo.sort((a, b) => {
						return a.sortOrder > b.sortOrder ? 1 : -1
					})
					this.evaListInfo = evaListInfo
					// if (res.data.data.length <= 0) {
					// 	this.isEnd = true;
					// 	this.status = 'noMore'
					// } else {
						//this.page++
					// }
				});
			},
			//首页分类
			// IndexClass() {
			// 	this.request({
			// 		url: '/v1/classifies?sort=weigh&order=desc',
			// 		method: 'GET'
			// 	}).then((res) => {
			// 		if (res.code != 200) {
			// 			uni.showToast({
			// 				title: res.desc,
			// 				icon: 'none',
			// 				duration: 2000
			// 			})
			// 		}
			// 		this.IndexClassList = res.data
			// 	})
			// },
			refreshData() {
				if (this._freshing) return;
				this._freshing = true;
				this.triggered = true;
				this.getList();
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 2000)
			},
			refreshDataEnd() {
				this.triggered = false;
				this._freshing = false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.pop-child {
		background: #fff;
		width: 100%;
		padding-bottom: 50rpx;
		.title-tip {
			padding: 30rpx 0;
			font-size: 36rpx;
			line-height: 60rpx;
			text-align: center;
		}
	}
	.image_content {
		width: 100%;
		height: 370rpx;
		.swiperBox {
			width: 100%;
			height: 100%;
			z-index: 99;
		}
	}
	.text-center {
		text-align: center;
	}
	/deep/ uni-swiper .uni-swiper-dots-horizontal {
		bottom: 50rpx;
	}

	/deep/ .uni-swiper-dot {
		opacity: 0.8;
		width: 12rpx;
		height: 12rpx;
	}

	/deep/ .uni-swiper-dot-active {
		width: 48rpx;
		height: 12rpx;
		border-radius: 6rpx;
	}

	.nav_content {
		display: flex;
		width: 750rpx;
		align-items: center;
		// position: absolute;
		flex-wrap: wrap;
		// background-color: #FFFFFF;
		// justify-content: space-around;
		// padding: 30rpx 0 0 30rpx;
		// padding: 30rpx 30rpx 0 30rpx;
		padding-top: 30rpx;
		align-content: flex-start;
		flex-flow: row wrap;
	}

	.nav_box {
		// padding-right: 70rpx;
		// padding-bottom: 10rpx;
		 flex: 0 0 25%;
		 margin-bottom: 10px;
	}
	.nav_img {
		margin: 0 auto;
		width: 88rpx;
		height: 88rpx;
	}
	.nav-addchild {
		width: 400rpx;
		margin-top: 20rpx;
	}
	.nav_text {
		font-size: 32rpx;
		color: #262626;
		margin-top: 10rpx;
		text-align: center;
		width: 100%;
	}


	.newNotice {
		width: 93%;
		margin: 0 auto;
		height: 80rpx;
		background-color: #f5faf8;
		border-radius: 8rpx;
		// margin-top: 220rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// position: relative;

		.newNoticeLeft {
			margin-left: 20rpx;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.newIcon {
				width: 48rpx;
				height: 48rpx;
			}

			.NewTitle {
				color: #323232;
				margin-left: 14rpx;
				margin-right: 20rpx;
				font-size: 26rpx;
			}

			.NewMsg {
				color: #808080;
				font-size: 26rpx;
				margin-left: 20rpx;
			}
			.New_block {
				width: 1rpx;
				height: 26rpx;
				background-color: #808080;
				border-radius: 1rpx;
			}
		}

		.newNoticeRight {
			width: 36rpx;
			height: 36rpx;
			margin-right: 12rpx;
			// background-color: #007AFF;
		}

		.dian {
			color: red;
			position: absolute;
			right: 60rpx;
			top: 14rpx;
			z-index: 999;
		}
	}

	.news_content {
		width: 93%;
		margin: 0 auto;
		// border-top: 1px solid #e6e6e6;
		margin-top: 46rpx;
		display: flex;
		justify-content: space-between;

		// padding-top: 34rpx;
		.title_left {
			display: flex;
			align-items: center;

			.color_block {
				width: 8rpx;
				height: 30rpx;
				background-color: $color2;
				border-radius: 4rpx;
				margin-right: 16rpx;
			}

			.text {
				font-size: 32rpx;
				color: #272727;
			}
		}

		.title_right {
			display: flex;
			justify-content: center;
			align-items: center;

			.right_text {
				color: #b3b3b3;
				font-size: 24rpx;
				margin-right: 7rpx;
			}
		}
	}

	.news_list {
		width: 93%;
		margin: 0 auto;
		margin-top: 34rpx;
	}
	
	.testItem {
		margin-bottom: 30rpx;
	}
	.list_box {
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;

		.box_detail {
			margin-left: 24rpx;

			.title {
				width: 472rpx;
				height: 80rpx;
				font-size: 30rpx;
				color: #323232;
				line-height: 40rpx;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.detail {
				display: flex;
				margin-top: 30rpx;
				align-items: center;

				.detail_text {
					font-size: 24rpx;
					color: #b3b3b3;
					margin-left: 8rpx;
				}
			}
		}
	}

	.popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9998;
	}

	.popup-info {
		position: fixed;
		width: 600rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 12rpx;
		background-color: #FFFFFF;
		z-index: 9999;
		padding: 0 48rpx;
		padding-top: 60rpx;
	}

	.top {
		color: #262626;
		font-size: 32rpx;
	}

	.content {
		margin-top: 40rpx;
		width: 560rpx;
		color: #808080;
		font-size: 30rpx;
		line-height: 46rpx;

		.con-center {
			display: inline-block;
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.button {
		display: flex;
		justify-content: space-between;
		margin-top: 88rpx;
		padding-bottom: 44rpx;

		.cancel {
			color: #262626;
			font-size: 32rpx;
		}

		.update {
			font-size: 32rpx;
			color: #28b07c;
		}
	}
	.ten {
		width: 100%;
		position: absolute;
		background-color: #FFFFFF;
		height: 20rpx;
		border-radius: 20rpx 20rpx 0 0;
		margin-top: -10rpx;
	}
	.my_tabs.child-box {
		border: 1px solid #ccc;
		border-radius: 30rpx;
		margin-top: 40rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		box-shadow: 1rpx 1rpx 0 2rpx rgba(0, 0, 0, 0.15);
	}
	.my_tabs {
		display: flex;
		margin: 0 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		
		.tabs_left {
			margin: 34rpx 0;
			margin-left: 40rpx;
			margin-right: 36rpx;
			color: #333;
	
			image {
				width: 48rpx;
				height: 48rpx;
				margin-top: 8rpx;
			}
			.eva-title {
				border-left: 8rpx solid #ffff00;
				padding-left: 20rpx;
			}
		}
	
		.tabs_right {
			flex: 1;
			display: flex;
			justify-content: start;
			flex-direction: column;
	
			text {
				margin: 10rpx 0;
				font-size: 32rpx;
				color: #262626;
				.nick-name {
					color: #000;
					font-weight: bold;
					font-size: 38rpx;
				}
			}
	
			image {
				margin-right: 38rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>
