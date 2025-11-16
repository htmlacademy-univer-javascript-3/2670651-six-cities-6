export default function Spinner(): JSX.Element {
  return (
    <div
      className="spinner"
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="#4481c3"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="31.4 188.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 24 24"
            to="360 24 24"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}
