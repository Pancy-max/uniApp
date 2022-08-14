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
			questionList:[
				{
					id:1, // 题目id
					type:'radio', //单选 checkbox - 多选 ； write - 填空 
					title:'生物灭绝又叫生物绝种。历史上一共有几次大灭绝？', //题目名称
					imageList:[],
					countTime: 5,
					question_option:[
						{
							id:1,//答案id
							name:'A',//答案选项名
							content:'一次',//答案内容
							active:0//选中状态
						},
						{id:2,name:'B',content:'二次',active:0},
						{id:3,name:'C',content:'三次',active:0},
						{id:4,name:'D',content:'四次',active:0},
						]//选项集
				}, {
					id:2,
					type:'checkbox',
					title:'生物大灭绝是指大规模的集群灭绝，生物灭绝又叫生物绝种。历史上一共有几次大灭绝？',
					imageList:[],
					question_option:[
						{id:1,name:'A',content:'一次',active:0},
						{id:2,name:'B',content:'二次',active:0},
						{id:3,name:'C',content:'三次',active:0},
						{id:4,name:'D',content:'四次',active:0},
					]
				}
			]
		}
	  },
	  computed: {},
	  onLoad(e) {
		this.item = getApp().globalData.testItem;
		this.getUserProcess() // 获取用户做题进度
	  },
	  methods: {
		  getUserProcess() {
			this.request({
			  	url: '/mini/getUserEvaInfo',
			  	method: 'POST'
			}).then(res => {
				const lastInfo = res.data.userEvaInfo
				const {costTime, startTime, result} = lastInfo
				this.lastInfo.costTime = costTime
				this.lastInfo.startTime = startTime
				this.lastInfo.result = result
				const length = result && result.length
				console.log('上一次已做题目数', length)
				this.questionList = [...this._initData(length)]
				
			}).catch(e => {
				console.error(e)
				this.questionList = [...this._initData(0)];
			})
		  },
		  _initData(length) {
			this.mcode = this.item.code
			this.amount = this.item.price
			this.totalLength = this.item.evaTopicList && this.item.evaTopicList.length
			return this.item.evaTopicList.slice(length).map((item, idx) => {
			  	return {
			  		id: item.id, // 题目id
					type: 'radio',
					number: idx + 1 + length,
			  		// type: questionTypeMap[item.type + ''], // radio 单选 checkbox - 多选 ； write - 填空 
			  		imageList: [],
			  		title: item.title,
					countTime: item.countTime,
					code: item.code,
			  		question_option: item.evaOptionList.map((v, i) => {
			  			return {
			  				content: v.direction,
			  				name: '',
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
			const userInfo = uni.getStorageSync('myinfo');
			const that = this
			if (!userInfo) {
				console.log('没有用户信息')
			}
			// current_id -当前已做题目数
			const checkRes = e.checkRes.check_res.slice(0, e.current_id)
			const hasFinished = this.totalLength === checkRes.length + this.lastInfo.result.length
			const testData = {
				  result: [...this.lastInfo.result, ...checkRes.map(item => {
					const keyRes = item.keyRes[0] // 目前都是单选
					return {
						"direction": keyRes.content,
						"ocode": keyRes.code,
						// "score": 0,
						"tcode": item.code,
						"title": item.title
					}
				  })],
				  source: "string",
				  // "userUuid": userInfo.user.uuid,
				  username: userInfo.user.username,
				  endTime: timeSecond(endTime),
				  startTime: this.lastInfo.startTime || timeSecond(this.startTime),
				  costTime: endTime - this.startTime + this.lastInfo.costTime,
				  mcode: this.mcode,
				  amount: this.amount,
				  hasFinished,
				  ispay: false,
			}
			this.request({
				url: '/mini/submitEvaResult',
				method: 'POST',
				data: testData
			}).then((res) => {
				this.isSummitFlag = true
				if(res.data!='' && res.data){
					// this.bannerList = res.data.bannerInfo.map(item => {
					// 	item.image = item.picUrl
					// 	item.id = item.ID
					// 	return item
					// })
				}else{
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