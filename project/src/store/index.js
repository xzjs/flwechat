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
        articles: [],
        topic_id: 0,
        article: {user: {}, topic: {}, agrees: [], opposes: [], comments: []},
        notices: [],
        currentPage: 1,
        nextPage: null,
        wait: false,
        user: {},
        url: process.env.API_ROOT
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
        markNotice(state, index){
            state.notices.splice(index, 1);
        },
        addNotice(state, notice){
            state.notices.push(notice);
        },
        setCurrentPage(state, index){
            state.currentPage = index;
        },
        setNextPage(state, index){
            state.totalPage = index;
        },
        attachArticles(state, articles){
            state.articles = state.articles.concat(articles);
        },
        setWait(state, status){
            state.wait = status;
        },
        //user
        setUser(state, user){
            state.user = user;
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
        getArticle(context, data){
            axios.get('/api/articles/' + data.id)
                .then(response => {
                    context.commit('setArticle', response.data);
                })
                .catch(error=> {
                    console.log(error);
                })
        },
        getArticles(context, data){
            if (context.state.wait)
                return;
            context.commit('setWait', true);
            axios.get('/api/articles', {params: data})
                .then(response=> {
                    console.log(response.data);
                    var str = response.data.next_page_url;
                    if (str == null) {
                        context.commit('setNextPage', null);
                    } else {
                        context.commit('setNextPage', str.charAt(str.length - 1));
                    }
                    context.commit('setCurrentPage', response.data.current_page);

                    if (data.page == null) {
                        context.commit('setArticles', response.data.data);
                    } else {
                        context.commit('attachArticles', response.data.data);
                    }
                    context.commit('setWait', false);
                })
                .catch(function (response) {
                    console.log(response);
                });
        },
        //notice
        getNotices(context){
            return axios.get('/api/notices')
                .then(response=> {
                    context.commit('setNotices', response.data);
                })
        },
        //user
        getUser(context, data){
            return axios.get('/api/users/' + data.id)
                .then(response=> {
                    context.commit('setUser', response.data);
                })
        }
    }
})