<template>
    <div id="buttonMenu">
        <p class="button__menu__p"> {{ name }}</p>
        <svg width="128" height="50" viewBox="0 0 128 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5"
                d="M127.253 49.219H18.4583L0 30.7608V0H127.253V49.219ZM19.0732 47.7336H125.767V1.48545H1.48545V30.1428L19.0732 47.7306V47.7336Z"
                fill="#04D7F3" />
        </svg>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true
    }
});
</script>

<style lang="scss">
#buttonMenu {
    width: 8rem;
    height: 3.125;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
        opacity: 0.3;
        position: absolute;
        transform: scale(70%);
        transition: all ease-in-out 0.3s;
    }

    &:hover {
        svg {
            transition: all ease-in-out 0.3s;
            opacity: 1;
        }
    }
}

.button__menu__p {
    color: #04D7F3;
    font-size: 0.8rem;
}

#buttonMenu>p {
    margin-bottom: 0;
}

#app>section:nth-child(2)>section>div.menu__button {
    margin-top: 0.5rem;
}

#app>section:nth-child(2)>section>div.menu__button2 {
    margin-top: 0.5rem;
}
</style>