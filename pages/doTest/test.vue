<template>
	<view class="content">
		<check-xi 
			@confrim="confrim"
			:questionList="questionList"
			:questionSum="totalLength"
			:currentIndex="currentIndex"
			:resultInfo="lastInfo.result"
		/>
	</view>
</template>
	
<script>
	import checkXi from '@/components/xi-check/xi-check.vue';
	import {timeSecond} from '@/utils/time.js'
	const questionTypeMap = {
		'1': 'radio',
		'2': 'checkbox',
		'3': 'write'
	}
	export default {
	  components: { checkXi },
	  props: {},
	  data() {
		return {
			item: {},
			startTime: Date.now(),
			totalLength: 0, // 总题目长度
			amount: 0,
			childId: 0,
			mcode: '',
			isSummitFlag: false, // 是否已提交答案
			lastInfo: {
				startTime: '',
				costTime: 0,
				result: []
			},
			userInfo: {},
			questionList:[],
			currentIndex: 0
		}
	  },
	  computed: {},
	  onLoad(e) {
		this.childId = getApp().globalData.childId
		this.item = getApp().globalData.testItem;
		this.mcode = this.item.code
		this.amount = this.item.price
		this.totalLength = this.item.evaTopicList && this.item.evaTopicList.length
		console.log('childId', this.childId)
		console.log('type', this.item.type)
		const userInfo = uni.getStorageSync('myinfo');
		if (!userInfo) {
			console.log('没有用户信息')
		} else {
			this.userInfo = userInfo.user
			console.log('用户信息', this.userInfo)
		}
		console.log('getUserProcess')
		this.getUserProcess() // 获取用户做题进度
	  },
	  methods: {
		  getUserProcess() {
			console.log('this.userInfo', this.userInfo)
			this.request({
			  	url: '/mini/getUserEvaProgress',
			  	method: 'POST',
				data: {
					mcode: this.mcode,
					username: this.userInfo.username,
					childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
					isAll: false
				}
			}).then(res => {
				console.log('获取历史做题信息', res.data)
				const lastInfo = res.data && res.data.userEvaProgress && res.data.userEvaProgress[0]
				if (lastInfo) {
					const {costTime, startTime, result} = lastInfo
					this.lastInfo.costTime = costTime
					this.lastInfo.startTime = startTime
					this.lastInfo.result = result || []
				}
				const length = this.lastInfo.result.length
				this.currentIndex = length;
				console.log('上一次已做题目数', length)
				// 如果全部做完
				if (!this.item.evaTopicList) {
					console.error('获取进度错误，已做题目数大于总题目数')
					this.questionList = [...this._initData()]
				}
				if (length === this.item.evaTopicList.length) {
					uni.redirectTo({
						url: './testResult'
					})
				} else if (length < this.item.evaTopicList.length) {
					this.questionList = [...this._initData()]
				} else {
					console.error('获取进度错误，已做题目数大于总题目数')
				}		
			}).catch(e => {
				console.error(e)
				this.questionList = [...this._initData()];
			})
		  },
		  _initData() {
			return this.item.evaTopicList.map((item, idx) => {
				const question_option = item.evaOptionList.map((v, i) => {
			  			return {
							picUrl: v.picUrl,
			  				content: v.direction,
			  				name: '',
							score: v.score,
							code: v.code,
			  				id: v.ID,
			  				active: 0, // 选中状态
							sortOrder: v.sortOrder
			  			}
			  		})
			  	return {
			  		id: item.ID, // 题目id
					type: item.answerType,
					number: idx + 1,
			  		imageList: item.type === 2 && item.picUrl && item.picUrl.split(';') || [],
					desc: item.type === 3 && item.picUrl,
					subtitle: item.subtitle,
			  		title: item.title,
					countTime: item.countTime,
					code: item.code,
			  		question_option: question_option.sort((a,b) => {
						return a.sortOrder > b.sortOrder ? 1 : (a.sortOrder === b.sortOrder ? 0 : -1)
					})
			  	}
			})
		  },
		// 提交事件
		confrim(e){ 
			console.log('next',e);
			if (this.isSummitFlag) {
				return
			}
			const endTime = Date.now();
			// 根据数据，发送给后台，返回测评结果
			const that = this
			const userInfo = uni.getStorageSync('myinfo');
			if (!userInfo) {
				console.log('没有用户信息')
			}
			// current_id -当前索引
			console.log('当前索引', e.current_id)
			const checkRes = e.isEnd ? e.checkRes.check_res : e.checkRes.check_res.slice(0, e.current_id)
			// console.log('this.totalLength', this.totalLength)
			// console.log('当前已做长度', checkRes.length, '上一次长度', this.lastInfo.result.length)
			// const hasFinished = this.totalLength === checkRes.length
			console.log('答案整理', checkRes)
			console.log('hasFinished', e.isEnd)
			const hasFinished = e.isEnd
			this.isSummitFlag = true
			for (let item of checkRes) {
				if (item.keyRes.length === 0) {
					console.log('题目未完成，请重新做题')
					uni.showToast({
					    title: '题目未完成, 请重新做题',
					    icon: 'error',
					    duration: 2000
					})
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/doTest/test'
						})
					}, 1000);
					return
				}
			}
			const testData = {
				result: checkRes.map(item => {
					const keyRes = item.keyRes;
					return {
						"direction": keyRes[0] && keyRes[0].content,
						"ocode":  keyRes.map(v => v.code).join(';'),
						"score": keyRes[0] && keyRes[0].score,
						"tcode": item.code,
						"title": item.title,
					}
				  }),
				  childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				  source: "string",
				  username: userInfo.user.username,
				  endTime: timeSecond(endTime),
				  startTime: this.lastInfo.startTime || timeSecond(this.startTime),
				  costTime: endTime - this.startTime + this.lastInfo.costTime,
				  mcode: this.mcode,
				  amount: this.amount,
				  hasFinished,
			}
			console.log(testData)
			
			this.request({
				url: '/mini/submitEvaResult',
				method: 'POST',
				data: testData
			}).then((res) => {
				if(res.data!='' && res.data){
					console.log('提交测评成功', res.data)
					if (hasFinished) {
						this.request({
							url: '/mini/submitEvaResult',
							method: 'POST',
							data: testData
						}).then((result) => {
							if(result.data!='' && result.data){
								console.log('计分成功')
							}
						})
					}	
				}
			})
			if (hasFinished) {
				uni.redirectTo({
					url: './testResult'
				})
			}
		},
	  },
	};
</script>

<style lang="less" scoped>
</style>