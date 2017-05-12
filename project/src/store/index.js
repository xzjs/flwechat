/**
 * Created by xzjs on 2017/3/20.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': 'Bearer ' + localStorage.token
};
axios.defaults.baseURL = process.env.API_ROOT;

export default new Vuex.Store({
    state: {
        topics: [],
        userId: 0,
        articles: {},
        topic_id: 0,
        article: {user: {}, topic: {}},
        notices: []
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
        },
        setNotices(state, notices){
            state.notices = notices;
        },
        markNotices(state, index){
            state.notices.slice(index, 1);
        }
    }
    ,
    actions: {
        getTopics(context){
            axios.get('/api/topics')
                .then(function (response) {
                    context.commit('setTopics', response.data)
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        //article
        getArticle(context,data){
            axios.get('/api/articles/' + data.id)
                .then(response => {
                    context.commit('setArticle',response.data);
                })
                .catch(error=> {
                    console.log(error);
                })
        },
        getArticles(context,data){
            axios.get('/api/articles', {params: data})
                .then(response=> {
                    context.commit('setArticles',response.data);
                })
                .catch(function (response) {
                    console.log(response);
                });
        },
        //notice
        getNotices(context){
            axios.get('/api/notices')
                .then(response=> {
                    context.commit('setNotices', response.data);
                })
                .catch(error=> {
                    console.log(error);
                })
        }
    }
})