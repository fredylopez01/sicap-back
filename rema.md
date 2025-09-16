3. Instala dependencias de desarrollo:

```bash
npm install -D typescript ts-node-dev @types/express @types/node
```

4. Crea un `tsconfig.json` básico:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

5. Crea la carpeta `src/` y un archivo `index.ts`:

6. Agrega los scripts en `package.json`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```
