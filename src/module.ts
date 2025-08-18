import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addTypeTemplate,
} from '@nuxt/kit'

/**
 * Module options TypeScript interface definition.
 */
export interface ModuleOptions {
  /**
   * Enables or disables the module.
   * @default true
   */
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-swellforms',
    configKey: 'swellForms',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
  },
  setup(options, nuxt) {
    // Disable the module if the enabled option is false
    if (options.enabled === false) {
      return
    }

    const resolver = createResolver(import.meta.url)

    // 1. Point to the runtime directory
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // 2. Add composables for auto-imports
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    // 3. Add types for auto-imports and to `nuxt.d.ts`
    addTypeTemplate({
      filename: 'types/nuxt-swellforms.d.ts',
      getContents: () => `
        // Re-export all types from your runtime types file
        export * from '${resolver.resolve(runtimeDir, 'types')}'
      `,
    })
  },
})
