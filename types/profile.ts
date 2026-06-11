export interface Profile {
  id: string;
  username: string;
  age_range: string;
  gender: string;
  gender_custom: string | null;
  country: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  username: string;
  age_range: string;
  gender: string;
  gender_custom: string | null;
  country: string;
  bio: string;
  created_at: string;
  updated_at: string;
}
