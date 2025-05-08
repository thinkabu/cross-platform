import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const ChatwootWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script>
          window.chatwootSettings = {
            locale: 'en',
            position: 'right',
          };

         (function(d,t) {
    var BASE_URL="https://app.chatwoot.com";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: 'QxNjAW7b7ucxWJngGf98bwof',
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
        </script>
      </head>
      <body></body>
    </html>
  `;
  return (
    <>
        <View style={[styles.chatContainer,{width: isOpen ? 400 : 100, height: isOpen ? height /1.5 : 100}]}>
          <WebView
            onTouchStart={() => {
                console.log(123)
                setIsOpen(true)
            }}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.webview}
          />
        </View>

    </>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    width:  60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 65,
    right: 10,
    // width: Dimensions.get('window').width * 0.9,
    // height: Dimensions.get('window').height * 0.6,
    
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 99,
    elevation: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
},
});

export default ChatwootWidget;
