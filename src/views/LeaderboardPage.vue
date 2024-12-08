<template>
    <TopPanel />

    <section class="leaderbpard_page">
        <div class="list" v-if="!loading && items.length">
            <div class="item" v-for="(item, index) in items" :key="index">
                <div class="number"></div>

                <div class="name">{{ item.display_name }}</div>

                <div class="xp">{{ (item.experience / Math.pow(10, 3)).toFixed(0) }}</div>
            </div>
        </div>

        <div class="user_position" v-if="currentUser">
            <div class="item">
                <div class="number">{{ currentUser.position }}.</div>

                <div class="name">{{ currentUser.display_name }}</div>

                <div class="xp">{{ (currentUser.experience / Math.pow(10, 3)).toFixed(0) }}</div>
            </div>
        </div>
    </section>

    <BottomPanel />
</template>


<script setup>
    import { ref, onBeforeMount, watch, computed } from 'vue'
    import { useGlobalStore } from '@/store'

    import TopPanel from '@/components/TopPanel.vue'
    import BottomPanel from '@/components/BottomPanel.vue'


    const store = useGlobalStore(),
        items = ref([]),
        currentUser = ref(null),
        loading = ref(true),
        banned_list = [
            'neutron1839hpzzptmecu6jp5t26fc72se264lhn3kc8um',
            'neutron1ynsytv9ec0hk46slvc3kc7dlyrl74m8vw3uyy6',
            'neutron1rtgc6emj35sadvflt2aqqfkum7l0ffv44w0z24',
            'neutron12uc3rf35zchrfraznh08dwyj846clu0qu8hfnx',
            'neutron1njwf6fqgqry75fg6twewltk3w2wug3wzfs4etu',
            'neutron1c7kzwxmk5hezsu5ta0ac0j9ssn2kxmwp979mc5',
            'neutron1swu40nueyfpq6jmzhcjwpslqhm4jn4s7yflray',
            'neutron1fffeer3zcke4mclspx9fhwmk9nv8x5c0lewf8c',
            'neutron1h6u7l45nxhhdah9vl7zcml5tv5lzncf9l8f67q',
            'neutron1a8j3dqr3z73tpx9nrarxhgdqaujna4v6hx29gs',
            'neutron1dlra5w00erh7erp88yl8de3p2zz2thklzwplkd',
            'neutron1af8247ethw4pry8qrvq66k62durtspd5ycx3xp',
            'neutron1vvttpgrvfcspyhkhrt58dagql84cumjqrkklvy',
            'neutron1l477agezm7r20hnsa6npaef0r9y3pq8qe8z67f',
            'neutron18k24s927eehspnnq7hxzh8ea3t0uavjrj7v3v7',
            'neutron1f7qakg7ktd8fgjvmc764fa4h0yap2kqq4tshy0',
            'neutron1xetg6y5fx9uer4raf4caksc37gshyhj48cwule',
            'neutron1lfypvrrw8h9g7r4lxsrgxmnw2chnreevud9n98',
            'neutron1gpd5jan0ss5shufqu2ape99kyjsfyfx29tdycv',
            'neutron1pk0gdxaes763c95wsvrvgzknjs6segdswwtjjk'
        ]


    onBeforeMount(async () => {
        items.value = await store.getLeaderbpard()

        items.value = items.value.filter(el => !banned_list.includes(el.address))

        items.value.sort((a, b) => b.experience - a.experience)

        let currentUserIndex = items.value.findIndex(el => el.address === store.getUserAddress())

        currentUser.value = items.value[currentUserIndex]
        currentUser.value.position = currentUserIndex + 1

        loading.value = false
    })


    watch(computed(() => store.roundInfo.bidding_round.id), async () => {
        loading.value = true

        items.value = await store.getLeaderbpard()

        items.value = items.value.filter(el => !banned_list.includes(el.address))

        items.value.sort((a, b) => b.experience - a.experience)

        let currentUserIndex = items.value.findIndex(el => el.address === store.getUserAddress())

        currentUser.value = items.value[currentUserIndex]
        currentUser.value.position = currentUserIndex + 1

        loading.value = false
    })
</script>


<style scoped>
.leaderbpard_page
{
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    padding: 72px 10px 62px;
}


.list
{
    display: flex;
    overflow: auto;
    flex-direction: column;

    height: calc(100% - 67px);
    margin-bottom: auto;
    padding: 10px;

    counter-reset: number;

    border-radius: 12px;
    background: #001802;

    overscroll-behavior-y: contain;
    gap: 4px;
}


.item
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;

    padding: 7px 10px;

    white-space: nowrap;

    border-radius: 8px;
    background: #000e01;

    gap: 8px;
}


.item .number
{
    font-size: 18px;
    font-weight: 500;
}


.list .item .number:before
{
    content: counter(number) '.';
    counter-increment: number;
}


.list .item:nth-child(1) .number
{
    line-height: 24px;

    width: 24px;
    min-width: 24px;
    height: 24px;

    text-align: center;

    color: #fff;
    border-radius: 50%;
    background: #ffa100;
}

.list .item:nth-child(1) .number:before
{
    content: counter(number);
}


.list .item:nth-child(2) .number
{
    line-height: 24px;

    width: 24px;
    min-width: 24px;
    height: 24px;

    text-align: center;

    color: #000e01;
    border-radius: 50%;
    background: #9c9c9c;
}

.list .item:nth-child(2) .number:before
{
    content: counter(number);
}


.list .item:nth-child(3) .number
{
    line-height: 24px;

    width: 24px;
    min-width: 24px;
    height: 24px;

    text-align: center;

    color: #fff;
    border-radius: 50%;
    background: #792600;
}

.list .item:nth-child(3) .number:before
{
    content: counter(number);
}


.item .name
{
    font-size: 18px;
    font-weight: 500;

    overflow: hidden;

    width: 100%;

    text-overflow: ellipsis;
}


.item .xp
{
    font-size: 18px;
    font-weight: 500;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    gap: 4px;
}



.user_position
{
    margin-top: 10px;
    padding: 10px;

    border-radius: 12px;
    background: #001802;
}


.user_position .item
{
    box-shadow: inset 0 0 0 1px #3feb00;
}
</style>