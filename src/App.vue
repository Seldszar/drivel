<template>
  <div class="App" v-bind:style="variables">
    <div class="App__question">
      <transition v-bind:css="false" v-on="{ beforeEnter, enter, leave }" mode="out-in" appear>
        <question
          v-if="isReady"
          v-bind="currentQuestion"
          v-bind:key="currentQuestion.text"
          v-on:expired="nextQuestion"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import crypto from "crypto";
import { TweenLite } from "gsap";
import lodash from "lodash";

import Question from "./components/Question.vue";

export default {
  components: {
    Question,
  },
  data() {
    return {
      isReady: false,
      background: [
        `hsl(${Math.round(Math.random() * 360)}, 42%, 42%)`,
        `hsl(${Math.round(Math.random() * 360)}, 42%, 42%)`,
      ],
      questions: [],
      questionIndex: 0,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.questionIndex];
    },
    variables() {
      return {
        "--background-gradient-start": this.background[0],
        "--background-gradient-end": this.background[1],
      };
    },
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    fetchQuestions() {
      const promise = axios.get("https://opentdb.com/api.php", {
        params: {
          amount: 1,
          type: "multiple",
          token: crypto.randomBytes().toString("hex"),
        },
      });

      this.isReady = false;

      promise.then(response => {
        const questions = [];

        lodash.forEach(response.data.results, trivia => {
          const answers = lodash.concat(
            lodash.map(trivia.incorrect_answers, answer => [answer, false]),
            [[trivia.correct_answer, true]],
          );

          questions.push({
            category: trivia.category,
            type: trivia.type,
            text: trivia.question,
            difficulty: trivia.difficulty,
            answers: lodash.shuffle(answers),
          });
        });

        this.questions = lodash.shuffle(questions);
        this.questionIndex = 0;
        this.isReady = true;
      });
    },
    nextQuestion() {
      this.questionIndex += 1;
      this.background = [
        `hsl(${Math.round(Math.random() * 360)}, 42%, 42%)`,
        `hsl(${Math.round(Math.random() * 360)}, 42%, 42%)`,
      ];

      if (this.questionIndex >= this.questions.length) {
        this.fetchQuestions();
      }
    },
    beforeEnter(element) {
      TweenLite.set(element, { opacity: 0, scale: 1.1 });
    },
    enter(element, onComplete) {
      TweenLite.to(element, 0.25, { opacity: 1, scale: 1.0, onComplete });
    },
    leave(element, onComplete) {
      TweenLite.to(element, 0.25, { opacity: 0, scale: 0.9, onComplete });
    },
  },
};
</script>

<style lang="scss">
@include foundation-global-styles;
@include foundation-typography;

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  src: url("./assets/fonts/roboto-v18-latin-700.woff2") format("woff2");
}

@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 900;
  src: url("./assets/fonts/roboto-v18-latin-900.woff2") format("woff2");
}

html,
body {
  height: 100%;
}

body {
  cursor: default;
  min-height: 100%;
  overflow: hidden;
  user-select: none;
}

.App {
  align-items: center;
  background: radial-gradient(var(--background-gradient-start), var(--background-gradient-end));
  display: flex;
  height: 100vh;
  justify-content: center;
  padding: 0 8rem;
  position: relative;
  transition: all 0.25s;

  &__question {
    width: 100%;
  }
}
</style>
