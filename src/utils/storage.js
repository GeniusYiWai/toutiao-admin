// 本地存储

//获取本地存储
export const getItem = name => {

    const data = window.localStorage.getItem(name)
    //尝试吧data转化为字符串
    try {
        //成功 直接返回
        return JSON.parse(data)

    } catch (error) {
        //失败 原样返回
        return data
    }

}
//设置本地存储

export const setItem = (name, val) => {
    //判断val是不是对象 如果是先转化为字符串
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    window.localStorage.setItem(name, val)

}
//删除本地存储
export const removeItem = name => {
    window.localStorage.removeItem(name)


}