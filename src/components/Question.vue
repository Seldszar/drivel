<template>
  <div class="Question" v-bind:class="{ 'Question--expired': isExpired() }">
    <div class="Question__category">{{ category }}</div>
    <div class="Question__text" v-html="text" />
    <div class="Question__answers">
      <div
        class="Question__answer"
        v-bind:key="index"
        v-bind:class="{
          'Question__answer--correct': answer[1],
          'Question__answer--incorrect': !answer[1],
        }"
        v-for="(answer, index) in answers"
      >
        <div class="Answer">
          <div class="Answer__index">{{ String.fromCharCode(65 + index) }}</div>
          <div class="Answer__text" v-html="answer[0]" />
        </div>
      </div>
    </div>
    <div class="Question__timer"><timer v-bind="{ createdAt, expiresAt }" /></div>
  </div>
</template>

<script>
import { addSeconds, isAfter } from "date-fns";

import Timer from "./Timer.vue";

export default {
  components: {
    Timer,
  },
  props: ["difficulty", "category", "text", "answers"],
  data() {
    return {
      createdAt: new Date(),
      expiresAt: addSeconds(new Date(), 30),
      expired: false,
    };
  },
  // computed: {
  //   isExpired() {
  //     return isAfter(new Date(), this.expiresAt);
  //   },
  // },
  mounted() {
    window.setInterval(() => this.$forceUpdate(), 25);
    window.setTimeout(() => {
      window.setTimeout(() => {
        this.$emit("expired");
      }, 5000);
    }, Math.max(0, this.expiresAt.getTime() - Date.now()));
  },
  methods: {
    isExpired() {
      return isAfter(new Date(), this.expiresAt);
    },
  },
};
</script>

<style lang="scss">
.Question {
  &__category {
    font-size: rem-calc(25);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 2rem;
    text-align: center;
    text-transform: uppercase;
  }

  &__text {
    font-size: rem-calc(48);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 4rem;
    text-align: center;
  }

  &__answers {
    display: grid;
    grid-gap: 1rem;

    @include breakpoint(large up) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__timer {
    margin-top: 4rem;
    transition: all 0.25s;
  }

  &--expired {
    .Question {
      &__answer {
        &--correct {
          .Answer {
            transform: scale(1.1);

            &__index,
            &__text {
              background-color: $white;
              color: $body-background;
            }
          }
        }

        &--incorrect {
          .Answer {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }
      }

      &__timer {
        opacity: 0;
      }
    }
  }
}

.Answer {
  font-size: rem-calc(31);
  font-weight: 900;
  height: 6rem;
  line-height: 1.1;
  transition: all 0.25s;

  &__index {
    align-items: center;
    border: 2px solid $white;
    display: flex;
    float: left;
    height: 100%;
    justify-content: center;
    margin-right: 2px;
    width: 6rem;
  }

  &__text {
    align-items: center;
    border: 2px solid $white;
    display: flex;
    flex: auto;
    height: 100%;
    justify-content: center;
    padding: 0 2rem;
    text-align: center;
  }
}
</style>
