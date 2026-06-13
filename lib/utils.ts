import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Only auto-apply to jobs where Venice matchScore >= this threshold.
// Import everywhere — never hardcode 70.
export const MATCH_THRESHOLD = 70;
