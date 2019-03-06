import { Registries } from '@pnpm/types'
import { DEFAULT_REGISTRIES, normalizeRegistries } from '@pnpm/utils'
import path = require('path')
import { ReporterFunction } from '../types'

export interface StoreStatusOptions {
  lockfileDirectory?: string,
  prefix?: string,
  store: string,
  independentLeaves?: boolean,
  force?: boolean,
  forceSharedShrinkwrap?: boolean,
  registries?: Registries,
  shrinkwrap?: boolean,

  reporter?: ReporterFunction,
  production?: boolean,
  development?: boolean,
  optional?: boolean,
  bin?: string,
  shamefullyFlatten?: boolean,
}

export type StrictStoreStatusOptions = StoreStatusOptions & {
  lockfileDirectory: string,
  prefix: string,
  store: string,
  independentLeaves: boolean,
  force: boolean,
  forceSharedShrinkwrap: boolean,
  registries: Registries,
  bin: string,
  shrinkwrap: boolean,
  shamefullyFlatten: boolean,
}

const defaults = async (opts: StoreStatusOptions) => {
  const prefix = opts.prefix || process.cwd()
  const lockfileDirectory = opts.lockfileDirectory || prefix
  return {
    bin: path.join(prefix, 'node_modules', '.bin'),
    force: false,
    forceSharedShrinkwrap: false,
    independentLeaves: false,
    lockfileDirectory,
    prefix,
    registries: DEFAULT_REGISTRIES,
    shamefullyFlatten: false,
    shrinkwrap: true,
    store: opts.store,
  } as StrictStoreStatusOptions
}

export default async (
  opts: StoreStatusOptions,
): Promise<StrictStoreStatusOptions> => {
  if (opts) {
    for (const key in opts) {
      if (opts[key] === undefined) {
        delete opts[key]
      }
    }
  }
  const defaultOpts = await defaults(opts)
  const extendedOpts = { ...defaultOpts, ...opts, store: defaultOpts.store }
  extendedOpts.registries = normalizeRegistries(extendedOpts.registries)
  return extendedOpts
}
