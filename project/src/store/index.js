/**
 * Created by xzjs on 2017/3/20.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        topics:null
    },
    mutations:{
        setTopics(state,t){
            state.topics=t;
        }
    }
    ,
    actions:{
        getTopics(context){
            axios.get('/flwechat/public/topic')
                .then(function (response) {
                    context.commit('setTopics',response.data)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }
})