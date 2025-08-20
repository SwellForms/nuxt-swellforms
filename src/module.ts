import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addTypeTemplate,
} from '@nuxt/kit'

/**
 * Interface for module options.
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

    // Resolve and add the runtime directory to the build transpile list
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // Add composables directory for auto-imports
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    // Adds the types template.
    addTypeTemplate({
      filename: 'types/nuxt-swellforms.d.ts',
      getContents: () => `
        // Re exports all types from the runtime types file
        export * from '${resolver.resolve(runtimeDir, 'types')}'
      `,
    })
  },
})
