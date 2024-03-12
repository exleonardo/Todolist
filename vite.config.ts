import * as path from "path"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { defineConfig } from "vite"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {},
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
})
