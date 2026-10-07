# Keep-Alive Configuration for Render Free Tier

Render's free tier spins down backend services after 15 minutes of inactivity, which causes up to 60-second delays on the next request.

To prevent the backend from sleeping and guarantee instant loads for recruiters and visitors, configure a free keep-alive monitor using UptimeRobot.

## Instructions

1. Go to [UptimeRobot](https://uptimerobot.com/) and create a free account.
2. Click **Add New Monitor**.
3. Use the following configuration:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Siva Portfolio Keep-Alive
   - **URL (or IP):** `https://siva-space-api.onrender.com/api/health`
   - **Monitoring Interval:** 10 minutes *(5 minutes is allowed, but 10 minutes is sufficient to keep Render awake and saves ping quotas).*
   - **Timeout:** 30 seconds
4. Click **Create Monitor** (ignore the "Add Pro Features" prompts).
5. Ensure the monitor status is **Up**.

## Frontend Resilience
The frontend has been updated to fire a non-blocking `GET /api/health` request instantly as soon as `App.jsx` mounts. 

Even if the UptimeRobot ping fails or is paused, this ensures that the server starts spinning up *while* the visitor is reading static cached data (like the Home or About pages) or navigating the menu. 

When the user attempts to load dynamic data (like a new Blog Post), the server is already awake.
