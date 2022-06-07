<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Sluk
        </q-toolbar-title>
      <q-btn label="Register" flat color="black" @click="this.$router.push('/auth/register')"></q-btn>
      <q-btn label="Login" flat color="black" @click="this.$router.push('/auth/login')"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout'
})
</script>