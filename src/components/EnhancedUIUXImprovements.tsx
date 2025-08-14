'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Palette, 
  Eye, 
  Type, 
  Monitor, 
  Smartphone, 
  Tablet,
  Settings,
  Accessibility,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Contrast,
  ZoomIn,
  Languages,
  Keyboard,
  Mouse
} from 'lucide-react';

// Theme Management System
class ThemeManager {
  private themes = {
    light: {
      name: 'Sáng',
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff',
      foreground: '#0f172a',
      accent: '#f1f5f9'
    },
    dark: {
      name: 'Tối',
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
      foreground: '#f8fafc',
      accent: '#1e293b'
    },
    high_contrast: {
      name: 'Tương phản cao',
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      foreground: '#000000',
      accent: '#f0f0f0'
    },
    blue_light: {
      name: 'Giảm ánh sáng xanh',
      primary: '#dc2626',
      secondary: '#991b1b',
      background: '#fef7cd',
      foreground: '#451a03',
      accent: '#fef3c7'
    }
  };
  
  getCurrentTheme(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('logistics-theme') || 'light';
    }
    return 'light';
  }
  
  setTheme(theme: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('logistics-theme', theme);
      this.applyTheme(theme);
    }
  }
  
  private applyTheme(theme: string): void {
    const themeConfig = this.themes[theme as keyof typeof this.themes];
    if (themeConfig && typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(themeConfig).forEach(([key, value]) => {
        if (key !== 'name') {
          root.style.setProperty(`--${key}`, value);
        }
      });
    }
  }
  
  getAvailableThemes(): Array<{key: string, name: string}> {
    return Object.entries(this.themes).map(([key, config]) => ({
      key,
      name: config.name
    }));
  }
}

// Accessibility Manager
class AccessibilityManager {
  private settings = {
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    soundEnabled: true
  };
  
  constructor() {
    this.loadSettings();
  }
  
  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
      this.applySettings();
    }
  }
  
  updateSetting(key: string, value: any): void {
    this.settings = { ...this.settings, [key]: value };
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
      this.applySettings();
    }
  }
  
  private applySettings(): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Font size
      root.style.setProperty('--base-font-size', `${this.settings.fontSize}px`);
      
      // Line height
      root.style.setProperty('--base-line-height', this.settings.lineHeight.toString());
      
      // Letter spacing
      root.style.setProperty('--base-letter-spacing', `${this.settings.letterSpacing}px`);
      
      // Reduced motion
      if (this.settings.reducedMotion) {
        root.style.setProperty('--animation-duration', '0s');
        root.style.setProperty('--transition-duration', '0s');
      } else {
        root.style.removeProperty('--animation-duration');
        root.style.removeProperty('--transition-duration');
      }
      
      // High contrast
      if (this.settings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
      
      // Focus indicators
      if (this.settings.focusIndicators) {
        root.classList.add('enhanced-focus');
      } else {
        root.classList.remove('enhanced-focus');
      }
    }
  }
  
  getSettings(): any {
    return { ...this.settings };
  }
}

// Theme Customization Component
const ThemeCustomization: React.FC = () => {
  const [themeManager] = useState(new ThemeManager());
  const [currentTheme, setCurrentTheme] = useState('light');
  
  useEffect(() => {
    setCurrentTheme(themeManager.getCurrentTheme());
  }, [themeManager]);
  
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    themeManager.setTheme(theme);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Tùy chỉnh giao diện
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Chủ đề</label>
            <Select value={currentTheme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeManager.getAvailableThemes().map(theme => (
                  <SelectItem key={theme.key} value={theme.key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Sun className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Chế độ sáng</div>
              <div className="text-xs text-gray-600">Phù hợp ban ngày</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Moon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Chế độ tối</div>
              <div className="text-xs text-gray-600">Phù hợp ban đêm</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Accessibility Settings Component
const AccessibilitySettings: React.FC = () => {
  const [accessibilityManager] = useState(new AccessibilityManager());
  const [settings, setSettings] = useState(accessibilityManager.getSettings());
  
  const updateSetting = (key: string, value: any) => {
    accessibilityManager.updateSetting(key, value);
    setSettings(accessibilityManager.getSettings());
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Cài đặt trợ năng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Kích thước chữ: {settings.fontSize}px
            </label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Khoảng cách dòng: {settings.lineHeight}
            </label>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([value]) => updateSetting('lineHeight', value)}
              min={1.2}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <span className="text-sm font-medium">Tương phản cao</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <span className="text-sm font-medium">Giảm chuyển động</span>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                <span className="text-sm font-medium">Điều hướng bàn phím</span>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Hiển thị focus</span>
              </div>
              <Switch
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="text-sm font-medium">Âm thanh thông báo</span>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Enhanced UI/UX Component
const EnhancedUIUXImprovements: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theme');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cải tiến UI/UX nâng cao
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Accessibility className="h-3 w-3 mr-1" />
              WCAG 2.1 AA
            </Badge>
            <Badge variant="secondary">
              <Monitor className="h-3 w-3 mr-1" />
              Responsive
            </Badge>
            <Badge variant="secondary">
              <Palette className="h-3 w-3 mr-1" />
              Multi-theme
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Giao diện
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Trợ năng
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme">
          <ThemeCustomization />
        </TabsContent>
        
        <TabsContent value="accessibility">
          <AccessibilitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUIUXImprovements;
export { ThemeManager, AccessibilityManager };
