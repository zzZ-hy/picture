import { reject, resolve } from "core-js/fn/promise"

export default (params)=>{
    
    //  加载中效果
    uni.showLoading({
        title: "加载中"
    })

    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            success(res){
                resolve(res.data)
            },
            fail(err){
                reject(err)
            },
            complete(){
                uni.hideLoading()
            }
        })
    })
}