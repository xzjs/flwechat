/**
 * Created by xzjs on 2017/3/20.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        topics:null,
        userId:0,
        articles:null,
        topic_id:0,

    },
    mutations:{
        setTopics(state,t){
            state.topics=t;
        },
        setUserId(state,id){
            state.userId=id;
        },
        setArticles(state,articles){
            state.articles=articles;
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
        },
        getArticles(context,postData){
            axios.post('/flwechat/public/article/article_list', postData)
                .then(
                    function (response) {
                        context.commit('setArticles',response.data);
                    })
                .catch(
                    function (response) {
                        console.log(response);
                    }
                );
        }
    }
})