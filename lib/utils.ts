import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase()

  //* Dictionary mapping possible technology names to Devicon class names
  const techMap: { [key: string]: string } = {
    // JavaScript variations
    javascript: "devicon-javascript-plain",
    js: "devicon-javascript-plain",

    // TypeScript variations
    typescript: "devicon-typescript-plain",
    ts: "devicon-typescript-plain",

    // React variations
    react: "devicon-react-original",
    reactjs: "devicon-react-original",

    // Next.js variations
    nextjs: "devicon-nextjs-plain",
    next: "devicon-nextjs-plain",

    // Node.js variations
    nodejs: "devicon-nodejs-plain",
    node: "devicon-nodejs-plain",

    // Bun.js variations
    bun: "devicon-bun-plain",
    bunjs: "devicon-bun-plain",

    // Deno.js variations
    deno: "devicon-denojs-original",
    denojs: "devicon-denojs-plain",

    // Python variations
    python: "devicon-python-plain",

    // Java variations
    java: "devicon-java-plain",

    // C++ variations
    "c++": "devicon-cplusplus-plain",
    cpp: "devicon-cplusplus-plain",

    // C# variations
    "c#": "devicon-csharp-plain",
    csharp: "devicon-csharp-plain",

    // PHP variations
    php: "devicon-php-plain",

    // HTML variations
    html: "devicon-html5-plain",
    html5: "devicon-html5-plain",

    // CSS variations
    css: "devicon-css3-plain",
    css3: "devicon-css3-plain",

    // Git variations
    git: "devicon-git-plain",

    // Docker variations
    docker: "devicon-docker-plain",

    // MongoDB variations
    mongodb: "devicon-mongodb-plain",
    mongo: "devicon-mongodb-plain",

    // MySQL variations
    mysql: "devicon-mysql-plain",

    // PostgreSQL variations
    postgresql: "devicon-postgresql-plain",
    postgres: "devicon-postgresql-plain",

    // AWS variations
    aws: "devicon-amazonwebservices-original",
    "amazon web services": "devicon-amazonwebservices-original",

    // Tailwind CSS variations
    tailwind: "devicon-tailwindcss-original",
    tailwindcss: "devicon-tailwindcss-original",
  };

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