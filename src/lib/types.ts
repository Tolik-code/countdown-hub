import type { Countdown, CountdownStyle } from "@prisma/client";

export type CountdownWithStyle = Countdown & {
  style: CountdownStyle | null;
};

export interface CreateCountdownInput {
  title: string;
  description?: string;
  slug: string;
  targetDate: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  backgroundImageUrl?: string;
  displayFormat?: string;
  customCss?: string;
}

export interface UpdateCountdownInput extends CreateCountdownInput {
  id: string;
}
