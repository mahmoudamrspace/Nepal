'use client';

interface IncludedExcludedProps {
  included: string[];
  excluded: string[];
}

export default function IncludedExcluded({ included, excluded }: IncludedExcludedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Included */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-6 md:p-8 border-2 border-green-300 shadow-sm">
        <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Included
        </h3>
        <ul className="space-y-3">
          {included.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Excluded */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg p-6 md:p-8 border-2 border-red-300 shadow-sm">
        <h3 className="text-xl md:text-2xl font-serif text-[#2d2d2d] mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          Excluded
        </h3>
        <ul className="space-y-3">
          {excluded.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-base leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

