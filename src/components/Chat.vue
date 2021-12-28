<template>
    <div class="lg:w-3/4 mx-auto">
        <div class="flex flex-row mb-2">
            <img :src="pineApple" alt="" v-for="i in 4" :key="i">
        </div>
        <div class="overflow-y-scroll h-96 border border-black p-5 rounded-xl">
            
            <div v-for="message in messages" :key="message" class="">
                <div v-if="message.author == 'pac'" class="flex justify-start mt-2">
                    <div class="bg-blue-500 pl-2 pr-3 pt-2 pb-1 rounded-xl">
                            <span> {{ message.text }} </span>
                            <img v-if="message.image != null && message.image != ''"  :src="message.image" alt="">
                    </div>
                </div>
                <div v-else class="flex justify-end mt-2">
                <div class=" bg-red-500 pl-3 pr-2 pt-2 pb-1 rounded-xl">
                    <span> {{ message.text }} </span>
                </div>
                </div>
            </div>
            <div ref="scrollToMe" class="my-2"></div>
        </div>
        <div class="md:w-3/4 mx-auto mt-3">
            <input v-model="currentMessage" type="text" placeholder="" class="border border-black rounded p-1 w-3/4" @keyup.enter="addMessage()"> <button class="border border-black py-1 px-3 rounded" @click="addMessage()"> send </button>
        </div>
    </div>
   
    
</template>

<script>
import {foodSuggest} from '../assets/index.js' 
import { chatNormal, suggestFood } from '../api/index.js'

export default {
    props : ["pineApple"],
    data(){
        return {
            messages: [
                { author: 'pac', text: "Chào bạn, bạn cần tư vấn đồ ăn gì không ?" , image : null},
                // { author: 'guess', text: "i need some advice" }
            ],
            switch_suggest_food : false,
            currentMessage: "",
            foodSuggest: foodSuggest
        }
    },
    methods: {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        scrollToBottom(){
            const el = this.$refs.scrollToMe;
            if (el) {
                // Use el.scrollIntoView() to instantly scroll to the element
                el.scrollIntoView({behavior: 'smooth'});
            }
        },
        get_thoi_diem(){
            const d = new Date();
            let hour = d.getHours();
            if (hour < 10){
                return "sáng"
            }else if (hour >= 10 && hour <=14){
                return "trưa"
            }else{
                return "chiều"
            }
        },
        
        getInfor(){
            var infor = localStorage.getItem('infor')
            return JSON.parse(infor)
        },
        initInfor(){
            var infor = this.getInfor()
            if (!infor){
                infor = {
                    tam_trang: "bình thường",
                    tinh_trang: "bình thường",
                    the_trang: "bình thường",
                    khau_vi:   "ngọt",
                    thoi_diem: this.get_thoi_diem(),
                }
                localStorage.setItem('infor', JSON.stringify(infor))
            }
        },
        saveInfor(sentence){
            var infor = this.getInfor()
    
            // process extract here
            for (var key in this.foodSuggest){
                if (key == "tam_trang"){
                    for (var e of this.foodSuggest.tam_trang){
                        if (sentence.includes(e)){
                            infor.tam_trang = e
                        }
                    }
                }
                if (key == "tinh_trang"){
                    for (var ee of this.foodSuggest.tinh_trang){
                        if (sentence.includes(ee)){
                            infor.tinh_trang = ee
                        }
                    }
                }
                if (key == "the_trang"){
                    for (var eee of this.foodSuggest.the_trang){
                        if (sentence.includes(eee)){
                            infor.the_trang = eee
                        }
                    }
                }
                if (key == "khau_vi"){
                    for (var eeee of this.foodSuggest.khau_vi){
                        if (sentence.includes(eeee)){
                            console.log(eeee)
                            infor.khau_vi = eeee
                        }
                    }
                }
            }

            infor = {
                tam_trang: infor.tam_trang ? infor.tam_trang : "bình thường",
                tinh_trang: infor.tinh_trang ? infor.tinh_trang : "bình thường",
                the_trang: infor.the_trang ? infor.the_trang : "bình thường",
                khau_vi: infor.khau_vi ? infor.khau_vi : "ngọt",
                thoi_diem: this.get_thoi_diem(),
            }
            console.log(infor, sentence)
            localStorage.setItem('infor', JSON.stringify(infor))
        },
        async suggestFoodProcess(){
            var answer_suggestfood = await suggestFood()
            if  (typeof answer_suggestfood === 'string' || answer_suggestfood instanceof String){
                this.messages = [...this.messages, { author:'pac', text: answer_suggestfood, image : null }]
            }else{
                for (var mess of answer_suggestfood){
                    this.messages = [...this.messages, { author:'pac', text: mess.food_name, image : mess.food_image }]
                }
            }
            return
        },
        async checkConditionAndSend(){
            if (this.messages.length > 10){
                if (Math.random() > 0.5){
                    // call api suggest food
                    await this.suggestFoodProcess()
                    return
                }
            }
            var lastMessage = this.messages.slice(-1)[0]
            console.log("last message: ",lastMessage)
            // call api chat normal
            var answer_chatnormal = await chatNormal(lastMessage.text)
            console.log(answer_chatnormal)
            if (answer_chatnormal.split(" ").slice(-1)[0].trim() == "end"){
                answer_chatnormal = answer_chatnormal.split(" ").slice(0,-1).join(" ")
                this.messages = [...this.messages, { author:'pac', text: answer_chatnormal, image : null }]
                // call api suggest food
                await this.suggestFoodProcess()
            }else{
                this.messages = [...this.messages, { author:'pac', text: answer_chatnormal, image : null }]
            }
        },
        async addMessage(){
            if (this.currentMessage != ''){
                // call method save infor
                this.saveInfor(this.currentMessage)
                // store the conversation
                this.messages = [...this.messages, { author:'guess', text: this.currentMessage, image : null }]
                // set empty string
                this.currentMessage = ''
                await this.sleep(100)
                this.scrollToBottom()

                
                // check condition and call food suggest api if valid 
                await this.checkConditionAndSend()

            }
            
        }
    },
    created(){
        this.initInfor()
    }
}
</script>