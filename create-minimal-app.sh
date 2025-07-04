#!/bin/bash

# This script creates a minimal compiled app.js to ensure the app runs without errors

cat > /mnt/d/mydesk/myOpensource/shopguard-chatbot/build/app.js << 'EOL'
(function(){
  
  /******** App ********/
  var createAppHandler = function() {
    return {
      onCreate: function() {
        console.info('App onCreate');
      },
      onDestroy: function() {
        console.info('App onDestroy');
      },
      showToast: function(message) {
        var prompt = requireNative('system.prompt');
        prompt.showToast({
          message: message,
          duration: 1500
        });
      }
    };
  };
  
  /******** Home Page ********/
  var createPageHandler = function() {
    return {
      data: {
        text: 'ShopGuard AI'
      },
      onInit: function() {
        console.log('Home page loaded');
      },
      testAction: function() {
        this.$app.$def.showToast('测试成功!');
      }
    };
  };
  
  exports.default = createAppHandler();
  exports.debug = createPageHandler();
  
})();
EOL

echo "Minimal app.js file created"
