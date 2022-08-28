<template>
	<view class="answer__content">
		<view class="precent-wrapper">
			<text class="precent-text">{{showQuestionIndex}}/{{questionSum}}</text>
			<progress :percent="percent" class="precent" activeColor="#55557f"></progress>
		</view>
		<view class="time" v-if="count">
			<image src="../../static/images/index/btn_07_time.png" class="timer-image"></image>
			{{count}}s
		</view>
		<view
			:class="['answer__question', switchVisible ? 'question--find-out' : 'question--find-in']"
			v-if="newOptList.length"
		>
			<view class="question_title">
				<view class="title__number">{{ showQuestionIndex + 1 }}.</view>
				<view>
					（{{ getQuestionType(newOptList[showQuestionIndex].type) }})
					{{ newOptList[showQuestionIndex].title }}
				</view>
			</view>
			<view v-if="newOptList[showQuestionIndex].imageList.length && !hideImage" class="image-box">
				<block v-for="(item, index) in newOptList[showQuestionIndex].imageList" :key="index">
						<image :src="item" mode="aspectFit"></image>
				</block>
			</view>
			<view class="question_subtitle"  v-if="newOptList[showQuestionIndex].desc && !hideImage">
				{{ newOptList[showQuestionIndex].desc }}
			</view>
			<view class="question_subtitle" v-if="newOptList[showQuestionIndex].subtitle && showAnswer">
				{{ newOptList[showQuestionIndex].subtitle }}
			</view>
			<view class="question__option" v-if="showAnswer">
				<block v-if="selectKey.includes(newOptList[showQuestionIndex].type)">
					<block v-for="(item, index) in newOptList[showQuestionIndex].question_option" :key="index">
						<view
							:style="item.active ? optActiveStyle : optStyle"
							class="question__option__item"
							@tap.stop="checkOption($event)"
							:data-id="item.id"
						>
							<view class="question__option__item__number" v-if="item.name">{{ item.name }} .</view>
							<view v-if="item.picUrl">
								<image :src="item.picUrl" mode="aspectFit" class="image_content"></image>
							</view>
							<view v-else-if="item.content.startsWith('https') || item.content.startsWith('http')">
								<image :src="item.content" mode="aspectFit" class="image_content"></image>
							</view>
							<view v-else-if="item.content">{{ item.content }}</view>
						</view>
					</block>
					<view class="btn-flex-box">
						<button
							v-if="showQuestionIndex > 0" 
							class="prev-button"
							@click="prevQuestion"
						>上一题</button>
						<button 
							v-if="newOptList[showQuestionIndex].type == 'checkbox'" 
							@click="nextQuestionBtn()"
							class="next-button" 
						>下一题</button>
					</view>
					
				</block>
				
				<block v-else-if="newOptList[showQuestionIndex].type == 'write'">
					<view class="item__key__box">
						答案：
						<input
							class="write_input"
							placeholder="请填写你的答案"
							v-model="newOptList[showQuestionIndex].question_key"
						/>
					</view>
				</block>
			</view>
			<view class="">
				<button
					v-show="count"
					class="prev-button"
					@click="clearTimeCount"
				>开启答题</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		questionList: {
			//数据列表
			type: Array,
			default: () => []
		},
		colorStyle: {
			type: Object,
			default: () => {}
		},
		warningTips: {
			type: String,
			default: '请先作答哦~'
		},
		currentIndex: {
			type: Number,
			require: true
		},
		questionSum: {
			type: Number,
			require: true
		},
		resultInfo: {
			type: Array, 
			default: []
		}
	},
	data() {
		return {
			colorMap: {
				nextBac: '#CCCCCC',
				nextCol: '#FFFFFF',
				optBac: '#eee',
				optCol: '#2b2531',
				optBacActive: '#55557f',
				optColActive: '#fff'
			},
			selectKey: ['radio', 'checkbox'],
			newOptList: [], //初始化数据
			showQuestionIndex: 0, //当前展示题号
			isEnd: false, //是否为最后一题
			switchVisible: false, // 切换状态
			count: 0,
			timer: null,
			showAnswer: true,
			hideImage: false,
			startIndex: 0,
			nextFlag: false
		}
	},
	watch: {
		questionList() {
			this.initData()
		},
		showQuestionIndex() {
			clearInterval(this.timer);
			this.count = this.newOptList[this.showQuestionIndex].countTime || 0;
			if(this.count) {
				this.showAnswer = false;
				this.verification();
			}
		}
	},
	computed: {
		nextStyle() {
			return `background:${this.colorMap.nextBac};color:${this.colorMap.nextCol};`
		},
		optStyle() {
			return `background:${this.colorMap.optBac};color:${this.colorMap.optCol};`
		},
		optActiveStyle() {
			return `background:${this.colorMap.optBacActive};color:${this.colorMap.optColActive};`
		},
		percent() {
			return Math.floor(this.showQuestionIndex / this.questionSum * 100);
		}
	},
	mounted() {
		this.initData()
		this.colorMap = this.deepMerge(this.colorMap, this.colorStyle);
		this.count = this.newOptList[this.showQuestionIndex]?.countTime || 0;
		if(this.count) {
			this.showAnswer = false;
			this.verification();
		}
	},
	beforeDestroy() {
		console.log('beforeDestroy', '非正常退出')
		const opt = {
			current_id: this.showQuestionIndex,
			isNormal: true
		}
		this.formatKey(opt)
	},
	onHide() {
		console.log('==============onHide')
	},
	methods: {
		prevQuestion() {
			this.showQuestionIndex--;
			this.startIndex = Math.min(this.showQuestionIndex, this.startIndex);
		},
		verification() {
		  // this.clearTimeCount()
		  this.timer = setInterval(() => {
			this.count--;
			if (this.count <= 0) {
			  this.clearTimeCount()
			}
		  }, 1000); 
		},
		clearTimeCount() {
			clearInterval(this.timer);
			// 显示题目和按钮, 隐藏图片
			this.showAnswer = true;
			this.hideImage = true;
			this.timer = null
			this.count = 0
		},
		initData() {
			for(let i = 0; i < this.resultInfo.length; i++) {
				const question = this.questionList.find(v => v.code === this.resultInfo[i].tcode);
				if(!question) continue;
				question.question_option.map(item => {
					const ocodes = this.resultInfo[i].ocode.split(';');
					if(ocodes.indexOf(item.code) !== -1){
						item.active = true
					}
				})
			}
			this.showQuestionIndex = this.currentIndex;
			this.startIndex = this.currentIndex;
			if (Array.isArray(this.questionList)) {
				this.newOptList = this.deepClone(this.questionList)
				if (this.newOptList.length === 1) this.isEnd = true
			}
		},
		// 深度克隆 对象
		deepClone(obj) {
			// 对常见的“非”值，直接返回原来值
			if ([null, undefined, NaN, false].includes(obj)) return obj
			if (typeof obj !== 'object' && typeof obj !== 'function') {
				//原始类型直接返回
				return obj
			}
			var o = Array.isArray(obj) ? [] : {}
			for (let i in obj) {
				if (obj.hasOwnProperty(i)) {
					o[i] = typeof obj[i] === 'object' ? this.deepClone(obj[i]) : obj[i]
				}
			}
			return o
		},
		// 深度合并 对象
		deepMerge(target = {}, source = {}) {
			target = this.deepClone(target)
			if (typeof target !== 'object' || typeof source !== 'object') return false
			for (const prop in source) {
				if (!source.hasOwnProperty(prop)) continue
				if (prop in target) {
					if (typeof target[prop] !== 'object') {
						target[prop] = source[prop]
					} else {
						if (typeof source[prop] !== 'object') {
							target[prop] = source[prop]
						} else {
							if (target[prop].concat && source[prop].concat) {
								target[prop] = target[prop].concat(source[prop])
							} else {
								target[prop] = this.deepMerge(target[prop], source[prop])
							}
						}
					}
				} else {
					target[prop] = source[prop]
				}
			}
			return target
		},
		// 获取题目类型
		getQuestionType(code) {
			let name = '问题'
			switch (code) {
				case 'write':
					name = '填空'
					break
				case 'radio':
					name = '单选'
					break
				case 'checkbox':
					name = '多选'
					break
			}
			return name
		},
		// 选择答案
		checkOption(e) {
			//选择事件-防抖
			if (this.nextFlag) {
				return
			}
			this.nextFlag = true
			setTimeout(() => {
				this.nextFlag = false
			}, 600)
			let checkOpt = this.newOptList[this.showQuestionIndex]
			this.checkActive(e.currentTarget.dataset.id);
			if(checkOpt.type === 'radio'){
				this.nextQuestionBtn()
			}
		},
		checkActive(_id) {
			//选择答案事件处理
			let newOpt = this.newOptList
			let checkOpt = newOpt[this.showQuestionIndex].question_option
			if (newOpt[this.showQuestionIndex].type == 'radio') {
				checkOpt.map((item, i) => {
					if (item.id == _id) {
						item.active = !item.active
					} else {
						item.active = false
					}
				})
			} else if (newOpt[this.showQuestionIndex].type == 'checkbox') { 
				checkOpt.map((item, i) => {
					if (item.id == _id) {
						item.active = !item.active
					}
				})
			}
			this.newOptList = newOpt
		},
		//下一题
		nextQuestionBtn() {
			// 查看是否有选择答案
			const activeItem = this.newOptList[this.showQuestionIndex].question_option.filter(item => item.active);
			if(!activeItem.length){
				return;
			}
			this.hideImage = false;
			//构建返回数据
			let opt = {
				current_id: this.showQuestionIndex,
				isEnd: this.isEnd
			}
			if (!this.isEnd) {
				this.switchQuestion()
			} else {
				return this.formatKey(opt)
			}
			

			
		},
		// 切换题目
		switchQuestion() {
			this.switchVisible = true
			let timer = setTimeout(() => {
				clearTimeout(timer)
				let newList = this.newOptList
				if (this.showQuestionIndex < newList.length - 1) {
					this.showQuestionIndex = this.showQuestionIndex + 1
					if (this.showQuestionIndex == newList.length - 1) this.isEnd = true
					this.switchVisible = false
				}
			}, 300)
		},
		//答案整理返回
		formatKey(opt) {
			console.log('format')
			let newAnswer = []
			let newList = this.newOptList
			let formatCheck_res = []
			newList.forEach((item, i) => {
				let key_res = []
				let test_item = {
					id: item.id,
					keyFormat: []
				}
				let test = []
				if (item.type == 'write') {
					key_res.push(item.question_key.trim())
					test_item.keyFormat.push(item.question_key.trim())
				} else {
					item.question_option.forEach((item_s, i_s) => {
						if (item_s.active) {
							key_res.push(item_s)
							test_item.keyFormat.push(item_s.id)
						}
					})
				}
				formatCheck_res.push(test_item)
				newAnswer.push({
					id: item.id,
					type: item.type,
					number: item.number,
					title: item.title,
					keyRes: key_res,
					code: item.code
				})
			})
			opt.checkRes = {
				check_res: newAnswer,
				keyFormat: formatCheck_res
			}
			opt.startIndex = this.startIndex;
			this.$emit('confrim', opt)
		}
	}
}
</script>

<style lang="scss" scoped>
view {
	box-sizing: border-box;
}

.answer__content {
	width: 100%;
	min-height: 100vh;
	padding-bottom: 80rpx;
}

.answer__banner {
	width: 100%;
	height: 388rpx;
}

.answer__banner swiper,
.answer__banner swiper swiper-item {
	width: 100%;
	height: 100%;
}

.answer__banner swiper swiper-item image {
	width: 100%;
	height: 100%;
}

.answer__question {
	width: 100%;
	padding: 0 50rpx 100rpx;
	margin-top: 30rpx;
}

.answer__question .question_title {
	display: flex;
	width: 100%;
	font-size: 36rpx;
}

.answer__question .title__number {
	padding-top: 0rpx;
	min-width: 34rpx;
}

.answer__question .question__option {
	width: 100%;
	margin-top: 13rpx;
}

.answer__question .question__option__item {
	display: flex;
	width: 100%;
	padding: 23rpx 98rpx;
	margin-top: 34rpx;
	font-size: 34rpx;
	color: #232131;
	background: #eeb67a;
	border-radius: 14rpx;
	overflow: hidden;
}

.answer__question .question__option__item .question__option__item__number {
	padding-top: 4rpx;
	margin-right: 10rpx;
}
.image_content {
	height: 100rpx;
	width: 200px;
}
.answer__next__btn {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	color: #ffffff;
	font-size: 30rpx;
	text-align: center;
	background: #c9784f;
}

.question__option__active {
	color: #ffffff !important;
	background-color: #c9784f !important;
}

.item__key__box {
	display: flex;
	width: 100%;
	margin-top: 30rpx;

	.write_input {
		width: 400rpx;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		border-bottom: 1rpx solid #999999;
	}
}

.question--find-out {
	transform: translateX(-100%);
	transition: all 0.3s;
}
.time {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 40rpx;
}
.timer-image {
	width: 50rpx;
	height: 50rpx;
}
.precent-wrapper {
	display: flex;
	padding: 30rpx;
}
.precent-text {
	font-size: 36rpx;
}
.precent {
	margin-left: 30rpx;
	width: 100%;
}
.btn-flex-box {
	display: flex;
	justify-content: space-between;
}
.next-button {
	background-color: #55557f;
	margin-top: 50rpx;
	color: #fff;
	font-size: 34rpx;
}
.prev-button {
	background-color: #55557f;
	margin-top: 50rpx;
	color: #fff;
	font-size: 34rpx;
	width: 200rpx;
}
.question_subtitle {
	font-size: 34rpx;
	margin-top: 20rpx;
}
.image-box {
	display: flex;
	justify-content: space-around;
}
</style>
