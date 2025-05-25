Berikut adalah versi terbaru dari **README** yang telah diperbarui untuk mencerminkan bahwa `dotenv` kini secara otomatis di-*load* di dalam `tarkus-env-manager`, sehingga pengguna tidak perlu lagi mengkonfigurasi `.env` secara manual.

# 🌿 tarkus-env-manager

`tarkus-env-manager` is a lightweight TypeScript utility for safely validating and managing environment variables using [Zod](https://zod.dev/). It is designed for Node.js applications where strict validation and transformation of environment variables is critical.

✅ **Automatically loads `.env` via `dotenv` inside the library** — no need to manually call `dotenv.config()` in your project.

## 🚀 Features

* 🔒 Strict validation of environment variables using Zod
* 🔄 Supports value transformation (e.g., string to boolean, string to array)
* ⚙️ Default values supported
* 🧪 Auto-validation during app startup
* 🛠️ Full integration with `process.env`
* 📦 Built-in support for loading `.env` via `dotenv`

## 📦 Installation

```bash
npm install tarkus-env-manager zod dotenv
```

> ⚠️ `dotenv` is required as a peer dependency and is automatically used inside the library.

## 🔧 Usage

### 1. Define Your Environment Schema

```ts
import EnvironmentManager, { TypeEnv } from 'tarkus-env-manager';

const envSchema = TypeEnv.object({
  // === APP CONFIG ===
  APP_ENV: TypeEnv.enum(['dev', 'production', 'test']),
  APP_DEBUG: TypeEnv.string()
    .transform(val => val === 'true')
    .pipe(TypeEnv.boolean()),
  APP_URL: TypeEnv.string().url(),
  APP_PORT: TypeEnv.string().default('8016'),
  APP_STATIC_TOKEN: TypeEnv.string(),

  // === JWT & TOKENS ===
  APP_ACCESS_TOKEN_SECRET: TypeEnv.string(),
  APP_REFRESH_TOKEN_SECRET: TypeEnv.string(),
  APP_USER_DEFAULT_PASSWORD: TypeEnv.string(),

  // === SERVICES ===
  ALIYUN_HOST: TypeEnv.string().url(),
  NEXT_JS_SLIK_HOST: TypeEnv.string().url(),

  // === DATABASE ===
  DB_HOST: TypeEnv.string(),
  DB_HOST_READ: TypeEnv.string(),
  DB_HOST_PORT: TypeEnv.string().default('3306'),
  DB_USERNAME: TypeEnv.string(),
  DB_PASSWORD: TypeEnv.string(),
  DB_DATABASE: TypeEnv.string(),
  DB_PORT: TypeEnv.string().default('3306'),

  // === KAFKA ===
  KAFKA_CLIENT_ID: TypeEnv.string(),
  KAFKA_BROKERS: TypeEnv.string().transform(val =>
    val.split(',').map(b => b.trim()),
  ),
  KAFKA_USERNAME: TypeEnv.string(),
  KAFKA_PASSWORD: TypeEnv.string(),
  KAFKA_USE_SSL: TypeEnv.string()
    .transform(val => val === 'true')
    .pipe(TypeEnv.boolean()),
});
```

### 2. Initialize and Validate the Environment

```ts
const EnvManager = new EnvironmentManager<typeof envSchema>(envSchema);
const env = EnvManager.getEnv();
```

### 3. Export for Global Use

```ts
export { EnvManager };
export default env;
```

## 📘 API Reference

### `new EnvironmentManager(schema)`

* **schema**: A `z.object({...})` schema that defines and validates the environment variables.
* Automatically validates `process.env` on initialization.
* Throws an error if validation fails.

### `getEnv(): z.infer<T>`

* Returns the validated and transformed environment variables as an object.

### `check(): void`

* Explicitly checks for missing or empty environment variables.
* Throws an error listing missing keys.

## ⚠️ Usage Notes

* You **do not need to manually call** `dotenv.config()` — it is automatically loaded within `tarkus-env-manager`.
* Ensure your `.env` file is present in the root of your project.
* Always make sure your `.env` matches your schema.

## ✅ Example `.env` File

```env
APP_ENV=dev
APP_DEBUG=true
APP_URL=http://localhost:3000
APP_STATIC_TOKEN=mytoken

APP_ACCESS_TOKEN_SECRET=secret1
APP_REFRESH_TOKEN_SECRET=secret2
APP_USER_DEFAULT_PASSWORD=defaultpass

ALIYUN_HOST=https://aliyun.example.com
NEXT_JS_SLIK_HOST=https://slik.example.com

DB_HOST=localhost
DB_HOST_READ=localhost
DB_USERNAME=root
DB_PASSWORD=secret
DB_DATABASE=mydb

KAFKA_CLIENT_ID=myclient
KAFKA_BROKERS=broker1:9092,broker2:9092
KAFKA_USERNAME=user
KAFKA_PASSWORD=pass
KAFKA_USE_SSL=true
```

## 🗂️ Project Structure Example

```bash
.
├── app/
│   ├── configs/
│   │   ├── EnvConfig.ts         # Environment schema and validation logic
│   └── repositories/
│       └── KnexRepositoryBase.ts # Database bootstrap and teardown
├── app.ts                       # Express app instance
├── server.ts                    # App entry point
├── .env                         # Environment configuration file
└── README.md
```

## 🚀 How It Works

### `EnvConfig.ts`

```ts
const EnvManager = new EnvironmentManager<typeof envSchema>(envSchema);
const env = EnvManager.getEnv();

export { EnvManager };
export default env;
```

### `server.ts`

```ts
EnvManager.check(); // Ensures no required variables are missing

const port = env.APP_PORT;

app.listen(port, () => {
  logger.info(`Running on http://localhost:${port}`);
});
```

## 📄 License

MIT License © 2025
