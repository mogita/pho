<template>
  <div class="container">
    <div class="background"></div>
    <div class="white-overlay login-wrapper">
      <div class="branding">
        <h1>Pho</h1>
        <h4>Delicious Pho for Fanfou</h4>
      </div>
      <div class="login-box">
        <div class="input">
          <input type="text" v-model="username" placeholder="用户名" @keydown.enter="focusPassword" v-focus>
        </div>
        <div class="input">
          <input type="password" v-model="password" placeholder="密码" @keydown.enter="doLogin" ref="passwordInput">
        </div>
        <div class="input">
          <div class="blue-button" @click="doLogin">
            登录
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  computed: {},

  data () {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    async doLogin () {
      if (this.$data.username.length > 0 && this.$data.password.length > 0) {
        if (await this.$pho.login(this.$data.username, this.$data.password)) {
          this.$data.username = ''
          this.$data.password = ''
          this.$bus.$emit('timeline.home.fetch')
        }
      }
    },

    focusPassword () {
      if (this.$data.username.length > 0) {
        this.$refs.passwordInput.focus()
      }
    }
  },
  mounted () {},
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/button';

.container {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

.background {
  background: url('./../../assets/images/upwind.jpg') no-repeat;
  background-size: cover;
  background-position: center top;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  filter: blur(3px);
}

.login-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.login-wrapper:not(input) {
  user-select: none;
  cursor: default;
}

.branding {
  width: 400px;
  align-self: center;
  margin-bottom: 30px;
  margin-top: -150px;
}

.login-box {
  width: 400px;
  align-self: center;

  input {
    width: 376px;
    font-size: 16px;
    height: 50px;
    border: none;
    padding: 0 12px;
  }

  .blue-button {
    margin-top: 20px;
    height: 30px;
  }
}
</style>
