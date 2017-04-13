<template>
  <div>
    <index-list :show-indicator="false">
      <index-section index="A">
        <cell title="张艳丽">
          <img slot="icon" src="http://wx.qlogo.cn/mmopen/lRbhlKQgnGEJfqGPT2OamInAJcgmfY2k5dhTPurSXqW6QlsJkMgTn3kn8bIH4449r8oDCic9dMM7nKBeoGRj3DnTvr8ILQzfy/0" width="30" height="30">
        </cell>
      </index-section>
    </index-list>
  </div>
</template>

<script>
  import { IndexList, IndexSection ,Cell} from 'mint-ui';

  export default{
    components:{
      "index-list":IndexList,
      "index-section":IndexSection,
      "cell":Cell
    }
  }
</script>