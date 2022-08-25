<template>
 <view class="test-wrapper">
	 <view class="test-content">
		 <view class="block-content">
			<view class="title">
				测评报告
			 </view>
			 <view class="desc">
				您的报告已生成，有问题可以预约咨询老师
			 </view>
			<view class="score">{{testResult.score || 0}}分</view>
			<!-- <view class="content">
				维度：{{testResult.mainDim || ''}}
			</view>
			<view class="content">
				结果评价：{{testResult.content || ''}}
			</view> -->
			<view class="charts-box">
				<block v-if="testResult.MiniEvaUserDimension && testResult.MiniEvaUserDimension.length > 6">
					<qiun-data-charts type="column" :chartData="chartData" />
				</block>
				<block v-else>
					<qiun-data-charts type="radar" :chartData="chartData" />
				</block>
			</view>
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
				专家建议
			</view>
			<view class="rec-text">
				{{testResult.recContent|| '专家建议'}}
			</view>
		</view>
		<view class="tuijian-title">
			课程推荐
		</view>
		<view class="block-content">
			<view class="">
				
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
		    name: "目标值",
		    data: [35, 36, 31, 33, 13, 34]
		  }, {
		    name: "完成量",
		    data: [18, 27, 21, 24, 6, 28]
		  }]
		}
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
		  })
		  
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
				padding: 20rpx;
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
</style>
