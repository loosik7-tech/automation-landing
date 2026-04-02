export default function SectionDivider({
  to = "white",
}: {
  to?: "white" | "bg";
}) {
  const fill = to === "white" ? "#ffffff" : "#f8faf8";
  return (
    <div
      className={`section-divider section-divider-to-${to}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 30 C 360 60 720 0 1080 30 C 1260 45 1380 45 1440 30 L1440 60 L0 60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
