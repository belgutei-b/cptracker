<p align="center">
  <a href="https://cptracker.org/">
    <img src="https://github.com/belgutei-b/cptracker/blob/main/public/favicon_io/android-chrome-512x512.png" width="140px" alt="CPTracker logo" />
  </a>
</p>

# CPTracker

[CPTracker](https://cptracker.org) is a time-based LeetCode tracker. Solved count is a good metric — but it doesn't capture the hours you spent on a hard problem you didn't submit. Those sessions matter too. CPTracker tracks both: every session, tried or solved, adds to a total you can actually see grow. The analytics page shows your daily time breakdown by difficulty in a bar chart, so you always know if you're moving forward.

## How it works

1. **Sign in** with your Google or GitHub account.
2. **Add a problem** by pasting a LeetCode problem URL — it appears in your dashboard instantly.
3. **Start the timer** and begin solving. Write down your observations, approach, and time/space complexity as you go.
4. **Mark it when you're done** — either Solved or Tried. Your notes and session duration are saved.
5. **Check your analytics** — the analytics page shows a daily bar chart of time spent broken down by difficulty, so you can see exactly where your hours are going.

## Chrome extension

The [CPTracker Chrome extension](https://github.com/belgutei-b/cptracker-extension) brings CPTracker into your LeetCode workflow — no tab switching. From the popup, you can add the current problem, start and stop the timer, write notes, and mark it Tried or Solved, all without leaving LeetCode.

[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/ojpjlobnleonmgehlhoibaicokoadcnm?utm_source=item-share-cb)

## Technology

CPTracker is built with Next.js and TailwindCSS, with a PostgreSQL database. Deployed on [Vercel](https://vercel.com) and database hosted on [Supabase](https://supabase.com).

## License

Licensed under the [MIT License](./LICENSE).
