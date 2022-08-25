<template>
	<view>
		<view class="box">
			<view class="head">添加儿童</view>
			<view class="msg">
				<view class="text">姓名<i style="color: #d93232;">*</i></view>
				<!-- <input type="text" v-model="name"> -->
				<input type="text"
				 v-model="name" placeholder-style="color:#b3b3b3" 
				 :placeholder="namePlaceHolder"
				  @focus="namePlaceHolder=''" 
				 @blur="name==''?namePlaceHolder='请输入姓名':''" />
			</view>
			<view class="msg">
				<view class="text">性别<i style="color: #d93232;">*</i></view>
				<view class="select">
					<view class="select_option" :class="{'selected':sex === 0}" @tap='selectSex(0)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-if="sex === 1" />
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-else />
						<view>男</view>
					</view>
					<view class="select_option" :class="{'selected':sex === 1}" @tap='selectSex(1)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-if="sex === 0"/>
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-else />
						<view>女</view>
					</view>
				</view>
			</view>
			<view class="msg">
				<view class="text">出生日期<i style="color: #d93232;">*</i></view>
				<picker class="pickerSelect" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view style="font-size: 30rpx; color: #4d4d4d;display: flex;">{{date}}<view class="selImg"><image src="../../static/images/index/btn_12.png" style="width: 100%; height: 100%;" mode="scaleToFill" /></view></view>
				</picker>
			</view>
		</view>
		
		<view class="btn" @tap="add()">创建</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				sex: 0,
				checked: 0,
				isChecked:false,
				name: '',
				gender: 0,
				date: currentDate,
				namePlaceHolder: '请输入姓名'
			}
		},
		 computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			selectSex(n) {
				this.sex = n
				this.gender = n
			},
			// 倒计时
			countDown(){
				this.clear = setInterval(this.countDown,1000);
				
				if(!this.countdown){                    
					this.resend = false;
					clearInterval(this.clear);
				}else{
					--this.countdown;
				}
			},
			add(){
				if (!this.name) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'error'
					})
					return 
				}
				this.request({
					url: '/mini/registerChildInfo',
					method: 'POST',
					data: {
						"avatar": "string",
						"birthday": this.date,
						"gender": this.gender,
						"nickname": this.name
					}
				}).then((res)=>{
					if(res.code === 0){
						uni.showToast({
							title: '添加成功！',
							icon: 'success'
						})
						// uni.navigateBack({
						// 	delta: 1
						// })
						uni.navigateTo({
							url:'../familyBer/familyBer'
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon:'error'
						})
					}
				})
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 50;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/common.css';
	.select {
		display: flex;
		.select_option {
			display: flex;
			font-size: 30rpx;
			color: #b3b3b3;
		}
		.selected {
			display: flex;
			font-size: 30rpx;
			color: #808080;
		}
	}
	.code {
		width: 150rpx;
		height: 70rpx;
		color: #28b07c;
		font-size: 28rpx;
		margin-left: 58rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.box .head {
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	.resend {
		width: 150rpx;
		height: 70rpx;
		background-color: #B3B3B3;
		color: #FFFFFF;
		font-size: 24rpx;
		margin-left: 24rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.pickerSelect {
		display: flex;
		align-items: center;
	}
	.selImg {
		width: 36rpx;
		height: 36rpx;
		// margin-top: -15rpx;
		margin-left: 12rpx;
	}
	.checkbox-xy{
		display: flex;
		margin-bottom: 40px;
	}
	.auth-clause {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #909090;
		margin-left: 50rpx;
	}
	switch.orange[checked] .wx-switch-input,
	checkbox.orange[checked] .wx-checkbox-input,
	radio.orange[checked] .wx-radio-input,
	switch.orange.checked .uni-switch-input,
	checkbox.orange.checked .uni-checkbox-input,
	radio.orange.checked .uni-radio-input {
		background-color: #686868 !important;
		border-color: #000000 !important;
		color: #ffffff !important;
	}
	.linkxy{
		margin-left: 10px;
		margin-right: 10px;
		color: #0055ff;
	}
</style>
