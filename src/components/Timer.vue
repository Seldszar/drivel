<template>
  <div class="Timer">
    <div class="Timer__progress">
      <div class="Timer__gauge" v-bind:style="{ width: `${remainingPercents * 100}%` }" />
    </div>
    <div class="Timer__value">{{ remainingSeconds }}</div>
  </div>
</template>

<script>
import { differenceInMilliseconds } from "date-fns";

export default {
  props: ["createdAt", "expiresAt"],
  data() {
    return {
      remainingTime: Infinity,
    };
  },
  computed: {
    totalTime() {
      return differenceInMilliseconds(this.expiresAt.getTime(), this.createdAt.getTime());
    },
    remainingPercents() {
      return this.remainingTime / this.totalTime;
    },
    remainingSeconds() {
      return Math.floor(this.remainingTime / 1000);
    },
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      requestAnimationFrame(() => {
        this.update();
      });

      this.remainingTime = Math.max(0, differenceInMilliseconds(this.expiresAt, new Date()));
    },
  },
};
</script>

<style lang="scss">
.Timer {
  &__progress {
    align-items: stretch;
    border: 2px solid $white;
    display: flex;
    justify-content: center;
    height: 1rem;
    margin-bottom: 1rem;
  }

  &__gauge {
    background-color: $white;
  }

  &__value {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: rem-calc(31);
    font-weight: 900;
    line-height: 1;
  }
}
</style>
