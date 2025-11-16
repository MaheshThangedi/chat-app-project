import React from 'react';

const NewChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const NewChatView = ({ onNewChat, isLoading }) => {
  return (
    <main className="h-full flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-gray-900">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Chat App</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Click the "New Chat" button in the sidebar or below to start a conversation.
        </p>
        <button 
          onClick={onNewChat}
          disabled={isLoading}
          className="w-48 h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner /> : <NewChatIcon />}
          {isLoading ? 'Starting...' : 'Start New Chat'}
        </button>
      </div>
    </main>
  );
};

export default NewChatView;