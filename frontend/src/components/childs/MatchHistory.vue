<template>
    <div class="match">
        <div class="game__mode">
            <p>Solo Local</p>
            <p class="opponent">Vs gmallet</p>
        </div>
        <div class="result">
            <p>Victory</p>
            <p>3 - 2</p>
        </div>
        <div class="line"></div>
    </div>
</template>

<script setup>

</script>

<style lang="scss">
.match {
    width: 25rem;
    height: 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #04D7F3;
    border-radius: 0.5rem;

    p {
        color: #04D7F3;
        letter-spacing: 0.15rem;
        margin: 0;
    }

    .game__mode {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;

        .opponent {
            font-size: 0.65rem;
        }
    }

    .result {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }
}
</style>