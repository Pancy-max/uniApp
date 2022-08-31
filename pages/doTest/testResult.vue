<template>
	<view class="test-wrapper">
		<scroll-view scroll-y="true" class="test-scroll-view">
			<view class="test-content">
				<view class="block-content">
					<view class="title">
						测评报告
					</view>
					<view class="desc">
						您的报告已生成，有问题可以预约咨询老师 ~
					</view>
					<!-- <view class="score">{{testResult.score || 0}}分</view> -->
					<!-- <view class="content">
	 					维度：{{testResult.mainDim || ''}}
	 				</view>
	 				<view class="content">
	 					结果评价：{{testResult.content || ''}}
	 				</view> -->
					<block v-if="level === 1">
						<view v-if="recInfo.reportPicType === 'column'"  class="charts-box">
							<qiun-data-charts type="column" :chartData="chartData" :opts="options" :inScrollView="true" />
						</view>
						<view v-if="recInfo.reportPicType === 'radar'"  class="charts-box">
							<qiun-data-charts type="radar" :chartData="chartData" :opts="options" :inScrollView="true" />
						</view>
						
					</block>

				</view>
				<view class="content_analyze block-content" v-for="(v, index) in dimData"
					:key="index" >
					<view class="title" v-html="v.dimTitle"></view>
					<!-- 二级 开始-->
						<block v-if="level === 2">
							<view v-if="recInfo.reportPicType === 'column'"  class="charts-box">
								<qiun-data-charts type="column" :chartData="v.chartData" :opts="v.options" :inScrollView="true" />
							</view>
							<view v-if="recInfo.reportPicType === 'radar'"  class="charts-box">
								<qiun-data-charts type="radar" :chartData="v.chartData" :opts="v.options" :inScrollView="true" />
							</view>
						</block>
							<view class="content_analyze block-content" v-for="(ele, i) in v.children"
								:key="i">
								<view class="sub-title" v-if="ele.subDim">
									({{i+1}}). {{ele.subDim}}
								</view>
								<view class="dim_score">
									<view class="dim_title">
										<uni-rate :readonly="true" :value="ele.score / ele.totalScore * 5" class="rate-score" />
										<text class="score-dim">{{ele.score || 0}}分</text>
									</view>
									<view class="dim_content" v-html="ele.content"></view>
								</view>
							</view>
						<!-- 二级结束 -->

				</view>
				<view class="block-content rec">
					<view class="rec-content">
						专家解读
					</view>
					<view class="rec-text" v-html="recInfo.content">
					</view>
				</view>
				<view class="tuijian-title">
					课程推荐
				</view>
				<view class="block-content">
					<view class="flex-box" @tap="goRecLink">
						<view class="rec-img">
							<image :src="recInfo.picurl" mode="scaleToFill"
								style="width: 200rpx; height: 200rpx; margin-right: 32rpx;" />
						</view>
						<view class="rec-right">
							<view class="rec-title">
								{{recInfo.title || ''}}
							</view>
							<span class="rec-btn" @tap="goRecLink">
								前往
							</span>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="tabbar" >
			<text class="contact-text">请专业测评老师解读报告？</text>
			<button open-type="contact" class="contact-btn" size="mini"> 问一问</button>
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
				dimData: [],
				mcode: '',
				level: 1,
				chartData: {
					categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
					series: [{
						name: "分数",
						data: [5, 6, 1, 3, 9, 4]
					}]
				},
				options: {},
				recInfo: {}
			}
		},
		computed: {},
		onLoad(e) {
			console.log('onLoad', e.mcode)
			if (e.mcode) {
				this.mcode = e.mcode
				this.type = e.type
				this.childId = +e.childId
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
						childId: this.childId || 0, // 1-儿童 2-成人
					}
				}).then(res => {
					const data = res.data
					console.log('获取测评结果', data.userEvaInfo)
					this.testResult = data.userEvaInfo
					// this.testResult.MiniEvaUserDimension = [{
					// 	"ID": 1,
					// 	"CreatedAt": "2022-08-27T23:17:57.143+08:00",
					// 	"UpdatedAt": "2022-08-27T23:17:57.143+08:00",
					// 	"dimSum": "",
					// 	"mcode": "MCODE3",
					// 	"mainDim": "学习心态",
					// 	"subDim": "学习动机",
					// 	"score": 5.3,
					// 	"content": "学习动机这一维度测量学生对追求学业成功，完成与学业相关任务的总的目标感和动机强度。学生的学习动机，会极大地影响学习自主程度和努力程度。该项得分较高的学生，不会轻易放弃自己的学业，会用积极的心态来对待学习。对学习与自己的生涯目标、人生观、世界观的关系较为清晰，可以维持良好的心境学习。该项得分低的学生常常对于学习与自己的生涯目标、人生观、世界观的关系不太清楚。需要着重思考自己对于未来生活和生涯的期待，自身学业成就与未来生涯的关系和作用，并做出学习规划。",
					// 	"deleted": false,
					// 	"MiniUserEva": {
					// 		"ID": 0,
					// 		"CreatedAt": "0001-01-01T00:00:00Z",
					// 		"UpdatedAt": "0001-01-01T00:00:00Z",
					// 		"username": "",
					// 		"mcode": "",
					// 		"source": "",
					// 		"startTime": null,
					// 		"endTime": null,
					// 		"costTime": 0,
					// 		"reportUrl": "",
					// 		"reportText": "",
					// 		"score": 0,
					// 		"MiniEvaResultAnswer": null,
					// 		"MiniEvaUserDimension": null
					// 	}
					// }, {
					// 	"ID": 2,
					// 	"CreatedAt": "2022-08-27T23:17:57.148+08:00",
					// 	"UpdatedAt": "2022-08-27T23:17:57.148+08:00",
					// 	"dimSum": "",
					// 	"mcode": "MCODE3",
					// 	"mainDim": "学习心态",
					// 	"subDim": "学习态度",
					// 	"score": 5.1,
					// 	"content": "学习态度这一维度测量学生对完成具体学业任务所负责任的程度。学生对学习所负责任的程度往往反映在他的日常学习行为中，如看书、预习、按时完成作业等。该项得分高的学生对于学习负责任程度比较高，往往能够按时完成作业，及时预习，复习。得分高的学生往往倾向于认为取得好的学业成就主要取决于自身努力，而不是外在的力量，如运气、教师差，或不可控制的力量，如天生的能力等。因此他们相信通过努力是可以获得进步的，并且也更愿意投入努力。该项得分低的学生对于学习负责任程度比较低，对于学习作业比较拖沓，课前不能及时预习，课后常常不能及时复习，对干学习比较散漫。得分低的学生可能倾向于认为学业成就主要取决于外在的因素或不可控制的因素，即便努力也没用，因此对待学习的态度较为消极。",
					// 	"deleted": false,
					// 	"MiniUserEva": {
					// 		"ID": 0,
					// 		"CreatedAt": "0001-01-01T00:00:00Z",
					// 		"UpdatedAt": "0001-01-01T00:00:00Z",
					// 		"username": "",
					// 		"mcode": "",
					// 		"source": "",
					// 		"startTime": null,
					// 		"endTime": null,
					// 		"costTime": 0,
					// 		"reportUrl": "",
					// 		"reportText": "",
					// 		"score": 0,
					// 		"MiniEvaResultAnswer": null,
					// 		"MiniEvaUserDimension": null
					// 	}
					// }, {
					// 	"ID": 3,
					// 	"CreatedAt": "2022-08-27T23:17:57.151+08:00",
					// 	"UpdatedAt": "2022-08-27T23:17:57.151+08:00",
					// 	"dimSum": "",
					// 	"mcode": "MCODE3",
					// 	"mainDim": "学习心态",
					// 	"subDim": "学习焦虑",
					// 	"score": 5,
					// 	"content": "学习焦虑这一维度测量学生对自身学习成绩担心的程度。学生对自己的能力、未来、成功的可能性等感到的忧虑，会干扰他们对当前学习任务或考试的注意力，进而导致自责和非理性的恐惧。该项得分高的学生表露出了较高的焦虑，在学习过程中容易过度紧张，即使已经做的很好了，还是会焦虑紧张。他们需要学会一些情绪管理和缓解焦虑的方法技巧，以便能把精力集中在学业任务上，而不是在焦虑上。该项得分低的学生焦虑程度较低，心态较为从容。对待学习能够心态平和并专注，不易受到过度情绪化或负面情绪的干扰，面对重大考试，能够摆正心态，积极准备，从容应对，考试中不容易发挥失常，能够表现出自己真实的学业水平。",
					// 	"deleted": false,
					// 	"MiniUserEva": {
					// 		"ID": 0,
					// 		"CreatedAt": "0001-01-01T00:00:00Z",
					// 		"UpdatedAt": "0001-01-01T00:00:00Z",
					// 		"username": "",
					// 		"mcode": "",
					// 		"source": "",
					// 		"startTime": null,
					// 		"endTime": null,
					// 		"costTime": 0,
					// 		"reportUrl": "",
					// 		"reportText": "",
					// 		"score": 0,
					// 		"MiniEvaResultAnswer": null,
					// 		"MiniEvaUserDimension": null
					// 	}
					// }, {
					// 	"ID": 4,
					// 	"CreatedAt": "2022-08-27T23:17:57.154+08:00",
					// 	"UpdatedAt": "2022-08-27T23:17:57.154+08:00",
					// 	"dimSum": "",
					// 	"mcode": "MCODE3",
					// 	"mainDim": "学习素质",
					// 	"subDim": "专注力",
					// 	"score": 5,
					// 	"content": "专注力这一维度测量学生把注意引导并集中在学习任务上的能力。人在思考或处理事情时，其精力是有限的，如果能量被过多干扰或分散，集中在当前学习任务上的精力就相对变少。该项得分高的学生能有效集中注意力，维持较高的专心水平，不会随意被其他干扰因素分心，常常可以较为高效地完成学习任务。该项得分低的学生可能很难回避干扰性的情绪、事件或情景，从而无法将注意力集中在当前的学习任务上。他们需要学习一些提升专注力以及时间精力管理的方法，以提高学习的效果和效率。",
					// 	"deleted": false,
					// 	"MiniUserEva": {
					// 		"ID": 0,
					// 		"CreatedAt": "0001-01-01T00:00:00Z",
					// 		"UpdatedAt": "0001-01-01T00:00:00Z",
					// 		"username": "",
					// 		"mcode": "",
					// 		"source": "",
					// 		"startTime": null,
					// 		"endTime": null,
					// 		"costTime": 0,
					// 		"reportUrl": "",
					// 		"reportText": "",
					// 		"score": 0,
					// 		"MiniEvaResultAnswer": null,
					// 		"MiniEvaUserDimension": null
					// 	},
							
					// },{
							// 	"ID": 5,
							// 	"CreatedAt": "2022-08-27T23:17:57.158+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.158+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习素质",
							// 	"subDim": "洞察力",
							// 	"score": 2.4,
							// 	"content": "洞察力这一维度测量学生在课堂听讲或自学中能够有效获取重点信息的能力。该项得分较高的学生通常能够敏锐意识到解题的关键所在，在学习过程中能够轻松把握住课堂上老师讲授的重点，在阅读过程中能够快速明白作者的意图。该项得分较低的学生通常难以把握知识的重点，不能有效的意识到课堂内容的关键，在阅读过程中难以理解作者的真实意图。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }, {
							// 	"ID": 6,
							// 	"CreatedAt": "2022-08-27T23:17:57.162+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.162+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习素质",
							// 	"subDim": "信息加工",
							// 	"score": 6,
							// 	"content": "信息加工这一维度测量学生在学习过程中运用深度信息加工思维策略的能力，该能力对于学习效果和效率具有至关重要的影响。该项得分高的学生信息处理能力比较高。表现在他们组织知识的方法很有效率，在学习时擅干发现教材各个部分，各个要点之间的联系，并对知识点进行分类比较，并擅于把学过的知识串在一起记忆或理解，从而形成一个完整的知识网络。该项得分较低的学生，在学习过程中比较盲目，面对纷繁庞杂的信息和知识时难以理清其中的逻辑与条理，学到的知识点相对孤立，不能有效的对知识进行梳理总结，难以形成完整的知识框架。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }, {
							// 	"ID": 7,
							// 	"CreatedAt": "2022-08-27T23:17:57.164+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.164+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习素质",
							// 	"subDim": "记忆力",
							// 	"score": 0,
							// 	"content": "记忆力这一维度测量学生在学习过程中对信息进行加工和存储的能力。记忆力受到年龄、环境、心理以及身体状态等方面的影响。根据记忆存储时间的特征，一般将记忆分为瞬时记忆、短时记忆和长时记忆。该项得分较高的学生对于学习材料记忆效率更高。在记忆的时候，注意力容易集中，并且能够及时把短时记忆转为长时记忆。同时善干运用记忆策略，对学习材料进行思维加工，建立逻辑联系，加深对信息的理解和保持。该项得分较低的学生通常记忆效率较低，学习过程中容易受外界干扰，注意力不容易集中。也很少运用记忆策略，对学习材料缺思维加工和逻辑组织，因而对信息的理解和保持效果较差。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }, {
							// 	"ID": 8,
							// 	"CreatedAt": "2022-08-27T23:17:57.167+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.167+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习策略",
							// 	"subDim": "调节策略",
							// 	"score": 6,
							// 	"content": "调节策略是指学习者对自己学习活动结果检查之后，发现问题时能够迅速改正、补救和调整。该项得分较高的学生通常在学习活动中发现学习计划不合理时能够及时做出调整，保持学习过程的动态性和灵活性，对于没有达到应有掌握程度的部分能够及时发现，并主动采取有效策略来提高学习效果。该项得分较低的学生通常难以对自身的学习过程保持动态的调节，不善于调整并优化学习策略。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }, {
							// 	"ID": 9,
							// 	"CreatedAt": "2022-08-27T23:17:57.17+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.17+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习策略",
							// 	"subDim": "监控策略",
							// 	"score": 6,
							// 	"content": "监控策略是指学习者对自己的学习活动进行监督，评估学习效果与学习目标和计划之间的差距，以期达到预定的学习目标。该项得分较高的学生通常在学习过程中能够时时监控自己的学习进度和学习效果，评估学习效果与目标之间差异或接近的程度，时常反思自己的学习方法是否得当，能够及时发现自己的薄弱环节，查漏补缺。该项得分较低的学生通常难以及时发现自己学习中的问题和薄弱之处，对于学习的效果缺乏清晰的评估。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }, {
							// 	"ID": 10,
							// 	"CreatedAt": "2022-08-27T23:17:57.173+08:00",
							// 	"UpdatedAt": "2022-08-27T23:17:57.173+08:00",
							// 	"dimSum": "",
							// 	"mcode": "MCODE3",
							// 	"mainDim": "学习策略",
							// 	"subDim": "计划策略",
							// 	"score": 6,
							// 	"content": "计划策略是指在学习活动之前学习者能够明确自己的学习目标，预想学习过程和学习方法并预估其有效性。该项得分较高的学生通常能够在学习之前进行有效的规划，做出适合自身情况的学习目标和计划，并能够根据学习任务的要求及时的调整学习目标和计划，以保证学习活动的有效进行。该项得分较低的学生在学习之前难以组织有效的计划与策略，对学习任务的要求和目标缺乏前瞻性的规划。",
							// 	"deleted": false,
							// 	"MiniUserEva": {
							// 		"ID": 0,
							// 		"CreatedAt": "0001-01-01T00:00:00Z",
							// 		"UpdatedAt": "0001-01-01T00:00:00Z",
							// 		"username": "",
							// 		"mcode": "",
							// 		"source": "",
							// 		"startTime": null,
							// 		"endTime": null,
							// 		"costTime": 0,
							// 		"reportUrl": "",
							// 		"reportText": "",
							// 		"score": 0,
							// 		"MiniEvaResultAnswer": null,
							// 		"MiniEvaUserDimension": null
							// 	}
							// }]
					const dimData = this.testResult.MiniEvaUserDimension
					if (!dimData[0] || !dimData[0].subDim) {
						this.level = 1
					} else {
						this.level = 2
					}
					if (this.level === 1) { // 没有子维度
						const list = dimData
						this.chartData = {
							categories: list.map(ele => {
								ele.totalScore = ele.totalScore || 10
								return ele.mainDim
							}),
							series: [
								{
									name: '分数',
									data: list.map(ele => ele.score),
								}
							]
						}
						this.options = {
							yAxis: {
								data: [{min: 0, max: list[0].totalScore}]
							},
							extra: {
								radar: {
									max: list[0].totalScore,
									// axisLabel: false
								}
							},
							// padding: [100,100,,25],
							// dataLabel: true,
							// dataPointShape: false,
							legend: {
							  show: true,
							  position: "right",
							  lineHeight: 100
							},
							title: {
								name: '标题'
							}
						}
					}
					// 处理二级数据
					const dimTitleMap = {}
					for (let item of dimData) {
						if (!dimTitleMap[item.mainDim]) {
							dimTitleMap[item.mainDim] = []
						}
						dimTitleMap[item.mainDim].push(item)
					}
					const dimDatas = []
					for (let k in dimTitleMap) {
						dimDatas.push({
							dimTitle: k,
							children: dimTitleMap[k],
							chartData: {}
						})
					}
					
					for (let item of dimDatas) {
						const list = item.children
						if (list && list.length > 0) {
							item.chartData = {
								categories: list.map(ele => {
									ele.totalScore = ele.totalScore || 10
									return ele.subDim
								}),
								series: [
									{
										name: '分数',
										data: list.map(ele => ele.score)
									}
								]
							}
							item.options = {
								yAxis: {
									data: [{min: 0, max: list[0].totalScore}]
								},
								extra: {
									radar: {
										max: list[0].totalScore
									}
								}
							}
							console.log('item.chartData', item.chartData)
						}
					}
					
					
					this.dimData = dimDatas
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
					appId: this.recInfo.appid,
					path: this.recInfo.link,
					// shortLink: this.recInfo.link,
					// extraData: {
					//   foo: 'bar'
					// },
					verify: 'binding',
					success(res) {
						console.log('打开成功')
						console.info(res);
					},
					error(e) {
						console.log('e', e)
					}
				});
			}
		},
	};
</script>

<style lang="less" scoped>
	.test-wrapper {
		.tabbar {
			position: fixed;
			width: 100%;
			bottom: 0;
			background: #fff;
		}
		.test-scroll-view {
			height: calc(100vh - 120rpx);
		}
		.contact-text {
			line-height: 120rpx;
			margin-left: 30rpx;
		}
		.contact-btn {
			float: right;
			background-color: #ffca3e;
			color: #fff;
			right: 40rpx;
			top: 25rpx;
			width: 180rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 38rpx;
			font-size: 30rpx;
			&::after {
				border: 0 none;
			}
		}
		// padding: 20rpx;
		// background: #f1f1ff;
		// // height: calc(100vh - 40rpx);
		// overflow: auto;
		.test-content {
			padding: 30rpx;
			border-radius: 20rpx;
			background: #f1f1ff;

			.block-content {
				background: #fff;
				border-radius: 20rpx;
				padding: 20rpx;
				position: relative;
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
		.sub-title {
			font-size: 34rpx;
			color: #000;
			font-weight: 500;
			// border-left: 10rpx solid #ffca3e;
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
	.charts-box {
		width: 100%;
		height: 300px;
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
