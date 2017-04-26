/**
 * Created by xzjs on 2017/3/20.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        topics: null,
        userId: 0,
        articles: null,
        topic_id: 0,
        article: {user:{},topic:{}}
    },
    mutations: {
        setTopics(state, t){
            state.topics = t;
        },
        setUserId(state, id){
            state.userId = id;
        },
        setArticles(state, articles){
            state.articles = articles;
        },
        setArticle(state, article){
            state.article = article;
        }
    }
    ,
    actions: {
        getTopics(context){
            axios.get('/flwechat/public/topic')
                .then(function (response) {
                    context.commit('setTopics', response.data)
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getArticles(context, postData){
            axios.post('/flwechat/public/article/article_list', postData)
                .then(
                    function (response) {
                        context.commit('setArticles', response.data);
                    })
                .catch(
                    function (response) {
                        console.log(response);
                    }
                );
        },
        getArticle(context, postData){
            axios.post('/flwechat/public/article/get_article',
                {article_id: postData.article_id, user_id: context.state.userId})
                .then(
                    function (response) {
                        context.commit('setArticle',response.data);
                    }
                ).catch(
                function (error) {
                    console.log(error);
                }
            )
        }
    }
})