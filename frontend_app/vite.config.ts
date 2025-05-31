import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    /** Listen on all interfaces so the container can be reached from outside */
    host: true,          // same as '0.0.0.0'
    port: 3000,          // whatever you use

    /**
     * 1) Allow the exact sub-domain you’re using, OR
     * 2) allow the whole zone, OR
     * 3) (quick-&-dirty) disable the check completely.
     *
     * Pick ONE of the three ↓
     */
    allowedHosts: [
      'achivements.starkhero.xyz'   // option 1: exact name
      // '.starkhero.xyz',          // option 2: wildcard for every sub-domain
      // true                       // option 3: allow *any* host — least secure
    ]
  }
})
