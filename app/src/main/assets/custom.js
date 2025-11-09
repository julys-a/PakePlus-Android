console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')

    // 新增：判断是否为移动端环境（通过UserAgent识别）
    const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    
    // 定义需要外部打开的链接规则（百度网盘、夸克网盘、QQ频道）
    const needExternalOpen = () => {
        if (!origin || !origin.href) return false;
        const panDomains = ['pan.baidu.com', 'pan.quark.cn'];
        const customProtocols = ['mqqapi://'];
        return panDomains.some(domain => origin.href.includes(domain)) 
            || customProtocols.some(proto => origin.href.startsWith(proto));
    };

    if (needExternalOpen()) {
        e.preventDefault();
        // 移动端强制用系统浏览器打开，桌面端用shell.openExternal
        if (isMobile) {
            window.location.href = origin.href; // 移动端直接跳转浏览器
        } else {
            window.electron.shell.openExternal(origin.href); // 桌面端用Electron API
        }
        console.log('外部打开链接：', origin.href);
        return;
    }

    // 原有逻辑：处理_blank靶标的链接
    if ((origin && origin.href && origin.target === '_blank') || (origin && origin.href && isBaseTargetBlank)) {
        e.preventDefault()
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    const panDomains = ['pan.baidu.com', 'pan.quark.cn'];
    const customProtocols = ['mqqapi://'];
    const isPanLink = panDomains.some(domain => url.includes(domain));
    const isCustomProto = customProtocols.some(proto => url.startsWith(proto));

    if (isPanLink || isCustomProto) {
        if (isMobile) {
            window.location.href = url; // 移动端跳转浏览器
        } else {
            window.electron.shell.openExternal(url); // 桌面端用Electron API
        }
    } else {
        location.href = url;
    }
}

document.addEventListener('click', hookClick, { capture: true })