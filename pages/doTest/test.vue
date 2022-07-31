<template>
	<view class="content">
		<check-xi @confrim="confrim" @checkOption="checkOption" :questionList="questionList"></check-xi>
	</view>
</template>
	
<script>
	import checkXi from '@/uni_modules/xi-check/components/xi-check/xi-check.vue';
	
	export default {
	  components: { checkXi },
	  props: {},
	  data() {
		return {
			pickerData: [],
			colorStyle: { // 颜色修改自定义 -- 可选参数
				nextBac: '#C9784F', //下一题按钮背景色
				nextCol: '#FFFFFF', //下一题按钮背字体颜色
				optBac: '#EEB67A', //选项按钮背景色
				optCol: '#232131', //选项按钮字体颜色
				optBacActive: '#C9784F', //选项按钮背景色 - 选中
				optColActive: '#FFFFFF', //选项按钮字体颜色-选中
			},
			questionList:[
				{
					id:1, //题目id
					type:'radio',//单选 checkbox - 多选 ； write - 填空 
					number:1, //题目序号 - 非必要
					title:'生物灭绝又叫生物绝种。历史上一共有几次大灭绝？', //题目名称
					imageList:[],
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
					number:2,
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
	  },
	  methods: {
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