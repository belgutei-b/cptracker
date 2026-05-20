export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  lastModified: string;
  sections: LegalSection[];
};

export const privacyPolicyContent: LegalPageContent = {
  title: "Privacy Policy",
  description:
    "This Privacy Policy explains what data CPTracker collects, why we collect it, how we use it, and how users can request deletion of their data.",
  lastModified: "May 15, 2026",
  sections: [
    {
      title: "Data we collect",
      body: [
        "When you create or access a CPTracker account, we collect account information from your authentication provider, such as your name, email address, profile photo, provider account identifier, and verification status.",
        "CPTracker stores your browser timezone so analytics, dates, daily summaries, and solving history can be calculated according to your local time.",
        "When you add problems, we store the LeetCode problem link and related problem metadata, including title, title slug, question ID, difficulty, and topic tags.",
        "When you track your solving progress, we store problem status, notes, time complexity notes, space complexity notes, timer duration, solve sessions, start times, finish times, solved dates, tried dates, and related timestamps.",
      ],
    },
    {
      title: "Authentication and session data",
      body: [
        "CPTracker uses authentication providers such as Google and GitHub to let users sign in. We may store provider account details, OAuth tokens, token expiration dates, scopes, and related authentication records needed to keep your account connected.",
        "We store session records such as session tokens, expiration times, IP address, user agent, creation time, and update time to authenticate requests, keep users signed in, and protect account access.",
        "CPTracker does not collect or store your Google or GitHub password.",
      ],
    },
    {
      title: "Chrome extension data",
      body: [
        "If you use the CPTracker Chrome extension, the extension reads the active tab URL when opened so it can confirm whether the current page is a LeetCode problem page.",
        "The extension sends the relevant LeetCode problem link to CPTracker so your timer, notes, and status updates are saved to the correct problem in your account.",
        "The extension uses your existing authenticated CPTracker session to authorize requests. The extension popup does not collect passwords or PINs.",
      ],
    },
    {
      title: "How we use data",
      body: [
        "We use your data to provide CPTracker features, including account access, problem tracking, timers, notes, status updates, solve sessions, profile views, and analytics pages.",
        "We use timezone data to group activity by day and calculate charts, totals, solve history, and other analytics in the correct local time.",
        "We may use technical records such as sessions, IP address, user agent, logs, and timestamps to operate, debug, secure, and improve the service.",
      ],
    },
    {
      title: "Analytics and service providers",
      body: [
        "CPTracker uses Vercel Analytics to understand general website usage and improve the product.",
        "CPTracker stores application data in Supabase, which provides the Postgres database used by the service.",
        "CPTracker may use third-party services such as Google, GitHub, Supabase, Vercel, and LeetCode-related APIs or pages only as needed to provide authentication, hosting, storage, analytics, and problem tracking functionality.",
      ],
    },
    {
      title: "Data sharing and selling",
      body: [
        "We do not sell your personal data.",
        "We do not use your personal data for advertising.",
        "We only share data with service providers when needed to operate CPTracker, such as authentication, hosting, analytics, and database storage providers.",
      ],
    },
    {
      title: "Data storage and retention",
      body: [
        "CPTracker stores user account data, problem tracking data, solve session data, and related records in its Supabase Postgres database.",
        "We keep your account and tracking data for as long as your account remains active or as long as needed to provide the service, maintain security, resolve issues, or meet legal obligations.",
        "Shared LeetCode problem metadata may remain in the system even after a user deletes their account because that metadata is not specific to one user and may be used by other CPTracker users.",
      ],
    },
    {
      title: "Data deletion requests",
      body: [
        "You can request deletion of your CPTracker account and associated user-specific tracking data by contacting us at the support email listed on this website or from the account connected to your CPTracker profile.",
        "After verifying the request, we will delete or anonymize user-specific account data, problem tracking data, notes, timer records, solve sessions, sessions, and connected account records where required.",
        "Some limited records may be retained if needed for security, abuse prevention, legal compliance, backup restoration, or resolving disputes.",
      ],
    },
    {
      title: "Changes to this policy",
      body: [
        "We may update this Privacy Policy as CPTracker changes. When we make changes, we will update the Last modified date on this page.",
        "If a change is material, we may provide additional notice through the website or another reasonable method.",
      ],
    },
    {
      title: "Contact",
      body: [
        "If you have questions about this Privacy Policy or want to request data deletion, contact CPTracker through the support contact made available on cptracker.org.",
      ],
    },
  ],
};

export const extensionPrivacyPolicyContent: LegalPageContent = {
  title: "Chrome Extension Privacy Policy",
  description:
    "This Privacy Policy explains what data categories are handled by the CPTracker Chrome extension and why each category is needed for LeetCode solving-session tracking.",
  lastModified: "March 9, 2026",
  sections: [
    {
      title: "Extension purpose",
      body: [
        "The CPTracker Chrome extension has a single purpose: helping users track LeetCode solving sessions in their CPTracker account without switching tabs.",
        "The extension supports features such as linking the current LeetCode problem, starting and stopping timers, saving notes, updating status, and syncing problem activity with CPTracker.",
      ],
    },
    {
      title: "Personally identifiable information",
      body: [
        "The extension works with account-level profile data associated with your CPTracker account, such as user ID and username or email address when available.",
        "This information is used only to identify your account and sync your problem tracking data to the correct CPTracker profile.",
      ],
    },
    {
      title: "Authentication information",
      body: [
        "The extension uses your existing cptracker.org authenticated session state to authorize extension requests.",
        "The extension popup does not collect passwords or PINs.",
      ],
    },
    {
      title: "Web history",
      body: [
        "When you open the extension popup, the extension reads the active tab URL only to confirm whether the current page is a LeetCode problem page.",
        "This check is used to connect your current LeetCode problem to your CPTracker account.",
      ],
    },
    {
      title: "Website content",
      body: [
        "The extension processes the LeetCode problem link as website resource content so your timer, notes, and status updates are saved for the correct problem.",
        "The extension does not use page content for advertising or unrelated tracking.",
      ],
    },
    {
      title: "How extension data is used",
      body: [
        "We use extension data to power CPTracker extension features, including problem linking, timer actions, notes updates, status updates, and analytics sync with cptracker.org.",
        "We do not sell user data.",
        "We do not use user data for advertising.",
      ],
    },
    {
      title: "Contact",
      body: [
        "If you have questions about this Chrome Extension Privacy Policy or want to request data deletion, contact CPTracker through the support contact made available on cptracker.org.",
      ],
    },
  ],
};

export const termsContent: LegalPageContent = {
  title: "Terms of Service",
  description:
    "These Terms of Service explain the rules for using CPTracker, including your responsibilities and how the service may change over time.",
  lastModified: "May 15, 2026",
  sections: [
    {
      title: "Using CPTracker",
      body: [
        "CPTracker is a tool for tracking LeetCode problem progress, notes, timers, statuses, solve sessions, and related analytics.",
        "By using CPTracker, you agree to use the service only for lawful purposes and in a way that does not interfere with the service or other users.",
      ],
    },
    {
      title: "Accounts",
      body: [
        "You are responsible for maintaining access to the Google, GitHub, or other authentication account you use with CPTracker.",
        "You are responsible for activity that occurs through your CPTracker account. If you believe your account has been accessed without permission, you should contact us as soon as possible.",
      ],
    },
    {
      title: "User content and tracking data",
      body: [
        "You retain responsibility for the notes, problem status updates, timer records, and other content you add to CPTracker.",
        "You allow CPTracker to store, process, and display this data as needed to provide product features such as dashboards, analytics, profile pages, and extension syncing.",
      ],
    },
    {
      title: "Acceptable use",
      body: [
        "You may not misuse CPTracker, attempt to disrupt the service, bypass authentication, access another user's account, scrape private data, upload malicious content, or use the service in a way that harms CPTracker or other users.",
        "You may not reverse engineer, attack, overload, or interfere with CPTracker systems except where permitted by applicable law.",
      ],
    },
    {
      title: "Third-party services",
      body: [
        "CPTracker may rely on third-party services such as Google, GitHub, Supabase, Vercel, and LeetCode-related pages or APIs.",
        "Third-party services are governed by their own terms and policies. CPTracker is not responsible for changes, outages, or behavior of third-party services outside our control.",
      ],
    },
    {
      title: "Service changes",
      body: [
        "We may update, modify, limit, suspend, or discontinue CPTracker features at any time.",
        "We may also change how dashboards, analytics, extension syncing, timers, notes, or other features work as the product evolves.",
      ],
    },
    {
      title: "No guarantee of availability or accuracy",
      body: [
        "CPTracker is provided as is and as available. We do not guarantee that the service will always be available, error-free, secure, or uninterrupted.",
        "Analytics, timers, statuses, and calculations are provided to help users track progress, but they may contain mistakes, delays, or inaccuracies.",
      ],
    },
    {
      title: "Suspension or termination",
      body: [
        "We may suspend or terminate access to CPTracker if we believe a user has violated these Terms, created risk for the service, or used the service in a harmful or unlawful way.",
        "Users may stop using CPTracker at any time and may request deletion of their account data as described in the Privacy Policy.",
      ],
    },
    {
      title: "Changes to these terms",
      body: [
        "We may update these Terms of Service as CPTracker changes. When we make changes, we will update the Last modified date on this page.",
        "Continued use of CPTracker after the terms are updated means you accept the updated terms.",
      ],
    },
    {
      title: "Contact",
      body: [
        "If you have questions about these Terms of Service, contact CPTracker through the support contact made available on cptracker.org.",
      ],
    },
  ],
};
