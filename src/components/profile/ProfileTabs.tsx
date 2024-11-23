interface ProfileTabsProps {
  activeTab: 'overview' | 'history' | 'pending';
  onTabChange: (tab: 'overview' | 'history' | 'pending') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        <button
          onClick={() => onTabChange('overview')}
          className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'border-teal text-teal'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Aperçu
        </button>
        <button
          onClick={() => onTabChange('pending')}
          className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === 'pending'
              ? 'border-teal text-teal'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          En cours
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === 'history'
              ? 'border-teal text-teal'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Historique
        </button>
      </nav>
    </div>
  );
}