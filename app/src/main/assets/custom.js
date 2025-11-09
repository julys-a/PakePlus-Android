console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)

    // 新增：判断是否为需要外部打开的链接（QQ频道、百度网盘、夸克网盘）
    const needExternalOpen = () => {
        if (!origin || !origin.href) return false;
        // 自定义协议（QQ频道、百度网盘客户端、夸克客户端）
        const customProtocols = ['mqqapi://', 'baiduyunguanjia://', 'quark://'];
        // 网盘网页版域名
        const panDomains = ['pan.baidu.com', 'pan.quark.cn'];
        // 匹配规则：满足任一条件即外部打开
        return customProtocols.some(proto => origin.href.startsWith(proto)) 
            || panDomains.some(domain => origin.href.includes(domain));
    };

    // 优先处理需要外部打开的链接
    if (needExternalOpen()) {
        e.preventDefault(); // 阻止内置浏览器加载
        window.electron.shell.openExternal(origin.href); // 调用系统应用打开
        console.log('外部打开链接：', origin.href);
        return; // 终止后续原有逻辑
    }

    // 原有逻辑：处理_blank靶标的链接（内置浏览器打开）
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

// 重写window.open：同样加入外部打开判断
window.open = function (url, target, features) {
    console.log('open', url, target, features)
    // 新增：判断是否为需要外部打开的链接
    const customProtocols = ['mqqapi://', 'baiduyunguanjia://', 'quark://'];
    const panDomains = ['pan.baidu.com', 'pan.quark.cn'];
    const isPanLink = panDomains.some(domain => url.includes(domain));
    const isCustomProto = customProtocols.some(proto => url.startsWith(proto));

    if (isPanLink || isCustomProto) {
        window.electron.shell.openExternal(url); // 外部打开
    } else {
        location.href = url; // 原有逻辑：内置打开
    }
}

document.addEventListener('click', hookClick, { capture: true })