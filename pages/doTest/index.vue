<template>
 <view class="test-wrapper">
	<view>
		<view class="test_content">
			<view class="title">
				本次将对以下内容进行测评：
			</view>
			<view class="list_box" >
				<view class="list_item" v-for="(item, index) in list" :key="index">
					{{item}}
				</view>
			</view>
			<view class="tips">
				测评约为5分钟，请您准备充足的时间
			</view>
		</view>
		<view class="tabbar">
			<button @click="goTest" class="go_test">进入测评</button>
		</view>
	</view>
 </view>
</template>

<script>
// import {Base64} from '../../utils/base64.js'
export default {
  props: {},
  data() {
    return {
		list: [
			'111',
			'222',
			'4444',
			'5555',
			'6666'
		],
		pickerData: []
	};
  },
  computed: {},
  onLoad(e) {
	  this.pickerdata()
	  this.code = Object.keys(e)[0]
  },
  methods: {
	  goTest(){
		  uni.switchTab({
			  url:"./test.vue"
		  })
	  },
	  // TODO: 获取测评数据
	  async pickerdata(){
		  // this.show = true
		  // let res = await this.request({
			 //  url:'/v1/feedback_type'
		  // })
		  // this.pickerData = res.data
		  // this.pickerData.unshift('请选择类型')
	  },
	  //历史记录
	  lishiyijang(){
		  uni.navigateTo({
		    url:"../yijang/index"
		  });
	  },
	  textfocus(e){
		  this.linenumber= e.detail.cursor
		  this.lineValue = e.detail.value
	  },
	  selectType(n){
	  	this.anonymity = n
	  },
  },
};
</script>

<style lang="less" scoped>
	.test-wrapper {
		// background: #9e9e9e14;
		padding: 40rpx;
	}
	.test_content {
		background: #fff;
		border-radius: 30rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		.title {
			color: #333;
		}
		.list_box {
			padding: 30rpx;
			.list_item {
				margin: 40rpx;
				font-size: 30rpx;
			}

		}
		.tips {
			color: #766f6f;
			font-size: 28rpx;
			text-align: center;
		}
	}
	.go_test {
		color: #fff;
		font-size: 30rpx;
		border-radius: 40rpx;
		background: #ffaa00;
		width: 100%;
	}
</style>
