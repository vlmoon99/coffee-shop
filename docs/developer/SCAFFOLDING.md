# Application Creation Guide

This document specifies the procedure for initializing the Coffee Shop application using Vite, as an alternative to manual `package.json` configuration.

## 1. Initialization Command
To scaffold the project with React and TypeScript/JavaScript, execute the following from the root directory:

```bash
# Initialize Vite in the 'client' directory
npm create vite@latest client -- --template react -y

# Navigate to the client directory
cd client

# Install core dependencies
npm install lucide-react zustand clsx tailwind-merge

# Install and configure Tailwind CSS v4
npm install -D tailwindcss@4 @tailwindcss/vite
```

## 2. Directory Structure Setup
After initialization, the following directories must be created to align with the `ARCHITECTURAL_STANDARDS.md`:

```bash
mkdir -p src/components/common \
         src/components/layouts \
         src/pages \
         src/hooks \
         src/store \
         src/services
```

## 3. Vite Configuration
Ensure `vite.config.js` is updated to support the `@/` path alias:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Also we nede to define  @import "tailwindcss"; in our index.css files , while removing all vite scaffolding files.

```bash
@import "tailwindcss";
```
