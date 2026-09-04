# Talent Scout Assistant

# Lovable Brief — Tara Demo

I need a recruiting assistant web app with two pages: a candidate search chat, and a resume screening/scoring page. Backend is already built and running locally at http://localhost:8000. CORS is already open, no proxy needed. No authentication needed.

## Page 1: Candidate Search Chat

A chat-style interface. The user types a natural-language recruiting query into a text input at the bottom (e.g. "Find a quantitative analyst who knows Python and machine learning") and sends it. The query appears as a right-aligned user bubble. While waiting for a response, show a loading/typing indicator — this call can take 5–20 seconds, so a blank screen during that time would look broken. When the response arrives, show it as a left-aligned assistant bubble.

API:
POST http://localhost:8000/agent/search-candidates
Content-Type: application/json

Request body:
{ "query": "<the user's message, as typed>" }

Response body:
{ "query": "...", "answer": "<markdown-formatted text>" }

Important: answer is markdown (headings, bold text, bullet lists, occasional emoji). Render it with a markdown renderer inside the chat bubble — don't display it as raw text, or the user will see literal ## and ** characters.

Each query is an independent, stateless API call — no need to send prior conversation history to the backend.

Error handling: if the request fails, times out, or returns a non-200 status, show an error bubble like "Something went wrong, please try again" instead of crashing or showing nothing.

Example queries (nice to show as clickable suggestion chips or placeholder text):
- "Find a quantitative analyst who knows Python and machine learning"
- "Any candidates with a master's degree in a technical field?"
- "Looking for a senior corporate lawyer with 10+ years of M&A experience" (this one should come back honestly saying no good match exists)

## Page 2: Resume Screening / Scoring

A form-based page, separate tab/route from the chat. A large textarea for pasting a job description, and a "Screen Candidates" button. This call is slow — it can take 30–60+ seconds, so show a clear loading state with something like "Analyzing candidates against this role..." rather than a generic spinner with no context.

API:
POST http://localhost:8000/agent/screen-candidates
Content-Type: application/json

Request body:
{ "job_description": "<the full JD text, can be multiple paragraphs>" }

Response body:
{
  "job_title": "Quantitative Analyst",
  "required_skills": ["Python", "SQL"],
  "nice_to_have_skills": ["Bloomberg Terminal"],
  "candidates": [
    {
      "rank": 1,
      "name": "Zhang Haoran",
      "email": "haoran.zhang@alumni.tsinghua.edu.cn",
      "document_id": "fe19d82e-f345-45d7-b08e-ffed73f0dea0",
      "overall_score": 68.3,
      "breakdown": [
        { "criterion": "Required Skills", "max_points": 50, "earned_points": 33.3, "reasoning": "Matched 2/3 required skills, hit: Python, SQL; missing: Machine Learning" },
        { "criterion": "Nice-to-have Skills", "max_points": 15, "earned_points": 10.0, "reasoning": "..." },
        { "criterion": "Years of Experience", "max_points": 20, "earned_points": 20.0, "reasoning": "..." },
        { "criterion": "Education", "max_points": 15, "earned_points": 15.0, "reasoning": "..." }
      ]
    }
  ]
}

Display requirements:
1. At the top, show a summary of what was parsed from the JD: job_title, required_skills, nice_to_have_skills.
2. List candidates in rank order (already sorted by the API). For each: display name — name, falling back to email, falling back to the first 8 characters of document_id — and overall_score prominently (big number out of 100, optionally a progress bar).
3. The breakdown is the most important part of this page — show all 4 criteria with earned/max points and the reasoning text for each candidate, visible or one click away. This proves the score is explainable, not a black box.
4. Optional: color-code overall_score (green >60, amber 35–60, red <35).
5. No pagination needed — dataset is small (~16 candidates).

## General notes

- Keep the visual design clean and professional — internal recruiting tool demo, not consumer-facing, but polish matters (it's for a job interview).
- Both answer and reasoning are LLM-generated text — render as plain text/markdown, never as raw HTML.
- Important: run this app locally (npm run dev) on the same machine as the backend, not on Lovable's cloud preview — the backend only runs on localhost:8000 and isn't reachable from the internet.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/620bd1c7-2186-4f45-8473-e800285cdbe2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
