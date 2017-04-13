<template>
  <div>
    <index-list>
      <index-section index="A">
        <div>A</div>
      </index-section>
      <index-section index="B">
        <div>A</div>
      </index-section>
      <index-section index="C">
        <div>A</div>
      </index-section>
    </index-list>
  </div>
</template>

<script>
  import { IndexList, IndexSection } from 'mint-ui';

  export default{
    components:{
      "index-list":IndexList,
      "index-section":IndexSection,
    }
  }
</script>