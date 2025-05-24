"use client";

export const Scanner = ({ className, animate = true }: { className?: string; animate?: boolean }) => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.39779 18.9921H31.0645M12.5645 31.3254H9.48112C8.66337 31.3254 7.87911 31.0006 7.30088 30.4224C6.72264 29.8441 6.39779 29.0599 6.39779 28.2421V25.1588M24.8978 6.65877H27.9811C28.7989 6.65877 29.5831 6.98362 30.1614 7.56186C30.7396 8.1401 31.0645 8.92436 31.0645 9.74211V12.8254M6.39779 12.8254V9.74211C6.39779 8.92436 6.72264 8.1401 7.30088 7.56186C7.87911 6.98362 8.66337 6.65877 9.48112 6.65877H12.5645M31.0645 25.1588V28.2421C31.0645 29.0599 30.7396 29.8441 30.1614 30.4224C29.5831 31.0006 28.7989 31.3254 27.9811 31.3254H24.8978"
        stroke="currentColor"
        strokeWidth="3.08333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
