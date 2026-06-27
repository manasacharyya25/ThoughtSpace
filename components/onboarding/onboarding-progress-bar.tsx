interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between text-[11px] font-medium text-[#1C1D1E]/45">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#EDF0F1]">
        <div
          className="h-full rounded-full bg-[#2F9CFA] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
