<template>
	<view class="page">
		<view class="poster">
			<!-- <lPainter :board="posterObj" ref="painter" style="display: none;"></lPainter> -->
			<!-- <l-painter ref="painter" width="686rpx"  height="928rpx" /> -->
			<l-painter
			  isRenderImage
			  ref="painter" 
			  width="686rpx"
			  height="928rpx"
			  @success="loadSuccess($event)"
			/>
			<view class="footer-btn">
				<view class="" @tap="goBack">
					返回
				</view>
				<view class="save" @click="saveImage">
					保存
				</view>
			</view>
			<!-- <image :src="path" mode="" class="image-content"></image> -->
			
		</view>
		<view class="poster-btn">
			<view :class="{'is-check':check_idx==index}" v-for="(item,index) in footer_arr" :key="index" @click="toChoose(index)">
				<image :src="item" mode=""></image>
				<view v-if="check_idx==index"></view>
			</view>
		</view>
		<!-- 生成的图片 -->
		<!-- <uni-popup type="center" ref="posterImg" :maskClick="false">
			<view class="poster-img">
				<text @click="closePopup"></text>
				<image :src="path" mode="" @click="previewImg"></image>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
	// import uniPopup from "../../components/uni-popup/uni-popup.vue";
	import lPainter from '../../components/lime-painter/index.vue'
	export default {
		components: {
			lPainter,
			// uniPopup
		},
		data() {
			return {
				show_poster:false,//显示海报
				path: '', //生成的图片地址
				myInfo: {},
				posterInfo: {
					imageDesc: "图片分享demo",
					imageUrl: "https://ifragranto.com/banner/qinziuganxi.jpg",
					linePrice: 19900,
					price: 9900,
					qrcodeDesc: "扫描二维码了解更多",
					qrcodeUrl: "https://ifragranto.com/qrcode/qrcode_for_gh_6289b62b5e41_344.jpg",
					title: "string"
				},
				posterObj: {
					width: '670rpx',
					height: '928rpx',
					background: '#fff',
					borderRadius: '4rpx',
					views: []
				}, //画板数据
				footer_arr: [
					'https://s.yun-live.com/images/20210201/5d2e237728e1dd8727835ca95084721e.png',
					'https://s.yun-live.com/images/20210201/15075d31c26cc446333d569b0d2346e8.png',
					'https://s.yun-live.com/images/20210201/d502979c734077930cee837739ee9285.png',
				], //底部选项
				check_idx: 0, //底部选中的下标
				avatar: ''
			}
		},
		onLoad() {
			// this.getPaintData()
			this.myInfo = uni.getStorageSync('myinfo');
			this.avatar = this.myInfo.user.avatar
			if (getApp().globalData.posterInfo && getApp().globalData.posterInfo.qrcodeUrl) {
				this.posterInfo = getApp().globalData.posterInfo
				this.toChoose(0)
			} else {
				this.getPaintData()
			}
			
		},
		// watch: {
		// 	check_idx(newVal,oldVal){
		// 		this.toChoose(newVal)
		// 	}
		// },
		methods: {
			loadSuccess(path) {
				this.path = path
				uni.hideLoading()
			},
			getPaintData() {
				this.request({
					url: '/mini/getPosterInfo',
					method: 'GET'
				}).then(res => {
					this.posterInfo = res.data.posterInfo
					this.toChoose(0)
				}).catch(e => {
					console.error(e)
					// this.aboutUsInfo = {};
				})
			},
			// previewImg(){
			// 	// #ifdef H5
			// 	return;
			// 	// #endif
			// 	uni.previewImage({
			// 		current:this.path,
			// 		urls: [this.path]
			// 	});
			// },
			// closePopup(){
			// 	this.$refs.posterImg.close();
			// 	this.show_poster=false;
			// },
			// toSave() {
				// uni.showLoading({
				// 	title:'海报生成中',
				// })
				// const painter = this.$refs.painter;
				// painter.canvasToTempFilePath().then(res => {
				// 	this.path = res.tempFilePath;
				// 	this.$refs.posterImg.open();
				// 	this.show_poster=true;
				// 	uni.hideLoading()
				// });
			// },
			onRender() {
				// 支持通过调用render传入参数
				const painter = this.$refs.painter
				painter.render(this.posterObj)
				//开启加载
				uni.showLoading({
				  title: '加载中...',
				  mask: true
				})
			},
			// canvasToTempFilePath() {
			// 	const painter = this.$refs.painter
			// 	// 支持通过调用canvasToTempFilePath方法传入参数 调取生成图片
			// 	painter.canvasToTempFilePath().then(res => this.path = res.tempFilePath)
			// },
			saveImage() {
			    uni.saveImageToPhotosAlbum({
			        filePath: this.path,
			        success(res) {
			            uni.showToast({
			                title: '已保存到相册',
			                icon: 'success',
			                duration: 2000
			            })
			        }
			    })
			},
			goBack() {
				uni.switchTab({
					url:'../my/index'
				})
			},
			toChoose(index) {
				if (index == 5) return;
				this.check_idx = index;
				switch (index) {
					case 0:
						this.posterObj.background='linear-gradient(153deg, #aaaaff 0%, #aaaa7f 100%)';
						this.posterObj.views = [
						// {
						// 	type: 'text',
						// 	text: this.posterInfo.title,
						// 	css: {
						// 		fontSize: '48rpx',
						// 		color: '#fff',
						// 		lineHeight: '48rpx',
						// 		left: '236rpx',
						// 		top: '600rpx'
						// 	}
						// },
						{
							type: 'image',
							src: this.avatar,
							css: {
								left: '56rpx',
								top: '82rpx',
								borderRadius: '50%',
								width: '80rpx',
								height: '80rpx'
							}
						},
						{
							type: 'text',
							text: this.myInfo.user.username,
							css: {
								fontSize: '28rpx',
								fontWeight: 'bold',
								color: '#fff',
								lineHeight: '28rpx',
								left: '160rpx',
								top: '88rpx'
							}
						},
						{
							type: 'text',
							text: '邀请你一起学习',
							css: {
								fontSize: '24rpx',
								color: '#fff',
								lineHeight: '24rpx',
								left: '160rpx',
								top: '140rpx'
							}
						},
						{
							type: 'image',
							src: this.posterInfo.imageUrl,
							css: {
								left: '32rpx',
								top: '244rpx',
								width: '606rpx',
								height: '341rpx',
								borderRadius: '16rpx'
							}
						},
						{
							type: 'view',
							css: {
								fontSize: '28rpx',
								lineHeight: '1.4em',
								background: '#fff',
								top: '700rpx',
								height: '200rpx',
								left: '5%',
								width: '90%',
								borderRadius: '20rpx'
							},
							views: [
								{
									type: 'text',
									text: this.posterInfo.imageDesc,
									css: {
										fontSize: '32rpx',
										color: '#1A2033',
										fontWeight: 'bold',
										lineHeight: '45rpx',
										left: '10%',
										top: '740rpx',
										width: '606rpx'
									}
								},
								{
									// type: 'qrcode',
									type: 'image',
									src: this.posterInfo.qrcodeUrl,
									css: {
										left: '75%',
										top: '730rpx',
										width: '150rpx',
										height: '150rpx'
									}
								},
								{
									type: 'text',
									text: this.posterInfo.qrcodeDesc,
									css: {
										left: '10%',
										top: '793rpx',
										width: '40%',
										// textAlign: 'center',
										fontSize: '24rpx',
										color: '#989FB3',
										lineHeight: '33rpx'
									}
								}
							]
						}
					]
						break;
					case 1:
						this.posterObj.views = [{
								type: 'image',
								src: 'https://s.yun-live.com/images/20210201/524ab6a41fe8c7eb57b35df9a547d388.png',
								css: {
									left: '0',
									top: '0',
									width: '100%',
									height: '100%'
								}
							},
							{
								type: 'image',
								src: 'https://s.yun-live.com/images/20210201/cf86cf793964d1b2ded6dd9a0c5fdd5e.png',
								css: {
									width: '128rpx',
									height: '50rpx',
									left: '542rpx',
									top: '0rpx',
								}
							},
							{
								type: 'image',
								src: this.avatar,
								css: {
									left: '56rpx',
									top: '72rpx',
									borderRadius: '50%',
									width: '80rpx',
									height: '80rpx'
								}
							},
							{
								type: 'text',
								text: this.myInfo.user.username,
								css: {
									fontSize: '28rpx',
									fontWeight: 'bold',
									color: '#1D1D25',
									lineHeight: '28rpx',
									left: '160rpx',
									top: '80rpx'
								}
							},
							{
								type: 'text',
								text: '邀请你一起学习',
								css: {
									fontSize: '24rpx',
									color: '#6CB37A',
									lineHeight: '24rpx',
									left: '160rpx',
									top: '121rpx'
								}
							},
							{
								type: 'image',
								src: this.posterInfo.imageUrl,
								css: {
									left: '50%',
									top: '188rpx',
									transform: 'translate(-50%,0)',
									width: '540rpx',
									height: '303rpx',
									borderRadius: '16rpx',
									border:'3rpx solid rgba(255,255,255,0.5)'
								}
							},
							{
								type: 'view',
								css: {
									fontSize: '28rpx',
									lineHeight: '1.4em',
									background: '#fff',
									top: '550rpx',
									height: '300rpx',
									left: '10%',
									width: '80%',
									borderRadius: '10rpx'
								},
								views: [
									{
										type: 'text',
										text: this.posterInfo.price == 0 ? '限时免费' : '￥' + this.posterInfo.price / 100 + '',
										css: {
											fontSize: '32rpx',
											color: '#ff557f',
											fontWeight: 'bold',
											lineHeight: '45rpx',
											left: '20%',
											top: '590rpx',
											width: '606rpx'
										}
									},
									{
										type: 'text',
										text: this.posterInfo.linePrice == 0 ? '限时免费' : '￥' + this.posterInfo.linePrice / 100 + '',
										css: {
											fontSize: '28rpx',
											color: '#1A2033',
											lineHeight: '45rpx',
											left: '90%',
											top: '590rpx',
											width: '606rpx',
											textDecoration: 'line-through'
										}
									},
									{
										type: 'text',
										text: this.posterInfo.imageDesc,
										css: {
											fontSize: '32rpx',
											color: '#1A2033',
											fontWeight: 'bold',
											lineHeight: '45rpx',
											left: '20%',
											top: '690rpx',
											width: '606rpx'
										}
									},
									{
										type: 'view',
										css: {
											width: '90%',
											left: '20%',
											borderBottom: '3rpx dashed #ff557f',
											top: '660rpx'
										}
									},
									{
										// type: 'qrcode',
										type: 'image',
										src: this.posterInfo.qrcodeUrl,
										css: {
											left: '80%',
											top: '680rpx',
											width: '150rpx',
											height: '150rpx'
										}
									},
									{
										type: 'text',
										text: this.posterInfo.qrcodeDesc,
										css: {
											left: '20%',
											top: '743rpx',
											width: '70%',
											// textAlign: 'center',
											fontSize: '24rpx',
											color: '#989FB3',
											lineHeight: '33rpx'
										}
									}
								]
							}
						]
						break;
					case 2:
					this.posterObj.background='linear-gradient(153deg, #EFF7FE 0%, #E6F0FA 100%)'
					this.posterObj.views = [{
							type: 'image',
							src: 'https://s.yun-live.com/images/20210201/9befed22f44df68a27044ca8a84a39b6.png',
							css: {
								left: '0',
								top: '0',
								width: '150rpx',
								height: '150rpx'
							}
						},
							{
								type: 'image',
								src: 'https://s.yun-live.com/images/20210201/c40e25e13d91b275b274ccea8576a0e0.png',
								css: {
									width: '128rpx',
									height: '50rpx',
									left: '542rpx',
									top: '0rpx',
								}
							},
							{
								type: 'image',
								src: this.avatar,
								css: {
									left: '56rpx',
									top: '72rpx',
									borderRadius: '50%',
									width: '80rpx',
									height: '80rpx'
								}
							},
							{
								type: 'text',
								text: this.myInfo.user.username,
								css: {
									fontSize: '28rpx',
									fontWeight: 'bold',
									color: '#1D1D25',
									lineHeight: '28rpx',
									left: '160rpx',
									top: '80rpx'
								}
							},
							{
								type: 'text',
								text: '邀请你一起学习',
								css: {
									fontSize: '24rpx',
									// color: '#6CB37A',
									color: '#1D1D25',
									lineHeight: '24rpx',
									left: '160rpx',
									top: '121rpx'
								}
							},
							{
								type: 'image',
								src: this.posterInfo.imageUrl,
								css: {
									left: '50%',
									top: '188rpx',
									transform: 'translate(-50%,0)',
									width: '540rpx',
									height: '303rpx',
									borderRadius: '16rpx',
									border:'3rpx solid rgba(255,255,255,0.5)'
								}
							},
							{
								type: 'text',
								text: this.posterInfo.imageDesc,
								css: {
									fontSize: '32rpx',
									color: '#1D1D25',
									fontWeight: 'bold',
									lineHeight: '45rpx',
									left: '71rpx',
									top: '508rpx',
									width: '530rpx'
								}
							},
							{
								type: 'view',
								css: {
									left: '50%',
									top: '630rpx',
									transform: 'translate(-50%,0)',
									width: '160rpx',
									height: '160rpx',
									background: '#fff',
								}
							},
							{
								type: 'image',
								src: this.posterInfo.qrcodeUrl,
								css: {
									left: '50%',
									top: '638rpx',
									transform: 'translate(-50%,0)',
									width: '144rpx',
									height: '144rpx',
								}
							},
							{
								type: 'text',
								text: this.posterInfo.qrcodeDesc,
								css: {
									left: '0',
									top: '819rpx',
									width: '100%',
									textAlign: 'center',
									fontSize: '24rpx',
									color: '#1D1D25',
									lineHeight: '33rpx'
								}
							},
						]
						break;
					default:
						break;
				}
				this.onRender()
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style.scss';
	image{will-change: transform}
</style>
