const knownEvents: { patterns: string[]; month: number; day: number }[] = [
  { patterns: ["christmas", "xmas", "christmas day"], month: 12, day: 25 },
  {
    patterns: ["new year", "new years", "new year's eve", "nye"],
    month: 12,
    day: 31,
  },
  {
    patterns: ["new year's day", "new years day"],
    month: 1,
    day: 1,
  },
  { patterns: ["halloween"], month: 10, day: 31 },
  {
    patterns: ["valentine", "valentines", "valentine's day", "valentines day"],
    month: 2,
    day: 14,
  },
  {
    patterns: [
      "independence day",
      "4th of july",
      "fourth of july",
      "july 4th",
      "july fourth",
    ],
    month: 7,
    day: 4,
  },
  {
    patterns: [
      "st patrick",
      "st patricks",
      "saint patrick",
      "st. patrick",
      "st patricks day",
    ],
    month: 3,
    day: 17,
  },
  {
    patterns: ["cinco de mayo"],
    month: 5,
    day: 5,
  },
  {
    patterns: ["april fools", "april fool's day"],
    month: 4,
    day: 1,
  },
  {
    patterns: ["earth day"],
    month: 4,
    day: 22,
  },
  {
    patterns: ["pi day"],
    month: 3,
    day: 14,
  },
  {
    patterns: ["new year's eve", "nye"],
    month: 12,
    day: 31,
  },
];

export function lookupKnownEvent(query: string): string | null {
  const normalized = query.toLowerCase().trim();

  for (const event of knownEvents) {
    for (const pattern of event.patterns) {
      if (normalized.includes(pattern)) {
        const now = new Date();
        let year = now.getFullYear();
        const candidate = new Date(year, event.month - 1, event.day);

        // If the date has already passed this year, use next year
        if (candidate <= now) {
          year++;
        }

        const date = new Date(year, event.month - 1, event.day);
        return date.toISOString().slice(0, 19);
      }
    }
  }

  return null;
}
