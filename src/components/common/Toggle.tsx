interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <button
          type="button"
          className={`${
            checked ? 'bg-teal' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2`}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
        >
          <span
            aria-hidden="true"
            className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
      <div className="ml-3">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}