import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { techMap } from "./tech-map"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase()

  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : "devicon-devicon-plain"
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMilliseconds / 1000);

  // Just now (less than 30 seconds)
  if (diffSeconds < 30) {
    return "just now";
  }

  // Less than a minute ago (30-59 seconds)
  if (diffSeconds < 60) {
    return "less than a minute ago";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  // Minutes
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  // Hours
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  // Days
  if (diffDays < 30) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);

  // Months
  if (diffMonths < 12) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);

  // Years
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
};