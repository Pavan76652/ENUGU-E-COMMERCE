const GuideSvg = ({ children, compact = false }) => (
  <svg
    viewBox="0 0 120 160"
    className={`${compact ? 'h-16 w-12' : 'h-40 w-32'} text-enugu-black dark:text-gray-100`}
    aria-hidden
  >
    {children}
  </svg>
);

export const ChestIllustration = ({ compact = false }) => (
  <GuideSvg compact={compact}>
    <path
      d="M35 42 L60 32 L85 42 L85 130 L35 130 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line x1="35" y1="58" x2="85" y2="58" stroke="#C9A227" strokeWidth="2" strokeDasharray="4 3" />
    <path d="M30 58 L35 58 M85 58 L90 58" stroke="#C9A227" strokeWidth="1.5" />
    <text x="60" y="54" textAnchor="middle" fontSize="8" fill="#C9A227">
      Chest
    </text>
  </GuideSvg>
);

export const LengthIllustration = ({ compact = false }) => (
  <GuideSvg compact={compact}>
    <path
      d="M40 28 L60 22 L80 28 L80 138 L40 138 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line x1="88" y1="28" x2="88" y2="138" stroke="#C9A227" strokeWidth="2" strokeDasharray="4 3" />
    <path d="M88 28 L93 28 M88 138 L93 138" stroke="#C9A227" strokeWidth="1.5" />
    <text x="98" y="84" fontSize="8" fill="#C9A227">
      Length
    </text>
  </GuideSvg>
);

export const ShoulderIllustration = ({ compact = false }) => (
  <GuideSvg compact={compact}>
    <path
      d="M30 48 L60 38 L90 48 L85 130 L35 130 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line x1="30" y1="48" x2="90" y2="48" stroke="#C9A227" strokeWidth="2" strokeDasharray="4 3" />
    <path d="M30 48 L30 43 M90 48 L90 43" stroke="#C9A227" strokeWidth="1.5" />
    <text x="60" y="42" textAnchor="middle" fontSize="8" fill="#C9A227">
      Shoulder
    </text>
  </GuideSvg>
);

export const SleeveIllustration = ({ compact = false }) => (
  <GuideSvg compact={compact}>
    <path
      d="M35 42 L60 32 L85 42 L85 130 L35 130 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M35 42 L18 70 L22 74 L38 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line x1="18" y1="70" x2="38" y2="50" stroke="#C9A227" strokeWidth="2" strokeDasharray="4 3" />
    <text x="14" y="66" fontSize="8" fill="#C9A227">
      Sleeve
    </text>
  </GuideSvg>
);

const MEASURE_STEPS = [
  {
    title: 'Chest',
    description: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
    Illustration: ChestIllustration,
  },
  {
    title: 'Body Length',
    description: 'Measure from the highest point of the shoulder to the bottom hem.',
    Illustration: LengthIllustration,
  },
  {
    title: 'Shoulder',
    description: 'Measure straight across from shoulder seam to shoulder seam.',
    Illustration: ShoulderIllustration,
  },
  {
    title: 'Sleeve Length',
    description: 'Measure from the shoulder seam down to the cuff opening.',
    Illustration: SleeveIllustration,
  },
];

const MeasureIllustrations = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-medium leading-snug text-enugu-black">
          Lay your garment flat. Use a soft measuring tape, snug but not tight.
        </p>
        <div className="space-y-2.5">
          {MEASURE_STEPS.map(({ title, description, Illustration }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <Illustration compact />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wide text-enugu-black">
                  {title}
                </h4>
                <p className="text-xs leading-snug text-gray-700">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-enugu-black dark:text-gray-200">
        Lay your garment flat on a surface. Use a soft measuring tape and keep it snug but not tight.
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {MEASURE_STEPS.map(({ title, description, Illustration }) => (
          <div key={title} className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <Illustration />
            </div>
            <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-enugu-black dark:text-white">
              {title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasureIllustrations;
