
import { ExternalLink } from 'lucide-react';

export function UserManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Access Management</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Managing Admin Users</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          For security reasons, managing admin access (inviting new staff, resetting passwords, or revoking access) is handled directly through your secure Supabase project dashboard.
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How to invite a new admin:</h4>
            <ol className="list-decimal list-inside text-blue-700 dark:text-blue-400 space-y-1 text-sm">
              <li>Log in to your Supabase Dashboard.</li>
              <li>Select your project ("struzon").</li>
              <li>Go to <strong>Authentication</strong> &gt; <strong>Users</strong>.</li>
              <li>Click <strong>Add user</strong> &gt; <strong>Invite user</strong> (or Create new user).</li>
              <li>Enter the email address of the personnel you want to give access to.</li>
            </ol>
          </div>

          <a 
            href="https://supabase.com/dashboard/project/lkagqmvqpvqixgvqchpr/auth/users" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Open Supabase Users Dashboard <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
