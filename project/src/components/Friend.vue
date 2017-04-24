<template>
  <div>
    <index-list>
      <index-section v-for="(value, key) in map" :index="key" :key="key">
        <router-link :to="{name:'Mine',params:{id:item.id}}" v-for="item in value">
          <cell :title="item.nickname" :key="item.id">
            <img slot="icon" :src="item.head_img" width="30" height="30">
          </cell>
        </router-link>
      </index-section>
    </index-list>
  </div>
</template>

<script>
  import { IndexList, IndexSection ,Cell} from 'mint-ui';
  import {mapState} from 'vuex';
  import axios from 'axios';

  export default{
    data:function () {
      return{
        map:{},
        users:[]
      }
    },
    computed: mapState([
      'userId'
    ]),
    components:{
      "index-list":IndexList,
      "index-section":IndexSection,
      "cell":Cell
    },
    methods:{
      parseData:function () {
        var vm=this;
        axios.post('/flwechat/public/friend/get_friends',{id:this.userId,type:0})
                .then(function (response) {
                  vm.users=response.data;
                  var firstCharUpper;
                  var m={};
                  vm.users.forEach(function(item){
                    firstCharUpper = vm.getFirstUpperChar(item.nickname);
                    if (m.hasOwnProperty(firstCharUpper)) {
                      m[firstCharUpper].push(item);
                    } else {
                      m[firstCharUpper]=[item];
                    }
                  });
                  vm.map=m;
                })
                .catch(function (response) {
                  console.log(response.data);
                })
      },
      getFirstUpperChar: function(str){
        var str = String(str);
        var c = str[0];
        if (/[^\u4e00-\u9fa5]/.test(c)) {
          return c.toUpperCase();
        }
        else {
          return this.chineseToEnglish(c);
        }
      },
      chineseToEnglish: function(c){
        var idx = -1;
        var MAP = 'ABCDEFGHJKLMNOPQRSTWXYZ';
        var boundaryChar = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳';
        if (!String.prototype.localeCompare) {
          throw Error('String.prototype.localeCompare not supported.');
        }
        if (/[^\u4e00-\u9fa5]/.test(c)) {
          return c;
        }
        for (var i = 0; i < boundaryChar.length; i++) {
          if (boundaryChar[i].localeCompare(c, 'zh-CN-u-co-pinyin') >= 0) {
            idx = i;
            break;
          }
        }
        return MAP[idx];
      }
    },
    mounted:function () {
      this.parseData();
    }
  }
</script>
