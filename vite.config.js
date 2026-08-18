import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { validateFrontendProductionEnv } from './build/validateFrontendEnv.js'
import { cwd } from 'node:process'

// https://vite.dev/config/
export default defineConfig(({mode}) => { const env=loadEnv(mode,cwd(),'');validateFrontendProductionEnv(mode,env,'APX public');return { plugins: [react()] } })
