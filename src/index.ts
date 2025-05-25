import {ZodObject, ZodType, z} from 'zod';

export default class EnvironmentManager<T extends ZodType<any, any, any>> {
  private schema: T;

  constructor(schema: T) {
    this.schema = schema;
    this.validateEnv();
  }

  check(): void {
    const missingKeys: string[] = [];

    if (this.schema instanceof ZodObject) {
      const schemaKeys = Object.keys(this.schema.shape);

      for (const key of schemaKeys) {
        if (!(key in process.env) || process.env[key] === '') {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        const message = `❌ Failed - Missing env vars - ${missingKeys.join(', ')}`;
        throw new Error(message);
      }
    } else {
      throw new Error('Schema must be an object type (z.object()).');
    }
  }

  private validateEnv(): void {
    const parsed = this.schema.safeParse(process.env);

    if (!parsed.success) {
      throw new Error(
        `Invalid environment variables: ${JSON.stringify(parsed.error.errors)}`,
      );
    }
  }

  getEnv(): z.infer<T> {
    const parsed = this.schema.safeParse(process.env);

    if (!parsed.success) {
      throw new Error(
        `Invalid environment variables: ${JSON.stringify(parsed.error.errors)}`,
      );
    }

    return parsed.data as z.infer<T>;
  }
}

export {z as TypeEnv};
