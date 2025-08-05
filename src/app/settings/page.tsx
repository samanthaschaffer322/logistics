'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui-components'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe, 
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from 'lucide-react'

const SettingsPage = () => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      name: 'Demo User',
      email: 'demo@logiai.com',
      company: 'LogiAI Vietnam',
      phone: '+84 123 456 789'
    },
    api: {
      openaiKey: 'sk-...',
      googleMapsKey: 'AIza...'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      alerts: true
    },
    preferences: {
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      currency: 'VND',
      theme: 'dark'
    }
  })

  const handleSave = () => {
    // Simulate saving settings
    console.log('Settings saved:', settings)
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-400" />
              Settings
            </h1>
            <p className="text-slate-400 mt-1">
              Configure your LogiAI platform preferences and integrations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="badge-success">
              <Check className="w-3 h-3 mr-1" />
              All Systems Online
            </Badge>
            <Button className="gradient-button" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl">
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-indigo-400" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Full Name</Label>
                    <Input
                      value={settings.profile.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value }
                      })}
                      className="dark-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email Address</Label>
                    <Input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      className="dark-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Company</Label>
                    <Input
                      value={settings.profile.company}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, company: e.target.value }
                      })}
                      className="dark-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Phone Number</Label>
                    <Input
                      value={settings.profile.phone}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value }
                      })}
                      className="dark-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Key className="w-5 h-5 text-indigo-400" />
                  API Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure API keys for external services and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">OpenAI API Key</Label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.api.openaiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          api: { ...settings.api, openaiKey: e.target.value }
                        })}
                        className="dark-input pr-10"
                        placeholder="sk-..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Required for AI assistant and optimization features
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Google Maps API Key</Label>
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.api.googleMapsKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        api: { ...settings.api, googleMapsKey: e.target.value }
                      })}
                      className="dark-input"
                      placeholder="AIza..."
                    />
                    <p className="text-xs text-slate-500">
                      Required for Vietnam map and route optimization
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-400">Security Notice</h4>
                      <p className="text-sm text-amber-300/80 mt-1">
                        API keys are encrypted and stored securely. Never share your API keys with unauthorized users.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Choose how you want to receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                    { key: 'sms', label: 'SMS Alerts', description: 'Critical alerts via SMS' },
                    { key: 'alerts', label: 'System Alerts', description: 'In-app system notifications' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      <div>
                        <h4 className="font-medium text-white">{item.label}</h4>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications]
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications[item.key as keyof typeof settings.notifications]
                            ? 'bg-indigo-600'
                            : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications[item.key as keyof typeof settings.notifications]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  System Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure language, timezone, and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Language</Label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value }
                      })}
                      className="dark-input w-full"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Timezone</Label>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, timezone: e.target.value }
                      })}
                      className="dark-input w-full"
                    >
                      <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City (GMT+7)</option>
                      <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Currency</Label>
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, currency: e.target.value }
                      })}
                      className="dark-input w-full"
                    >
                      <option value="VND">Vietnamese Dong (₫)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Theme</Label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: e.target.value }
                      })}
                      className="dark-input w-full"
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default SettingsPage
