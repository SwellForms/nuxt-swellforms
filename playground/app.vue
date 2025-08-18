<template>
  <div class="font-sans bg-gray-50 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Swell Forms Demo
        </h1>
        <p class="text-gray-600 mb-6">
          This form is powered by `nuxt-swellforms`.
        </p>

        <form
          novalidate
          @submit.prevent="handleSubmit"
        >
          <div class="space-y-6">
            <!-- Name Field -->
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label>
              <input
                id="name"
                v-model="values.name"
                type="text"
                placeholder="Jane Doe"
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
              >
              <p
                v-if="errors.name"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.name[0] }}
              </p>
            </div>

            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label>
              <input
                id="email"
                v-model="values.email"
                type="email"
                placeholder="jane.doe@example.com"
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              >
              <p
                v-if="errors.email"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.email[0] }}
              </p>
            </div>

            <!-- Message Field -->
            <div>
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 mb-1"
              >Message</label>
              <textarea
                id="message"
                v-model="values.message"
                rows="4"
                placeholder="Your message..."
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                :class="errors.message ? 'border-red-500' : 'border-gray-300'"
              />
              <p
                v-if="errors.message"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.message[0] }}
              </p>
            </div>
          </div>

          <!-- Submission Button -->
          <div class="mt-8">
            <button
              type="submit"
              :disabled="processing"
              class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg
                v-if="processing"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{{ processing ? 'Submitting...' : 'Submit' }}</span>
            </button>
          </div>
        </form>

        <!-- Success/Error Message Box -->
        <div
          v-if="formMessage"
          class="mt-6 p-4 rounded-md"
          :class="isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          <p class="font-medium">
            {{ isSuccess ? 'Success!' : 'Oops!' }}
          </p>
          <p class="text-sm">
            {{ formMessage }}
          </p>
        </div>
      </div>
      <p class="text-center text-gray-500 text-xs mt-4">
        &copy;2025 Your Company. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useSwellForm } from '../src/runtime/composables/useSwellForm'

// --- IMPORTANT ---
// Replace this with your actual Form ID from Swell Forms
const FORM_ID = 'YOUR_FORM_ID_HERE'

const { values, errors, processing, submit } = useSwellForm(FORM_ID, {
  // You can provide initial values here
  name: '',
  email: '',
  message: '',
})

const formMessage = ref('')
const isSuccess = ref(false)

async function handleSubmit() {
  formMessage.value = ''
  isSuccess.value = false

  // The `submit` method returns a result object
  const result = await submit()

  if (result.ok) {
    console.log('Submission successful:', result.data)
    isSuccess.value = true
    formMessage.value = 'Thank you! Your form has been submitted successfully.'
    // Optionally reset the form
    // Object.keys(values).forEach(key => values[key] = '')
  }
  else {
    console.error('Submission failed:', result.errors)
    isSuccess.value = false
    formMessage.value = 'Please correct the errors and try again.'
  }
}

// Add Tailwind CSS to the playground for styling
useHead({
  script: [
    { src: 'https://cdn.tailwindcss.com' },
  ],
  link: [
    { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
  ],
  bodyAttrs: {
    class: 'antialiased',
  },
  htmlAttrs: {
    style: 'font-family: \'Inter\', sans-serif;',
  },
})
</script>
