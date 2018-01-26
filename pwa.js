(function(){
    if (!navigator || !navigator.serviceWorker || !window.MessageChannel) return '';
    
    if(location.href.indexOf("pwa=1") != -1){
      window.isPWA = 1;
    }else if(location.href.indexOf("pwa=0") != -1){
      window.isPWA = 0;
    }
    
    // 注册的方法
    function regPwaUser(){
        navigator.serviceWorker
        // .register('https://tech.sina.cn/service_worker.d.pwa?pwa='+window.isPWA)
        .register('./service_worker.d.js?pwa='+window.isPWA)
        .then(function (registration) {
            window.SIMA && window.SIMA({ 
                action : "_techPwaReg", 
                pk : '187523', 
                data :  {
                    "version" :"pwa"
                }
            })
        })
        .catch(function (err) {
            console.log("pwa错误提示",err);
        })
    }
    // 通讯方法
    const sendMessageToSW = msg => new Promise((resolve, reject) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = event => {};
        navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
    });

    function isActionRegPwa(){
        navigator.serviceWorker.getRegistration().then(function(res){
            // 是否灰度 
            if(window.isPWA){
                if(!res){
                    // 未注册用户
                    console.log("pwa注册用户")
                    regPwaUser();
                }else{
                    // 注册使用用户
                    console.log("pwa注册使用用户")
                }
            }else{
                // 注册用户
                if(res){
                    window.SIMA && window.SIMA({ 
                        action : "_techPwaUnReg", 
                        pk : '187523', 
                        data :  {
                            "version" :"pwa"
                        }
                    })
                    console.log("pwa注销成功")
                    // 注销操作
                    res.unregister();
                }else{
                    console.log("未使用pwa用户")
                }
            }
        })
    }

    // 发起通讯
    navigator.serviceWorker.ready.then(function(){
        sendMessageToSW("isIntallPwa")
    })
    
    // 页面加载完毕执行pwa代码
    window.addEventListener("load",isActionRegPwa);

    window.addEventListener('offline', function(e) {
        
        Notification.requestPermission().then(grant => {
            if (grant !== 'granted') {
                return;
            }
            const notification = new Notification("Hi，网络不给力哟", {
                body: '您的网络貌似离线了',
                icon: 'https://mjs.sinaimg.cn/wap/project/homev8/8.2.79/homev8/sina_57X57.png'
            });
    
            notification.onclick = function() {
                notification.close();
            };
        });
        location.href='https://'+location.host+'/offline.html'
    });

    //接受pwa消息   
    navigator.serviceWorker.addEventListener('message', function (e) {
        window.pwaEvent && window.pwaEvent.emit('pwa');
        if(window.sudaMapConfig){
            window.sudaMapConfig.version ="pwa"
        }
        window.SIMA && window.SIMA({ 
            action : "_techPwaLoad", 
            pk : '187523',
            data :  {
                "version" :"pwa"
            }
        })
        console.log(e.data,"来自pwa的问候")
    });
})()
