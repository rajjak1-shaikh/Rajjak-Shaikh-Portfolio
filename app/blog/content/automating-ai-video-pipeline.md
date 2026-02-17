---
title: "Automating Content Creation: A 100% Free AI Video Pipeline"
publishedAt: "2026-02-14"
summary: "How I built a fully automated video generation workflow using n8n, Gemini AI, Edge TTS, and MoviePy to turn text topics into YouTube-ready videos."
tags: ['n8n', 'AI', 'Automation', 'Python']
---

## The Vision: One Topic, One Video

Content creation is time-consuming. Scriptwriting, voiceovers, finding stock footage, and editing can take hours for a single minute of video. I wanted to solve this by building a pipeline that takes a single text prompt (e.g., "The History of Chess") and outputs a complete, polished MP4 video.

**The catch?** It had to be completely automated and use **only free-tier tools**.

## The Tech Stack

I orchestrated the workflow using **n8n**, a powerful workflow automation tool, connecting several specialized AI services:

1.  **Google Gemini (Free Tier):** Acts as the "Brain". It generates structured scripts, separating identifying narration from visual scene descriptions.
2.  **Edge TTS:** Provides high-quality, neural-sounding voiceovers without the cost of premium APIs like ElevenLabs.
3.  **Pexels API:** Fetches relevant, high-quality stock images for each scene based on Gemini's visual queries.
4.  **MoviePy & FFmpeg:** The engine room. A Python script stitches images and audio together, applying the "Ken Burns" effect (pan and zoom) to bring static images to life.

## How It Works

The n8n workflow triggers the process:
1.  **Script Generation:** Gemini creates a JSON-formatted script with scenes.
2.  **Asset Gathering:** The system downloads images and generates audio files for each scene in parallel.
3.  **Assembly:** The Python script combines these assets, overlays subtitles, and renders the final 1080p video.

## Challenges & Solutions

**Context Consistency:** Keeping the visuals consistent was tricky. I solved this by refining the prompt engineering for Gemini to generate very specific, descriptive visual queries for Pexels.

**API Limits:** Using free tiers meant hitting rate limits. I implemented robust error handling and retries in the Python script to manage this gracefully.

## Results

The result is a "set it and forget it" system. You input a topic, and a few minutes later, you have a video ready for upload. It's a testament to the power of combining modern AI tools with classic automation logic.
