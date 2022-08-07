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
	const questionTypeMap = {
		'0': 'radio',
		'1': 'checkbox',
		'2': 'write'
	}
	export default {
	  components: { checkXi },
	  props: {},
	  data() {
		return {
			item: {},
			questionList:[
				{
					id:1, //题目id
					type:'radio',//单选 checkbox - 多选 ； write - 填空 
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
		this.questionList = [...this._initData(), ...this.questionList];
	  },
	  methods: {
		  _initData() {
			return this.item.evaTopicList.map(item => {
			  	return {
			  		id: item.ID, // 题目id
			  		type: questionTypeMap[item.type + ''], // 单选 checkbox - 多选 ； write - 填空 
			  		imageList: [],
			  		title: item.title,
					countTime: item.countTime,
			  		question_option: item.evaOptionList.map(v => {
			  			return {
			  				content: v.direction,
			  				name: v.code,
			  				id: v.ID,
			  				active: 0 // 选中状态
			  			}
			  		}).sort((a,b) => a.code < b.code ? 1 : -1)
			  	}
			  })
		  },	
		// 提交事件
		confrim(e){ 
			console.log('next',e);
			// 根据数据，发送给后台，返回测评结果
			uni.redirectTo({
				url: './testResult'
			})
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