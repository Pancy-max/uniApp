<template>
 <view class="test-wrapper">
	 <view class="test-content">
		 <view class="block-content">
			<view class="title">
				测评报告
			 </view>
			 <view class="desc">
				您的报告已生成，有问题可以预约咨询老师~
			 </view>
			<!-- <view class="score">{{testResult.score || 0}}分</view> -->
			<!-- <view class="content">
				维度：{{testResult.mainDim || ''}}
			</view>
			<view class="content">
				结果评价：{{testResult.content || ''}}
			</view> -->
			
				<block v-if="recInfo.reportPicType === 'column'">
					<qiun-data-charts type="column" :chartData="chartData" />
				</block>
				<block v-if="recInfo.reportPicType === 'radar'">
					<qiun-data-charts type="radar" :chartData="chartData" />
				</block>
		</view>
		<view class="content_analyze block-content" v-for="(item, index) in testResult.MiniEvaUserDimension" :key="index">
			<view class="title">
				{{index+1}}. {{item.mainDim}}
			</view>
			<view class="dim_score">
				<view class="dim_title">
					<uni-rate :readonly="true" :value="item.score / 20" class="rate-score"/> 
					<text class="score-dim">{{item.score}}分</text>
				</view>
				<view class="dim_content">
					{{item.content}}
				</view>
			</view>
			
		</view>
		<view class="block-content rec">
			<view class="rec-content">
				专家解读
			</view>
			<view class="rec-text">
				{{recInfo.content || ''}}
			</view>
		</view>
		<view class="tuijian-title">
			课程推荐
		</view>
		<view class="block-content">
			<view class="flex-box">
				<view class="rec-img">
					<image :src="recInfo.picurl" mode="scaleToFill" style="width: 200rpx; height: 200rpx; margin-right: 32rpx;" />
				</view>
				<view class="rec-right">
					<view class="rec-title">
						{{recInfo.title}}
					</view>
					<span class="rec-btn" @tap="goRecLink">
						前往
					</span>
				</view>
			</view>
		</view>
	 </view>
 </view>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
		childId: 0,
		item: {},
		myInfo: {},
		testResult: null,
		mcode: '',
		chartData:{
		  categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
		  series: [{
		    name: "分数",
		    data: [35, 36, 31, 33, 13, 34]
		  }]
		},
		recInfo: {}
	}
  },
  computed: {},
  onLoad(e) {
	console.log('onLoad', e.mcode)
	if (e.mcode) {
		this.mcode = e.mcode
		this.type = e.type
		this.childId = e.childId
	} else {
		this.childId = getApp().globalData.childId
		this.item = getApp().globalData.testItem;
		this.mcode = this.item.code
		this.type = this.item.type
	}
	this.myInfo = uni.getStorageSync('myinfo');
	this.getUserEvaInfo()
	this.getRecInfo()
  },
  methods: {
	  getUserEvaInfo() {
		  this.request({
		  	url: '/mini/getUserEvaInfo',
		  	method: 'POST',
		  	data: {
		  		mcode: this.mcode,
		  		username: this.myInfo.user.username,
		  		childId: this.type === 1 ? this.childId : 0, // 1-儿童 2-成人
		  		isAll: false
		  	}
		  }).then(res => {
		  	const data = res.data
			console.log('获取测评结果', data.userEvaInfo)
			this.testResult = data.userEvaInfo
			const dimData = data.userEvaInfo.MiniEvaUserDimension
			this.chartData.categories = dimData.map(item => {
				return item.mainDim
			})
			this.chartData.series[0].data = dimData.map(item => item.score * 10)
		  })
		  
	  },
	  getRecInfo() {
		this.request({
			url: '/mini/getEvaResRecInfo',
			method: 'POST',
			data: {
				mcode: this.mcode,
				username: this.myInfo.user.username,
				childId: this.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				// isAll: false
			}
		}).then(res => {
			const data = res.data
					console.log('获取推荐结果', data.resRecInfo)
					this.recInfo = data.resRecInfo
		})
	  },
	  goRecLink() {
		  wx.navigateToMiniProgram({
		     // appId: this.recInfo.appid,
		     // path: this.recInfo.link,
			 	shortLink: this.recInfo.link,
		     // extraData: {
		     //   foo: 'bar'
		     // },
			 verify: 'binding',
		     success(res) {
		  		console.log('打开成功')
		       console.info(res);
		     },
			error(e){
			  console.log('e', e)
			}
		   });
	  }
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		padding: 20rpx;
		background: #f1f1ff;
		height: calc(100vh - 40rpx);
		overflow: auto;
		.test-content {
			padding: 30rpx;
			border-radius: 20rpx;
			.block-content {
				background: #fff;
				border-radius: 20rpx;
				padding: 20rpx;
			}
			.rec {
				padding: 0;
				margin-top: 30rpx;
			}
			.rec-content {
				background: #ffca3e;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				color: #000;
				font-size: 36rpx;
				border-radius: 20rpx 20rpx 0 0;
			}
			.rec-text {
				padding: 30rpx;
			}
		}
		.title {
			font-size: 34rpx;
			color: #000;
			font-weight: 500;
			border-left: 10rpx solid #ffca3e;
			padding-left: 20rpx;
		}
		.desc {
			font-size: 30rpx;
			color: #999;
			margin-top: 10rpx;
		}
		.score {
			background: #ffca3e;
			color: #222;
			font-size: 40rpx;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin: 50rpx auto;
			text-align: center;
			line-height: 120rpx;
		}
		.score-dim {
			color: #ffca3e;
			margin-left: 20rpx;
		}
		.content {
			font-size: 30rpx;
			text-align: center;
			line-height: 50rpx;
		}
	}
	.content_analyze {
		margin-top: 20rpx;
	}
	.dim_title {
		font-size: 36rpx;
		margin: 30rpx;
	}
	.rate-score {
		display: inline-block;
	}
	.tuijian-title {
		margin: 30rpx;
		font-size: 36rpx;
	}
	.flex-box {
		display: flex;
		justify-content: space-between;
		.rec-right {
			flex: 1;
			position: relative;
		}
		.rec-title {
			font-size: 32rpx;
			font-weight: 500;
		}
		.rec-btn {
			display: inline-block;
			width: 120rpx;
			border-radius: 28rpx;
			font-size: 30rpx;
			color: #fff;
			background: #ffca3e;
			text-align: center;
			height: 50rpx;
			line-height: 49rpx;
			position: absolute;
			right: 10rpx;
			bottom: 11rpx;
		}
	}
</style>
