(function(){
    const pwaStorage = {
        isfastmode: function() {
            return (function(){
            var isfastmode =1;
            try {
                localStorage.setItem('checkfastmode', 1);
                isfastmode = 0;
            } catch (e) {
    
            }
            return isfastmode;
            })();
        },
        set: function(key, value) {
            if(this.isfastmode())return '';
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) {
            if(this.isfastmode())return '';
            return JSON.parse(localStorage.getItem(key));
        },
        remove: function(key) {
            if(this.isfastmode())return '';
            localStorage.removeItem(key);
        }
    }
    var isIntallPwa = pwaStorage.get("isIntallPwa");
    
    if(location.href.indexOf("pwa=1") != -1){
      window.isPWA = 1;
    }else if(location.href.indexOf("pwa=0") != -1){
      window.isPWA = 0;
    }
    
    if(window.isPWA){
        // 注册用户
        pwaWorkFn();
        console.log("注册用户")
    }else{
        if(isIntallPwa){
            // 注销
            pwaWorkFn(1);
            console.log("注销用户")
        }else{
            // 没执行pwa
            console.log("没执行pwa")
        }
    }
    
    function pwaWorkFn(isOff){
      // PWA
      if (window.isPWA && window.SIMA && window.SIMA.suda_count) {       
        window.SIMA.suda_count({
            'type' : 'techPwa',  //曝光的类型
            'name' : 'techPwaCount',  //当前点击的aid关键字 
            'title': '科技首页pwa灰度用户', //中文说明
            'index': 0  //索引  如果是单个为0即可
        });
      };
      const sendMessageToSW = msg => new Promise((resolve, reject) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = event => {
          // if (event.data.error) {
          //   reject(event.data.error);
          // } else {
          //   resolve(event.data);
          // }
        };
        navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
      });
      if ('serviceWorker' in navigator) {
        var isCaln = true;
        navigator.serviceWorker
        .register('./sw.js?pwa='+window.isPWA)
        .then(function (registration) {
            if (window.SIMA && window.SIMA.suda_count) {       
                window.SIMA.suda_count({
                    'type' : 'techPwa',  //曝光的类型
                    'name' : 'techPwaReg',  //当前点击的aid关键字 
                    'title': '科技首页pwa注册上报日志', //中文说明
                    'index': 0  //索引  如果是单个为0即可
                });
            };
            pwaStorage.set("isIntallPwa",1);
            console.log('pwa注册成功');
            if(isOff){
              registration.unregister().then(function(boolean) {
                if(boolean){
                  if (window.SIMA && window.SIMA.suda_count) {       
                      window.SIMA.suda_count({
                          'type' : 'techPwa',  //曝光的类型
                          'name' : 'techPwaUnreg',  //当前点击的aid关键字 
                          'title': '科技首页pwa注销上报日志', //中文说明
                          'index': 0  //索引  如果是单个为0即可
                      });
                  };
                  pwaStorage.set("isIntallPwa",0);
                  console.log("pwa注销成功")
                }
              });
            }
        })
        .then(() => sendMessageToSW("isIntallPwa"))
        .catch(function (err) {
          console.log("pwa错误提示",err);
        })
      }
    
      //接受pwa消息   
      navigator.serviceWorker.addEventListener('message', function (e) {
        console.log(e.data,"来自pwa的问候")
      });
    }
})()
