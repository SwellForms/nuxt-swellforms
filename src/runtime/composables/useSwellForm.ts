import { ref, reactive, readonly, type Ref } from 'vue'
import { SwellForm, type SubmitResult, type ValidateResult, type FormField, type Json } from '@swellforms/js'
import { useNuxtApp } from '#app'

/**
 * A reactive Nuxt composable for interacting with the Swell Forms API.
 *
 * @param formId The ID of the form you want to interact with.
 * @param initialValues Optional initial values for the form fields.
 * @returns A reactive API for managing form state and submissions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSwellForm(formId: string, initialValues: Record<string, any> = {}) {
  const { $fetch } = useNuxtApp()

  // Create a non-reactive instance of the SwellForm class.
  // This instance will manage the core logic, while we expose its state
  // through reactive Vue refs.
  const form = new SwellForm(formId, initialValues)

  // Reactive state exposed to the user
  const values = reactive(form.getFields())
  const errors = ref(form.getFormErrors())
  const processing = ref(form.isProcessing())
  const definitions: Ref<FormField[]> = ref([])

  /**
   * Syncs the internal reactive state with the state from the SwellForm instance.
   */
  const syncState = () => {
    // Sync values (less critical as setField handles it)
    Object.assign(values, form.getFields())
    // Sync errors
    errors.value = form.getFormErrors()
    // Sync processing state
    processing.value = form.isProcessing()
  }

  /**
   * Sets the value for a specific field and clears its associated error.
   * @param id The field ID.
   * @param value The new value for the field.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setField = (id: string, value: any) => {
    form.setField(id, value)
    // Directly update the reactive values object
    values[id] = value
    syncState()
  }

  /**
   * Fetches the form's field definitions from the API to dynamically render a form.
   * @returns A promise that resolves with the array of form fields.
   */
  const fetchFields = async (): Promise<FormField[]> => {
    // FIX: Cast $fetch to the type expected by the library
    const fields = await form.fetchFields($fetch as typeof fetch)
    definitions.value = fields
    syncState()
    return fields
  }

  /**
   * Validates the form data against the server.
   * @param opts Optional object to specify which fields to validate.
   * @param opts.only Optional array of field names to validate.
   * @returns A promise that resolves with the validation result.
   */
  const validate = async (opts?: { only?: string[] }): Promise<ValidateResult> => {
    // FIX: Cast $fetch to the type expected by the library
    const result = await form.validate(opts, $fetch as typeof fetch)
    syncState()
    return result
  }

  /**
   * Submits the form data to the server.
   * @param overrides Optional object to override field values just for this submission.
   * @param overrides.fields Optional record of fields to override.
   * @returns A promise that resolves with the submission result.
   */
  const submit = async <T = unknown>(overrides?: { fields?: Record<string, Json> }): Promise<SubmitResult<T>> => {
    // FIX: Cast $fetch to the type expected by the library
    const result = await form.submit<T>(overrides, $fetch as typeof fetch)
    syncState()
    return result
  }

  return {
    // --- Reactive State ---
    /**
     * A reactive object containing the current form field values.
     * Use with v-model in your templates.
     */
    values,
    /**
     * A reactive ref containing any validation errors, keyed by field ID.
     */
    errors: readonly(errors),
    /**
     * A reactive ref that is true while a network request (validate/submit) is in progress.
     */
    processing: readonly(processing),
    /**
     * A reactive ref containing the form field definitions, populated after calling `fetchFields`.
     */
    definitions: readonly(definitions),

    // --- Methods ---
    setField,
    fetchFields,
    validate,
    submit,

    // --- Helpers ---
    /**
     * A direct, non-reactive reference to the underlying SwellForm instance
     * for advanced use cases.
     */
    formInstance: form,
  }
}
