export const POST_MIN_LENGTH = 10;
export const POST_MAX_LENGTH = 500;
export const CATEGORY_MIN_LENGTH = 2;
export const CATEGORY_MAX_LENGTH = 30;

export interface PostFormErrors {
  content?: string;
  category?: string;
}

export function validatePostForm(
  content: string,
  category: string
): PostFormErrors {
  const errors: PostFormErrors = {};
  const trimmed = content.trim();
  const trimmedCategory = category.trim();

  if (!trimmed) {
    errors.content = "Share a thought before posting.";
  } else if (trimmed.length < POST_MIN_LENGTH) {
    errors.content = `Thought must be at least ${POST_MIN_LENGTH} characters.`;
  } else if (content.length > POST_MAX_LENGTH) {
    errors.content = `Thought must be under ${POST_MAX_LENGTH} characters.`;
  }

  if (!trimmedCategory) {
    errors.category = "Add a category.";
  } else if (trimmedCategory.length < CATEGORY_MIN_LENGTH) {
    errors.category = `Category must be at least ${CATEGORY_MIN_LENGTH} characters.`;
  } else if (trimmedCategory.length > CATEGORY_MAX_LENGTH) {
    errors.category = `Category must be under ${CATEGORY_MAX_LENGTH} characters.`;
  }

  return errors;
}
