import { defineNuxtModule, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-swellforms',
    configKey: 'swellForms',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    const runtimeDir = resolver.resolve('./runtime')
    _nuxt.options.build.transpile.push(runtimeDir)

    // 2. Add composables for auto-imports
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    // 3. Add types for auto-imports and to `nuxt.d.ts`
    addTypeTemplate({
      filename: 'types/nuxt-swellforms.d.ts',
      getContents: () => `
        // Re-export all types from your runtime types file
        export * from '${resolver.resolve(runtimeDir, 'types')}'
      `
    })
  },

})
