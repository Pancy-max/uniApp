
import { Base64 } from './base64.js'
export default function(obj){
	// 将baseurl从 config 中解构出来
	const  { baseURL } = obj;  // 在ming。js中传入的参数
	
	// 调用函数让vue。use调用
	return function ( vue ){
		
		// 给vue添加个request方法，通过this.request调用方法
		vue.prototype.request = async function(params){
			const { url ,data , method, headers  } = params 
			let header = {'Content-Type': 'application/json; charset=utf-8'}
			let userInfo = uni.getStorageSync('myinfo');
			let user_id = '';
			if (userInfo && userInfo.user) {
				let token = userInfo.token;
				let openid = userInfo.user.weixinOpenid;
				user_id = userInfo.user.uuid;
				header.authentication = 'USERID '+ Base64.encode(openid+':'+token+':'+user_id)
				header['x-token'] = userInfo.token
			}
			
			// uni.showLoading({
			// 	title:'加载中'
			// })
			const [ err,res ] = await uni.request({
				url: baseURL + url ,
				header: headers || header,
				data:data,
				method:method
			});
			if (res.data && res.data.code === 7 && (!url.includes('login') && !url.includes('register'))){
				uni.showToast({
					title: res.data.msg,
					icon: "none"
				})
				if(res.data.msg.includes('未登录')){
					setTimeout(() => {
						uni.clearStorageSync()
						uni.reLaunch({
							url: '/pages/login/index'
						})
					}, 1000)
				}
				this.userInfo = ''
				return 
			} else {
				return res.data;	
			}
		}
	}
}