<template>
<q-page class="row items-center justify-evenly">
  <q-card square style="width: 400px; padding:50px">
    <q-card-section>
      <div class="text-h6">
        Register
      </div>
    </q-card-section>

    <q-form ref="form" class="q-gutter-md">
      <q-card-section>
          <q-input
          name="firstname"
          id="firstname"
          v-model="form.firstname"
          type="text"
          label="First Name"
          autofocus
        />
        <q-input
          name="surname"
          id="surname"
          v-model="form.surname"
          type="text"
          label="Surname"
          autofocus
        />
        <q-input
          name="nickname"
          id="nickname"
          v-model="form.nickname"
          type="text"
          label="Nickname"
          autofocus
        />

        <q-input
          name="email"
          id="email"
          v-model.trim="form.email"
          type="email"
          label="Email"
          autofocus
        />
        <q-input
          id="password"
          name="password"
          v-model="form.password"
          label="Password"
          type="password"
          bottom-slots
        >
        </q-input>
        <q-input
          id="password_confirmation"
          name="password_confirmation"
          v-model="form.passwordConfirmation"
          label="Confirm Password"
          type="password"
          bottom-slots
        >
        </q-input>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn label="Login" size="sm" flat :to="{ name: 'login' }"></q-btn>
        <q-btn
          label="Register"
          color="primary"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'RegisterPage',
  data () {
    return {
      form: {
              firstname: '',
              surname: '',
              nickname: '',
              email: '',
              password: '',
              passwordConfirmation: ''
            }
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/register', this.form).then(() => this.$router.push(this.redirectTo))
    }
  }
})
</script>