import React from 'react';

type AIAnnouncementProps = {};

export function AIAnnouncement(props: AIAnnouncementProps) {
  return (
    <a
      className="relative flex items-center justify-center rounded-lg border border-dashed border-purple-600 bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-purple-100 shadow-lg transition-all duration-300 hover:border-purple-400 hover:text-white hover:shadow-2xl"
      href="/ai"
    >
      <span className="absolute top-0 left-0 mt-1 ml-1 rounded-full bg-pink-500 px-2 py-1 text-xs font-bold uppercase text-white shadow-md">
        New
      </span>
      <span className="hidden sm:inline text-base font-medium">Generate visual roadmaps with AI</span>
      <span className="inline text-sm sm:hidden font-medium">AI Roadmap Generator!</span>
    </a>
  );
}
