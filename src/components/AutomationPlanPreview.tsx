'use client'

import React, { useState } from 'react'
import { AutomationPlan } from '@/lib/automationPlanGenerator'
import { 
  Download, 
  FileText, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Zap,
  X,
  Eye,
  FileSpreadsheet,
  Printer
} from 'lucide-react'

interface AutomationPlanPreviewProps {
  plan: AutomationPlan
  language: 'vi' | 'en'
  onClose: () => void
  onDownload: (format: 'pdf' | 'excel') => void
}

const AutomationPlanPreview: React.FC<AutomationPlanPreviewProps> = ({
  plan,
  language,
  onClose,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'human' | 'roi' | 'timeline'>('overview')

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M VNĐ`
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-blue-400'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-indigo-400" />
              {plan.title}
            </h2>
            <p className="text-slate-400 mt-1">
              {language === 'vi' ? 'Xem trước kế hoạch tự động hóa chi tiết' : 'Detailed automation plan preview'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownload('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => onDownload('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'overview', label: language === 'vi' ? 'Tổng quan' : 'Overview', icon: Eye },
            { id: 'phases', label: language === 'vi' ? 'Giai đoạn' : 'Phases', icon: Target },
            { id: 'human', label: language === 'vi' ? 'Nhân sự' : 'Human Impact', icon: Users },
            { id: 'roi', label: 'ROI', icon: TrendingUp },
            { id: 'timeline', label: language === 'vi' ? 'Timeline' : 'Timeline', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Text */}
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {plan.overview}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-green-400">
                      {language === 'vi' ? 'Tiết kiệm Chi phí' : 'Cost Savings'}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(plan.totalSavings.cost)}
                  </div>
                  <div className="text-sm text-green-300">
                    {language === 'vi' ? 'Hàng năm' : 'Annually'}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-400">
                      {language === 'vi' ? 'Tiết kiệm Thời gian' : 'Time Savings'}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {plan.totalSavings.time}%
                  </div>
                  <div className="text-sm text-blue-300">
                    {language === 'vi' ? 'Giảm thời gian xử lý' : 'Processing time reduction'}
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-purple-400">
                      {language === 'vi' ? 'Cải thiện Hiệu suất' : 'Efficiency Improvement'}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {plan.totalSavings.efficiency}%
                  </div>
                  <div className="text-sm text-purple-300">
                    {language === 'vi' ? 'Tăng hiệu suất tổng thể' : 'Overall efficiency increase'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'phases' && (
            <div className="space-y-6">
              {plan.phases.map((phase, index) => (
                <div key={phase.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{phase.name}</h3>
                      <p className="text-slate-300">{phase.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getComplexityColor(phase.complexity)}`}>
                      {phase.complexity.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400">
                        {language === 'vi' ? 'Thời gian' : 'Duration'}
                      </div>
                      <div className="text-lg font-semibold text-white">{phase.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">
                        {language === 'vi' ? 'Chi phí' : 'Cost'}
                      </div>
                      <div className="text-lg font-semibold text-red-400">{formatCurrency(phase.cost)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">
                        {language === 'vi' ? 'Tiết kiệm' : 'Savings'}
                      </div>
                      <div className="text-lg font-semibold text-green-400">{formatCurrency(phase.savings)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">ROI</div>
                      <div className="text-lg font-semibold text-purple-400">
                        {Math.round((phase.savings / phase.cost - 1) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Công nghệ sử dụng:' : 'Technologies:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.technologies.map(tech => (
                          <span key={tech} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Vị trí bị ảnh hưởng:' : 'Affected Roles:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.humanRoles.map(role => (
                          <span key={role} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'human' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{plan.humanImpact.totalPositions}</div>
                  <div className="text-sm text-slate-400">
                    {language === 'vi' ? 'Tổng vị trí' : 'Total Positions'}
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{plan.humanImpact.positionsEliminated}</div>
                  <div className="text-sm text-red-300">
                    {language === 'vi' ? 'Loại bỏ' : 'Eliminated'}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{plan.humanImpact.positionsReassigned}</div>
                  <div className="text-sm text-yellow-300">
                    {language === 'vi' ? 'Chuyển đổi' : 'Reassigned'}
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{plan.humanImpact.newPositionsCreated}</div>
                  <div className="text-sm text-green-300">
                    {language === 'vi' ? 'Tạo mới' : 'Created'}
                  </div>
                </div>
              </div>

              {/* Detailed Impact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    {language === 'vi' ? 'Vị trí loại bỏ' : 'Eliminated Positions'}
                  </h4>
                  <div className="space-y-2">
                    {plan.humanImpact.details.eliminated.map(item => (
                      <div key={item.role} className="flex justify-between items-center p-2 bg-red-500/10 rounded">
                        <div>
                          <div className="text-sm font-medium text-white">{item.role}</div>
                          <div className="text-xs text-red-300">{formatCurrency(item.avgSalary)}/tháng</div>
                        </div>
                        <div className="text-red-400 font-bold">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {language === 'vi' ? 'Vị trí chuyển đổi' : 'Reassigned Positions'}
                  </h4>
                  <div className="space-y-2">
                    {plan.humanImpact.details.reassigned.map(item => (
                      <div key={item.role} className="p-2 bg-yellow-500/10 rounded">
                        <div className="text-sm font-medium text-white">{item.role}</div>
                        <div className="text-xs text-yellow-300">→ {item.newRole}</div>
                        <div className="text-yellow-400 font-bold">{item.count} {language === 'vi' ? 'người' : 'people'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {language === 'vi' ? 'Vị trí tạo mới' : 'New Positions'}
                  </h4>
                  <div className="space-y-2">
                    {plan.humanImpact.details.created.map(item => (
                      <div key={item.role} className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                        <div>
                          <div className="text-sm font-medium text-white">{item.role}</div>
                          <div className="text-xs text-green-300">{formatCurrency(item.avgSalary)}/tháng</div>
                        </div>
                        <div className="text-green-400 font-bold">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-6">
              {/* ROI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {language === 'vi' ? 'Phân tích Tài chính' : 'Financial Analysis'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Đầu tư ban đầu:' : 'Initial Investment:'}
                      </span>
                      <span className="text-red-400 font-semibold">
                        {formatCurrency(plan.roi.initialInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Tiết kiệm hàng năm:' : 'Annual Savings:'}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(plan.roi.annualSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'vi' ? 'Thời gian hoàn vốn:' : 'Payback Period:'}
                      </span>
                      <span className="text-blue-400 font-semibold">
                        {plan.roi.paybackPeriod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROI 5 năm:</span>
                      <span className="text-purple-400 font-semibold">
                        {plan.roi.roi5Year}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {language === 'vi' ? 'Dòng tiền 5 năm' : '5-Year Cash Flow'}
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(year => {
                      const netFlow = plan.roi.annualSavings - (year === 1 ? plan.roi.initialInvestment : 0)
                      return (
                        <div key={year} className="flex justify-between items-center">
                          <span className="text-slate-400">
                            {language === 'vi' ? 'Năm' : 'Year'} {year}:
                          </span>
                          <span className={`font-semibold ${netFlow > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {netFlow > 0 ? '+' : ''}{formatCurrency(netFlow)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  {language === 'vi' ? 'Phân tích Rủi ro' : 'Risk Analysis'}
                </h3>
                <div className="space-y-4">
                  {plan.risks.map(risk => (
                    <div key={risk.id} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{risk.description}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${getRiskColor(risk.probability)} bg-current bg-opacity-20`}>
                            {risk.probability}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${getRiskColor(risk.impact)} bg-current bg-opacity-20`}>
                            {risk.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400">
                        <strong>{language === 'vi' ? 'Giảm thiểu:' : 'Mitigation:'}</strong> {risk.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative">
                {plan.timeline.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-4 pb-8">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-500'
                      }`} />
                      {index < plan.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-slate-600 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-white">{item.milestone}</h4>
                          <p className="text-sm text-slate-400">{item.phase}</p>
                        </div>
                        <span className="text-sm text-slate-400">{item.date}</span>
                      </div>
                      {item.dependencies.length > 0 && (
                        <div className="text-xs text-slate-500">
                          {language === 'vi' ? 'Phụ thuộc:' : 'Dependencies:'} {item.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AutomationPlanPreview
