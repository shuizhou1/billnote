<template>
    <section class="billNoteHomePage">
      <bill-note :billNoteID="id"></bill-note>
    </section>
</template>
<script>
import billNote from './billNote'
export default {
  name: 'billNoteHomePage',
  components: {
    billNote
  },
  data() {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
<style lang="less">

</style>
