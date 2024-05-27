import { type FC } from 'react';

type AIAnnouncementProps = {};

export const AIAnnouncement: FC<AIAnnouncementProps> = () => {
  return (
    <a
      className="flex items-center rounded-md border border-dashed border-purple-600 bg-gradient-to-r from-purple-700 to-purple-500 px-4 py-2 text-white transition-transform transform hover:scale-105 hover:border-purple-400 shadow-lg"
      href="/ai"
      aria-label="Generate visual roadmaps with AI"
    >
      <span className="relative -top-[1px] mr-2 rounded bg-white px-2 py-1 text-xs font-semibold uppercase text-purple-700 shadow">
        New
      </span>
      <span className="hidden sm:inline text-base font-medium">Generate visual roadmaps with AI</span>
      <span className="inline text-base font-medium sm:hidden">AI Roadmap Generator!</span>
    </a>
  );
};
