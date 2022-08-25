<template>
	<view class="content">
		<check-xi 
			@confrim="confrim" 
			@checkOption="checkOption" 
			:questionList="questionList">
		</check-xi>
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
			questionList:[
				
			]
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
				console.log('上一次已做题目数', length)
				// 如果全部做完
				if (!this.item.evaTopicList) {
					console.error('获取进度错误，已做题目数大于总题目数')
					this.questionList = [...this._initData(0)]
				}
				if (length === this.item.evaTopicList.length) {
					uni.redirectTo({
						url: './testResult'
					})
				} else if (length < this.item.evaTopicList.length) {
					this.questionList = [...this._initData(length)]
				} else {
					console.error('获取进度错误，已做题目数大于总题目数')
				}		
			}).catch(e => {
				console.error(e)
				this.questionList = [...this._initData(0)];
			})
		  },
		  _initData(length) {
			return this.item.evaTopicList.slice(length).map((item, idx) => {
			  	return {
			  		id: item.ID, // 题目id
					type: item.answerType,
					number: idx + 1 + length,
			  		imageList: item.type === 2 && item.picUrl && item.picUrl.split(';') || [],
					desc: item.type === 3 && item.picUrl,
					subtitle: item.subtitle,
			  		title: item.title,
					countTime: item.countTime,
					code: item.code,
			  		question_option: item.evaOptionList.map((v, i) => {
			  			return {
							picUrl: v.picUrl,
			  				content: v.direction,
			  				name: '',
							score: v.score,
							code: v.code,
			  				id: v.ID,
			  				active: 0 // 选中状态
			  			}
			  		}).sort((a,b) => a.sortOrder < b.sortOrder ? 1 : -1)
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
			// 已做题目 = 当前索引（从零开始） + 1 - 1（当前没做）
			const checkRes = e.isEnd ? e.checkRes.check_res : e.checkRes.check_res.slice(0, e.current_id)
			const hasFinished = this.totalLength === checkRes.length + this.lastInfo.result.length
			this.isSummitFlag = true
			const testData = {
				  result: [...this.lastInfo.result, ...checkRes.map(item => {
					const keyRes = item.keyRes;
					console.log('keyRes', keyRes)
					return {
						"direction": keyRes[0] && keyRes[0].content,
						"ocode":  keyRes.map(v => v.code).join(';'),
						"score": keyRes[0] && keyRes[0].score,
						"tcode": item.code,
						"title": item.title
					}
				  })],
				  childId: this.item.type === 1 ? this.childId : 0, // 1-儿童 2-成人
				  source: "string",
				  // "userUuid": userInfo.user.uuid,
				  username: userInfo.user.username,
				  endTime: timeSecond(endTime),
				  startTime: this.lastInfo.startTime || timeSecond(this.startTime),
				  costTime: endTime - this.startTime + this.lastInfo.costTime,
				  mcode: this.mcode,
				  amount: this.amount,
				  hasFinished,
				  // ispay: false,
			}
			this.request({
				url: '/mini/submitEvaResult',
				method: 'POST',
				data: testData
			}).then((res) => {
				if(res.data!='' && res.data){
					console.log('提交测评成功')
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
		// 答案选择 change 事件
		checkOption(e){
			console.log('check',e);
		}
	  },
	};
</script>

<style lang="less" scoped>
</style>