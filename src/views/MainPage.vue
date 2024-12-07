<template>
    <div class="main">
        <CreateUserForm v-if="store.isRegistered !== null && !store.isRegistered" />

        <Game v-if="store.isRegistered" />
    </div>
</template>


<script setup>
    import { ref, onBeforeMount } from 'vue'
    import { useGlobalStore } from '@/store'

    import CreateUserForm from '@/components/CreateUserForm.vue'
    import Game from '@/components/Game.vue'

    const store = useGlobalStore()

    onBeforeMount(async () => await store.checkUserAccount())
</script>


<style scoped>

</style>