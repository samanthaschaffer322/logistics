'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { readabilityClasses } from '@/lib/improved-theme';
import { 
  Download, 
  Upload, 
  Settings, 
  Users, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Database,
  Shield,
  Activity,
  Loader2,
  X,
  Save,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  module: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive';
  lastLogin: Date;
}

const FunctionalQuickActions: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [configData, setConfigData] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'operator' as const });
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    logLevel: 'info',
    maxUsers: 50,
    sessionTimeout: 30,
    enableNotifications: true
  });

  // Sample data initialization
  React.useEffect(() => {
    setSystemLogs([
      {
        id: '1',
        timestamp: new Date(),
        level: 'info',
        message: 'System started successfully',
        module: 'Core'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000),
        level: 'warning',
        message: 'High memory usage detected',
        module: 'Performance'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000),
        level: 'error',
        message: 'Failed to connect to external API',
        module: 'Integration'
      }
    ]);

    setUsers([
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@logiai.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date()
      },
      {
        id: '2',
        name: 'Manager User',
        email: 'manager@logiai.com',
        role: 'manager',
        status: 'active',
        lastLogin: new Date(Date.now() - 3600000)
      }
    ]);
  }, []);

  const setActionLoading = (actionId: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [actionId]: isLoading }));
  };

  const exportSystemLogs = async () => {
    setActionLoading('export-logs', true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const logData = systemLogs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        module: log.module,
        message: log.message
      }));

      const csvContent = [
        'Timestamp,Level,Module,Message',
        ...logData.map(log => `${log.timestamp},${log.level},${log.module},"${log.message}"`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      alert('✅ System logs exported successfully!');
    } catch (error) {
      alert('❌ Failed to export system logs');
    } finally {
      setActionLoading('export-logs', false);
    }
  };

  const importConfiguration = async () => {
    setActiveModal('import-config');
  };

  const handleConfigImport = async () => {
    if (!configData.trim()) {
      alert('Please enter configuration data');
      return;
    }

    setActionLoading('import-config', true);
    
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate JSON
      JSON.parse(configData);
      
      alert('✅ Configuration imported successfully!');
      setActiveModal(null);
      setConfigData('');
    } catch (error) {
      alert('❌ Invalid configuration format. Please check your JSON.');
    } finally {
      setActionLoading('import-config', false);
    }
  };

  const openSystemSettings = () => {
    setActiveModal('system-settings');
  };

  const saveSystemSettings = async () => {
    setActionLoading('save-settings', true);
    
    try {
      // Simulate save process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ System settings saved successfully!');
      setActiveModal(null);
    } catch (error) {
      alert('❌ Failed to save system settings');
    } finally {
      setActionLoading('save-settings', false);
    }
  };

  const openUserManagement = () => {
    setActiveModal('user-management');
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    setActionLoading('add-user', true);
    
    try {
      // Simulate user creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        lastLogin: new Date()
      };

      setUsers(prev => [...prev, user]);
      setNewUser({ name: '', email: '', role: 'operator' });
      alert('✅ User added successfully!');
    } catch (error) {
      alert('❌ Failed to add user');
    } finally {
      setActionLoading('add-user', false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setActionLoading(`delete-user-${userId}`, true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('✅ User deleted successfully!');
    } catch (error) {
      alert('❌ Failed to delete user');
    } finally {
      setActionLoading(`delete-user-${userId}`, false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'export-logs',
      title: 'Export System Logs',
      description: 'Download system logs as CSV file',
      icon: <Download className="w-4 h-4" />,
      action: exportSystemLogs,
      loading: loading['export-logs']
    },
    {
      id: 'import-config',
      title: 'Import Configuration',
      description: 'Import system configuration from JSON',
      icon: <Upload className="w-4 h-4" />,
      action: importConfiguration
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: <Settings className="w-4 h-4" />,
      action: openSystemSettings
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: <Users className="w-4 h-4" />,
      action: openUserManagement
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'manager': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'operator': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <>
      <Card className={readabilityClasses.card}>
        <CardHeader>
          <CardTitle className={`${readabilityClasses.textPrimary} flex items-center gap-2`}>
            <Activity className="w-5 h-5 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                disabled={action.disabled || action.loading}
                className={`${readabilityClasses.buttonSecondary} h-auto p-4 flex flex-col items-start gap-2`}
              >
                <div className="flex items-center gap-2 w-full">
                  {action.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    action.icon
                  )}
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className={`text-xs ${readabilityClasses.textMuted} text-left`}>
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Configuration Modal */}
      {activeModal === 'import-config' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`${readabilityClasses.card} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={readabilityClasses.textPrimary}>Import Configuration</CardTitle>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="config-data">Configuration JSON</Label>
                <Textarea
                  id="config-data"
                  placeholder="Paste your configuration JSON here..."
                  value={configData}
                  onChange={(e) => setConfigData(e.target.value)}
                  rows={10}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfigImport}
                  disabled={loading['import-config']}
                  className={readabilityClasses.buttonPrimary}
                >
                  {loading['import-config'] ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Import Configuration
                </Button>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Settings Modal */}
      {activeModal === 'system-settings' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`${readabilityClasses.card} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={readabilityClasses.textPrimary}>System Settings</CardTitle>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="log-level">Log Level</Label>
                  <select
                    id="log-level"
                    value={systemSettings.logLevel}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, logLevel: e.target.value }))}
                    className={readabilityClasses.select}
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="max-users">Max Users</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={systemSettings.maxUsers}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Auto Backup</Label>
                  <input
                    id="auto-backup"
                    type="checkbox"
                    checked={systemSettings.autoBackup}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-notifications">Enable Notifications</Label>
                  <input
                    id="enable-notifications"
                    type="checkbox"
                    checked={systemSettings.enableNotifications}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, enableNotifications: e.target.checked }))}
                    className="rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={saveSystemSettings}
                  disabled={loading['save-settings']}
                  className={readabilityClasses.buttonPrimary}
                >
                  {loading['save-settings'] ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Settings
                </Button>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Management Modal */}
      {activeModal === 'user-management' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`${readabilityClasses.card} w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={readabilityClasses.textPrimary}>User Management</CardTitle>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New User */}
              <Card className={readabilityClasses.card}>
                <CardHeader>
                  <CardTitle className={`text-lg ${readabilityClasses.textPrimary}`}>Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="user-name">Name</Label>
                      <Input
                        id="user-name"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter user name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-role">Role</Label>
                      <select
                        id="user-role"
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                        className={readabilityClasses.select}
                      >
                        <option value="operator">Operator</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={addUser}
                      disabled={loading['add-user']}
                      className={readabilityClasses.buttonPrimary}
                    >
                      {loading['add-user'] ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Add User
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users List */}
              <div>
                <h4 className={`font-semibold ${readabilityClasses.textPrimary} mb-4`}>
                  Current Users ({users.length})
                </h4>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className={`p-4 ${readabilityClasses.bgSecondary} rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h5 className={`font-medium ${readabilityClasses.textPrimary}`}>
                              {user.name}
                            </h5>
                            <p className={`text-sm ${readabilityClasses.textMuted}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                              : 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                          <Button
                            onClick={() => deleteUser(user.id)}
                            disabled={loading[`delete-user-${user.id}`]}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            {loading[`delete-user-${user.id}`] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className={`text-xs ${readabilityClasses.textMuted} mt-2`}>
                        Last login: {user.lastLogin.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FunctionalQuickActions;
