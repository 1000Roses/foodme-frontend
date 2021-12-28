<template >
  <div class="bg-body relative">
      <div class="2xl:w-4/5 container mx-auto bg-body">
        <br>
        <div class="grid grid-cols-12 bg-post1 shadow-lg 2xl:p-10">
          <div class="lg:col-span-7 col-span-12 py-10 2xl:px-10">
            <br>
            <div class="flex md:flex-row flex-col">
              <span class="text-6xl uppercase ml-5 mt-10 font-mono font-semibold"> {{ text.target.split(" ").splice(0,1).join(" ") }} </span> 
              <div class="-mb-4 2xl:ml-2 flex flex-row">
                <img class="ml-2" v-for="i in 2" :key="i" :src="img.fruitImgs.watermelon" alt="watermelon" >
              </div>
            </div>
            
            <p class="ml-5 mt-5 md:w-3/5 text-lg font-serif font-medium leading-relaxed"> {{ text.target.split(" ").splice(1).join(" ") }} </p>
            <button class="ml-5 mt-3 py-3 px-6 bg-red-500 uppercase rounded-md hover:bg-yellow-300 hover:text-fellows transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-125 duration-300" v-if='getStartedButton' @click='transformSidebar'> Bắt đầu ngay </button>
            <p class="text-3xl uppercase ml-5 mt-10 font-mono font-semibold"> những lợi ích mà bạn có</p>
            <div class="grid grid-cols-12 mt-5 md:ml-5">
              <div class="col-span-4 flex mx-2" v-for="imgObj in img.usefulImgs" :key="imgObj">
                <div clas="flex flex-col">
                  <p class="text-center text-2xl font-serif mb-2">{{ imgObj.text }}</p>
                  <img class="rounded-lg object-contain" :src="imgObj.path" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-5 flex justify-center py-12 lg:block hidden">  
            <img class="rounded-full p-5 md:object-contain object-cover" :src="img.brainStormImg" alt="">
          </div>
        </div>
        <br>
      </div>
      <div class="lg:w-1/2 w-3/4 bg-post1 absolute top-0 h-full flex justify-center flex-col rounded ring-offset-2 ring-2 ring-red-500" :style="{left: animation.sidebarAnimation + '%', overflow: 'hidden', overflowY: 'hidden'}">
          <div >
            <Chat :pineApple="img.fruitImgs.pineapple"></Chat>
          </div>
          <button @click="transformSidebar"><font-awesome-icon icon="times" class="text-3xl absolute right-0 top-0 mr-3 mt-3" /></button>
          
      </div>
  </div>
  
</template>

<script>
import { brainStormImg, usefulImgs, fruitImgs } from '../assets/index' 
import Chat from '../components/Chat.vue'
export default {
  components: { Chat },
  data(){
    return {
      img : {
        brainStormImg: brainStormImg,
        usefulImgs : usefulImgs,
        fruitImgs : fruitImgs
      },
      text: {
        src : "Welcome Hôm nay bạn không biết ăn gì ? Bạn muốn hỏi nhưng không có ai ở đó và bạn đang muốn tìm một người bạn ngay lập tức. Yên tâm đã có Pac, Pac sẽ hỗ trợ tìm món ăn phù hợp với bạn.",
        target: ""
      },
      getStartedButton: true,
      animation: {
        sidebarAnimation: -80,
        sidebar: false,
      }
    }
  },
  methods: {
    
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async displayEachWord(obj){
      var src = obj.src.split(" ")
      console.log(src)
      obj.target = ""
      for (var word of src){
        obj.target += word + " "
        if (word.includes(".")){
          await this.sleep(1500)
        }else if (word.includes(",")){
          await this.sleep(500)
        }else{
          await this.sleep(150)
        } 
      }
    },
    async transformSidebar(){
      this.animation.sidebar = !this.animation.sidebar
      if (this.animation.sidebar){
          
          for (var i = 0; i < 90; i++){
              this.turn += 1
              this.animation.sidebarAnimation += 80/90
              await this.sleep(0.05)
          }
      }else{
          for (i = 0; i < 90; i++){
              this.animation.sidebarAnimation -= 80/90
              await this.sleep(0.05)
          }
      }
    },
  },
  async mounted(){
    await this.displayEachWord(this.text)
    await this.sleep(500)
    this.getStartedButton = true
  },
  created(){
    window.addEventListener('scroll', () => {
        if (this.animation.sidebar){
              this.transformSidebar()
          }
    });
       
  }
}
</script>