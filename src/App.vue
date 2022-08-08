<template>
  <div class="container">
    <video-player
      class="video-player"
      ref="videoPlayer"
      :options="options"
      :playsinline="true"
    ></video-player>
  </div>
</template>
<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
export default {
  name: 'App',
  components: {
    videoPlayer,
  },
  data() {
    return {
      options: {
        autoplay: true,
        controls: false,
        preload: 'none',
        muted: false,
        // aspectRatio: '16:9',
        language: 'zh-CN',
        sources: [{
          type: 'rtmp/mp4',
          src: 'rtmp://127.0.0.1/live/test',
        }],
        techOrder: ['flash', 'html5'],
        poster: '',
        notSupportedMessage: '服务错误', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      isMini: false,
    }
  },
  mounted(){
    this.checkFlash()
    console.log(navigator.plugins)
  },
  methods: {
    //检查flash是否开启
    checkFlash(){
      let flag = false;
      if(window.ActiveXObject){
        try{
          let swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
          if(swf){
            flag = true;
          }
        }catch(e){
        }
      }else{
        try{
          let swf = navigator.plugins['Shockwave Flash'];
          if(swf){
            flag = true;
          }
        }catch(e){
        }
      }
      if(flag){
        console.log("flash running ok");
      }else{
        console.log("flash running error");
        this.spinning = false
      }
    },
  }
}
</script>
<style>
html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

body {
  -webkit-app-region: drag;
}

.container {
  background: transparent;
}

.container,
.video-player,
.video-js {
  width: 100%;
  height:100%;
}
</style>
