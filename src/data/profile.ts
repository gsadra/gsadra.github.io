/**
 * Profile data — the single source of truth for identity and contact links.
 *
 * Only verified information belongs here. Empty values are intentionally
 * omitted from the rendered site rather than replaced with invented details.
 */

export type LinkIcon =
  | 'github'
  | 'linkedin'
  | 'x'
  | 'medium'
  | 'telegram'
  | 'email'
  | 'scholar'
  | 'cv';

export interface ProfileLink {
  label: string;
  href: string;
  icon: LinkIcon;
}

export const profile = {
  name: 'Sadra Gholami',
  title: 'Data Science / Machine Learning',

  /** Public contact address shown in the sidebar, contact page, and footer. */
  email: 'gsadra@proton.me',

  /** Optional location line, e.g. "Tehran, Iran". Leave empty to hide. */
  location: 'Kerman, Iran',

  /**
   * Public Google Calendar link, shown in the homepage "My Schedule" section.
   * In Google Calendar: Settings → your calendar → Access permissions →
   * "Make available to public", then copy the public link. Leave empty to open
   * the standard Google Calendar view while a public link is being set up.
   */
  calendarUrl: "https://calendar.google.com/calendar/embed?height=600&wkst=7&ctz=Asia%2FTehran&showPrint=0&showNav=0&showTabs=0&showCalendars=0&mode=WEEK&title=Sadra%20Gholami's%20Calendar&src=c2FkcmEuZ2hvbGFtaTIwMDNAZ21haWwuY29t&src=ODdiNzQzNDUzZGY3NjBkZWNlMzIzNjJjOGEwOTVlZjZlZGNhZWE1NzQ2MGMzYTA3MDVlZTk1NWRmYzdlNjBiZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%231b263b&color=%23ca6702",

  /** Portrait path relative to /public. */
  photo: '/images/profile.jpg',
  photoAlt: 'Portrait of Sadra Gholami',

  social: {
    github: 'https://github.com/gsadra',
    /** Add the full profile URL, e.g. 'https://www.linkedin.com/in/handle'. */
    linkedin: 'https://www.linkedin.com/in/sadragholami',
    x: 'https://x.com/gsadraofficial',
    /** Add the full profile URL, e.g. 'https://medium.com/@handle'. */
    medium: 'https://medium.com/@gsadra',
    /** Add the full profile URL, e.g. 'https://t.me/handle'. */
    telegram: 'https://t.me/sadragholami',
    googleScholar: '',
  },

  bio: [
    'I am an Industrial Engineering student interested in data-driven decision-making, machine learning, and operations research. My work focuses on computational methods and intelligent algorithms for complex optimization and scheduling problems.',
    'I enjoy combining mathematical modeling, statistical learning, and programming to build practical, data-driven solutions.',
  ],
} as const;

/** Every public profile, in display order. Empty values are skipped. */
export const profileLinks: ProfileLink[] = [
  ...(profile.email
    ? [{ label: 'Email', href: `mailto:${profile.email}`, icon: 'email' as const }]
    : []),
  { label: 'GitHub', href: profile.social.github, icon: 'github' },
  ...(profile.social.linkedin
    ? [{ label: 'LinkedIn', href: profile.social.linkedin, icon: 'linkedin' as const }]
    : []),
  ...(profile.social.x
    ? [{ label: 'X', href: profile.social.x, icon: 'x' as const }]
    : []),
  ...(profile.social.medium
    ? [{ label: 'Medium', href: profile.social.medium, icon: 'medium' as const }]
    : []),
  ...(profile.social.telegram
    ? [{ label: 'Telegram', href: profile.social.telegram, icon: 'telegram' as const }]
    : []),
  ...(profile.social.googleScholar
    ? [
        {
          label: 'Google Scholar',
          href: profile.social.googleScholar,
          icon: 'scholar' as const,
        },
      ]
    : []),
];

/** The footer keeps only the two primary ways to reach me. */
export const footerLinks: ProfileLink[] = profileLinks.filter(
  (link) => link.icon === 'email' || link.icon === 'github',
);

/** All configured external profiles, for JSON-LD `sameAs`. */
export const sameAsProfiles: string[] = [
  profile.social.github,
  profile.social.linkedin,
  profile.social.x,
  profile.social.medium,
  profile.social.telegram,
  profile.social.googleScholar,
].filter(Boolean);

export const siteMeta = {
  title: 'Sadra Gholami',
  description:
    'Personal academic website of Sadra Gholami, featuring research interests, machine learning projects, operations research, and academic work.',
  lang: 'en',
  /** Update when the site content or CV changes materially. */
  lastUpdated: 'November 2026',
} as const;
