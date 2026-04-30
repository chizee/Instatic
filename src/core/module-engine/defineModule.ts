import type {
  ModuleDefinition,
  ModuleField,
  ModuleFields,
  ModuleStyleBinding,
  ModuleStyleBindings,
  PropertyControl,
  PropertySchema,
} from './types'

type DefineModuleInput<TProps extends Record<string, unknown>> =
  Omit<ModuleDefinition<TProps>, 'schema' | 'classStyleBindings'> & {
    fields?: ModuleFields
    schema?: PropertySchema
    classStyleBindings?: ModuleStyleBindings
  }

export function propField(control: PropertyControl): ModuleField {
  return { kind: 'prop', control }
}

export function styleField(binding: ModuleStyleBinding): ModuleField {
  return { kind: 'style', ...binding }
}

export function defineModule<TProps extends Record<string, unknown>>(
  definition: DefineModuleInput<TProps>,
): ModuleDefinition<TProps> {
  const schema: PropertySchema = { ...(definition.schema ?? {}) }
  const classStyleBindings: ModuleStyleBindings = { ...(definition.classStyleBindings ?? {}) }

  for (const [key, field] of Object.entries(definition.fields ?? {})) {
    if (field.kind === 'prop') {
      schema[key] = field.control
    } else {
      classStyleBindings[key] = {
        properties: field.properties,
        label: field.label,
        control: field.control,
        defaultValue: field.defaultValue,
        toCSS: field.toCSS,
        fromCSS: field.fromCSS,
        isSet: field.isSet,
      }
    }
  }

  return {
    ...definition,
    schema,
    classStyleBindings,
  }
}
