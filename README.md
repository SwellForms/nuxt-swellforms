# Nuxt SwellForms

A Nuxt 4 module for [SwellForms](https://swellforms.com). Seamlessly integrate SwellForms into your Nuxt application
with a fully-typed, auto-imported composable.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> ⚠
> This module is in early development. It is functional but the API may be subject to change in future versions. Please
> use with caution in production environments.


- [&nbsp;Release Notes](/CHANGELOG.md)

- [🏀 Online playground](https://stackblitz.com/github/SwellForms/nuxt-swellforms?file=playground%2Fapp.vue)
- [📖 &nbsp;Documentation](https://swellforms.com/learn)

## Features

- **`useSwellForm` Composable:** A reactive and intuitive way to manage form state.
- **Auto Imports:** All composables and types are automatically available in your project.
- **TypeScript Native:** Fully typed to provide the best developer experience.
- **Server & Client Ready:** Uses Nuxt's native `$fetch` for universal rendering support.
- **Lightweight:** Simply wraps the official `@swellforms/js` client without adding bloat.

## Setup

1.  Install the module and the official JS client:

    ```bash
    # Using pnpm
    pnpm add -D nuxt-swellforms @swellforms/js

    # Using yarn
    yarn add --dev nuxt-swellforms @swellforms/js

    # Using npm
    npm install --save-dev nuxt-swellforms @swellforms/js
    ```

2.  Add `nuxt-swellforms` to the `modules` section of your `nuxt.config.ts`:

    ```ts
    // nuxt.config.ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-swellforms'
      ]
    })
    ```

That's it! You can now use the `useSwellForm` composable in your pages and components.

## Usage

Here is a basic example of how to use the `useSwellForm` composable in a Vue component.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="email">Email</label>
      <input 
        id="email"
        v-model="values.email" 
        type="email"
      />
      <p v-if="errors.email">{{ errors.email[0] }}</p>
    </div>

    <button type="submit" :disabled="processing">
      {{ processing ? 'Submitting...' : 'Submit' }}
    </button>

    <p v-if="successMessage">{{ successMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Replace with your actual Form ID from Swell Forms
const FORM_ID = 'YOUR_FORM_ID_HERE' 

const { values, errors, processing, submit } = useSwellForm(FORM_ID)
const successMessage = ref('')

async function handleSubmit() {
  successMessage.value = ''
  const result = await submit()

  if (result.ok) {
    successMessage.value = 'Form submitted successfully!'
    // `result.data` contains the response from your form's webhook
    console.log('Success:', result.data) 
  } else {
    // `result.errors` contains validation errors
    console.error('Validation failed:', result.errors)
  }
}
</script>
```

### Composable API
The `useSwellForm(formId, initialValues?)` composable returns the following:

- `values`: A reactive object containing the current form field values. Use with v-model.

- `errors`: A readonly, reactive ref containing validation errors, keyed by field ID.

- `processing`: A readonly, reactive ref that is true while a network request is in progress.

- `submit()`: An async function to submit the form. Returns a SubmitResult object.

- `validate()`: An async function to validate the form without submitting. Returns a ValidateResult object.

- `fetchFields()`: An async function to dynamically fetch the form's field definitions from the API.

- `definitions`: A readonly, reactive ref containing the field definitions after fetchFields is called.
## License
[MIT License](./LICENSE) © 2025 [Keith Mifsud](https://keith-mifsud.me) and [SwellAI Ltd](https://swellai.ltd). All rights reserved.


## Contact
For any questions or issues related to SwellForms, please contact us at [Support](mailto:support@swellforms.com).

For issues related to this SDK, please open an issue on the [GitHub repository](https://github.com/SwellForms/nuxt-swellforms)


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-swellforms/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-swellforms
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-swellforms.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-swellforms
[license-src]: https://img.shields.io/npm/l/nuxt-swellforms.svg
[license-href]: https://npmjs.com/package/nuxt-swellforms
[nuxt-src]: https://img.shields.io/badge/Nuxt-00DC82?logo=nuxt.js
[nuxt-href]: https://nuxt.com
