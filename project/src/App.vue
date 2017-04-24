<template>
    <div>
        <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>

export default {
  name: 'app',

}
</script>
<style>
  *:focus{
    outline:none;
  }
  a{
    color: #000;
  }
</style>
