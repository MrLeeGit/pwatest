// PWA
if ('serviceWorker' in navigator && location.href.indexOf("sinapwa=1") == -1) {
  const sendMessageToSW = msg => new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = event => {
      if (event.data.error) {
        debugger
        reject(event.data.error);
      } else {
        debugger
        resolve(event.data);
      }
    };

    navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
  });

  navigator.serviceWorker
  .register('http://127.0.0.1:8887/sw.js')
  .then(function (registration) {
      if (window.SIMA && window.SIMA.suda_count) {       
          window.SIMA.suda_count({
              'type' : 'techPwa',  //曝光的类型
              'name' : 'techPwaReg',  //当前点击的aid关键字 
              'title': '科技首页pwa注册上报日志', //中文说明
              'index': 0  //索引  如果是单个为0即可
          });
      };
      console.log('pwa注册成功');
      // if(location.href.indexOf("__pwa=1") == -1){
      // 	registration.unregister().then(function(boolean) {
      // 		if(boolean){
      // 			if (window.SIMA && window.SIMA.suda_count) {       
      // 					window.SIMA.suda_count({
      // 							'type' : 'techPwa',  //曝光的类型
      // 							'name' : 'techPwaUnreg',  //当前点击的aid关键字 
      // 							'title': '科技首页pwa注销上报日志', //中文说明
      // 							'index': 0  //索引  如果是单个为0即可
      // 					});
      // 			};
      // 			console.log("pwa注销成功")
      // 		}
      // 	});
      // } 
  })
  .then(() => sendMessageToSW('您好pwa'))
  .catch(function (err) {
    console.log("pwa错误提示",err);
  })
  this.addEventListener("active", function(event) {
    console.log("service worker is active");
  });

  window.addEventListener('message', function (e) {
    console.log(e,"来自pwa的问候哈哈哈哈")
    // logState(e.target.state);
  });
// 	var channel = new MessageChannel();
// 	channel.port1.onmessage = e => {
// 		console.log('main thread receive message...');
// 		console.log(e);
// 	}

// // port2给对方
// 	serviceWorker.postMessage('hello world!', [channel.port2]);
// 	serviceWorker.addEventListener('statechange', function (e) {
// 		// logState(e.target.state);
// 	});

}