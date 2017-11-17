var fs = require('fs');


function wrapPortlet(name, content) {
    return `<script> renderPortlet("${name}", "${content}") </script>`
}


module.exports = {

    get_users: () => {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve( wrapPortlet('portlet-users', 'zhangsan, lisi, wangwu, zhaoliu') )
            }, 1000)
        })
    },
    
    
    get_posts: () => {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve( wrapPortlet('portlet-posts', '可变（mutable）的 vector 或者 ArrayList 都只是数组，根据需求自动增长或者缩小。当你接受可变性(mutability)的时候，这没有问题，一切工作的很好，但是当你想要持久性（persistence）的时候，这将是个大问题。你的修改操作将变得非常缓慢，并且耗费大量的内存，因为每次修改你都不得不总是去拷贝整个数组。如果有什么办法能够在不损失查找、更新操作性能的前提下，避免数据的重复拷贝，一切将变得非常美好。而这就是 clojure persistent vector 所实现的，在平衡有序树（balanced, ordered trees)的基础上实现。') )
            }, 4000)
        })
    },
    
    
    get_hobbies: () => {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let text = '<ol>' + ['农药', '足球', '洗衣服'].map(item=>('<li>'+item+'</li>')).join('') + '</ol>'
                resolve( wrapPortlet('portlet-hobbies', text) )
            }, 2000)
        })
    },
    
    
    get_portal: () => {
        return fs.readFileSync('./static/index.html', 'utf-8');
    }

}