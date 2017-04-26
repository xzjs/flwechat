<template>
    <mt-cell-swipe
            title="标题文字"
            :right="[
    {
      content: 'Delete',
      style: { background: 'red', color: '#fff' },
      handler: () => this.$messagebox('delete')
    }
  ]"></mt-cell-swipe>
</template>

<script>
    export default{

    }
</script>

<style scoped>

</style>