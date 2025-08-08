'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { exportToPDF, exportToExcel } from '@/lib/exportUtils'
import { automationPlan, overallMetrics, businessImpact } from '@/lib/automationPlan'
import { 
  Download, 
  FileText, 
  Table, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

export default function LogisticsOperationsPage() {
  const { t, language } = useLanguage()
  const [selectedPhase, setSelectedPhase] = useState(automationPlan[0])
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null)

  const handleExportPDF = async () => {
    setIsExporting(true)
    setExportType('pdf')
    try {
      await exportToPDF(language)
      alert(language === 'vi' ? 'Xuất PDF thành công!' : 'PDF exported successfully!')
    } catch (error) {
      alert(language === 'vi' ? 'Lỗi xuất PDF!' : 'Error exporting PDF!')
      console.error('PDF export error:', error)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    setExportType('excel')
    try {
      await exportToExcel(language)
      alert(language === 'vi' ? 'Xuất Excel thành công!' : 'Excel exported successfully!')
    } catch (error) {
      alert(language === 'vi' ? 'Lỗi xuất Excel!' : 'Error exporting Excel!')
      console.error('Excel export error:', error)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'planned': return 'text-gray-600 bg-gray-100'
      case 'delayed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('automation.title')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t('automation.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                {language === 'vi' ? 'Tóm tắt Điều hành' : 'Executive Summary'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting && exportType === 'pdf' ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {t('automation.exportPDF')}
                </button>
                <button
                  onClick={handleExportExcel}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting && exportType === 'excel' ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Table className="h-4 w-4 mr-2" />
                  )}
                  {t('automation.exportExcel')}
                </button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">
                      {language === 'vi' ? 'Tổng ngân sách' : 'Total Budget'}
                    </p>
                    <p className="text-2xl font-bold">
                      ${overallMetrics.totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">
                      {language === 'vi' ? 'ROI dự kiến' : 'Expected ROI'}
                    </p>
                    <p className="text-2xl font-bold">{overallMetrics.expectedROI}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">
                      {language === 'vi' ? 'Tiến độ tổng thể' : 'Overall Progress'}
                    </p>
                    <p className="text-2xl font-bold">{overallMetrics.overallProgress}%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">
                      {language === 'vi' ? 'Thời gian hoàn vốn' : 'Payback Period'}
                    </p>
                    <p className="text-2xl font-bold">{overallMetrics.paybackPeriod}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {language === 'vi' ? 'Tiến độ dự án tổng thể' : 'Overall Project Progress'}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {overallMetrics.overallProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallMetrics.overallProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Business Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {language === 'vi' ? 'Giảm chi phí' : 'Cost Reduction'}
                </h3>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {businessImpact.costReduction.current}
                </div>
                <div className="text-sm text-green-700">
                  {language === 'vi' ? 'Mục tiêu' : 'Target'}: {businessImpact.costReduction.target}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  {language === 'vi' ? 'Tăng hiệu quả' : 'Efficiency Gains'}
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {businessImpact.efficiencyGains.current}
                </div>
                <div className="text-sm text-blue-700">
                  {language === 'vi' ? 'Mục tiêu' : 'Target'}: {businessImpact.efficiencyGains.target}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {language === 'vi' ? 'Hài lòng khách hàng' : 'Customer Satisfaction'}
                </h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {businessImpact.customerSatisfaction.current}
                </div>
                <div className="text-sm text-purple-700">
                  {language === 'vi' ? 'Mục tiêu' : 'Target'}: {businessImpact.customerSatisfaction.target}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Implementation Phases */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                {language === 'vi' ? 'Các Giai đoạn Triển khai' : 'Implementation Phases'}
              </h2>
            </div>

            <div className="flex">
              {/* Phase Navigation */}
              <div className="w-1/3 border-r border-gray-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    {language === 'vi' ? 'Chọn giai đoạn' : 'Select Phase'}
                  </h3>
                  <div className="space-y-2">
                    {automationPlan.map((phase, index) => (
                      <button
                        key={phase.id}
                        onClick={() => setSelectedPhase(phase)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedPhase.id === phase.id
                            ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {language === 'vi' ? 'Giai đoạn' : 'Phase'} {index + 1}
                            </div>
                            <div className="text-sm text-gray-600">
                              {language === 'vi' ? phase.nameVi : phase.name}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                              {phase.status}
                            </span>
                            <div className="text-sm font-medium text-gray-600">
                              {phase.progress}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${phase.progress}%` }}
                          ></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase Details */}
              <div className="w-2/3 p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {language === 'vi' ? selectedPhase.nameVi : selectedPhase.name}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPhase.status)}`}>
                        {selectedPhase.status}
                      </span>
                      <div className="text-lg font-bold text-gray-700">
                        {selectedPhase.progress}%
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {language === 'vi' ? selectedPhase.descriptionVi : selectedPhase.description}
                  </p>

                  {/* Phase Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm text-blue-600 font-medium">
                            {language === 'vi' ? 'Thời gian' : 'Duration'}
                          </div>
                          <div className="text-lg font-bold text-blue-800">
                            {selectedPhase.duration}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <div className="text-sm text-green-600 font-medium">
                            {language === 'vi' ? 'Ngân sách' : 'Budget'}
                          </div>
                          <div className="text-lg font-bold text-green-800">
                            ${selectedPhase.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <div className="text-sm text-purple-600 font-medium">
                            {language === 'vi' ? 'Bắt đầu' : 'Start Date'}
                          </div>
                          <div className="text-lg font-bold text-purple-800">
                            {new Date(selectedPhase.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-orange-600 mr-2" />
                        <div>
                          <div className="text-sm text-orange-600 font-medium">
                            {language === 'vi' ? 'Kết thúc' : 'End Date'}
                          </div>
                          <div className="text-lg font-bold text-orange-800">
                            {new Date(selectedPhase.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      {language === 'vi' ? 'Sản phẩm bàn giao' : 'Deliverables'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(language === 'vi' ? selectedPhase.deliverablesVi : selectedPhase.deliverables).map((deliverable, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  {selectedPhase.risks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        {language === 'vi' ? 'Rủi ro và Biện pháp giảm thiểu' : 'Risks & Mitigation'}
                      </h4>
                      <div className="space-y-3">
                        {selectedPhase.risks.map((risk, index) => (
                          <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">
                                {language === 'vi' ? risk.descriptionVi : risk.description}
                              </h5>
                              <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.probability)}`}>
                                  {language === 'vi' ? 'XS' : 'Prob'}: {risk.probability}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.impact)}`}>
                                  {language === 'vi' ? 'TĐ' : 'Impact'}: {risk.impact}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>{language === 'vi' ? 'Biện pháp giảm thiểu' : 'Mitigation'}:</strong> {language === 'vi' ? risk.mitigationVi : risk.mitigation}
                            </div>
                            <div className="text-sm text-gray-500">
                              <strong>{language === 'vi' ? 'Người chịu trách nhiệm' : 'Owner'}:</strong> {risk.owner}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      {language === 'vi' ? 'Tài nguyên cần thiết' : 'Required Resources'}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'vi' ? 'Tài nguyên' : 'Resource'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'vi' ? 'Loại' : 'Type'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'vi' ? 'Phân bổ' : 'Allocation'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {language === 'vi' ? 'Chi phí' : 'Cost'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPhase.resources.map((resource) => (
                            <tr key={resource.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {resource.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  resource.type === 'human' ? 'bg-blue-100 text-blue-800' :
                                  resource.type === 'technology' ? 'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {resource.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {resource.allocation}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${resource.cost.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* KPIs */}
                  {selectedPhase.kpis.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                        {language === 'vi' ? 'Chỉ số hiệu suất chính (KPIs)' : 'Key Performance Indicators (KPIs)'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPhase.kpis.map((kpi) => (
                          <div key={kpi.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">
                                {language === 'vi' ? kpi.nameVi : kpi.name}
                              </h5>
                              <div className={`flex items-center ${
                                kpi.trend === 'up' ? 'text-green-600' :
                                kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                <TrendingUp className={`h-4 w-4 ${
                                  kpi.trend === 'down' ? 'transform rotate-180' : ''
                                }`} />
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm text-gray-600">
                                  {language === 'vi' ? 'Hiện tại' : 'Current'}: <span className="font-medium">{kpi.current}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {language === 'vi' ? 'Mục tiêu' : 'Target'}: <span className="font-medium">{kpi.target}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {kpi.unit}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Implementation Timeline */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="h-6 w-6 text-blue-600 mr-2" />
              {language === 'vi' ? 'Lịch trình Triển khai' : 'Implementation Timeline'}
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              {/* Timeline Items */}
              <div className="space-y-8">
                {automationPlan.map((phase, index) => (
                  <div key={phase.id} className="relative flex items-start">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                      phase.status === 'completed' ? 'bg-green-500 border-green-200' :
                      phase.status === 'in-progress' ? 'bg-blue-500 border-blue-200' :
                      phase.status === 'planned' ? 'bg-gray-400 border-gray-200' :
                      'bg-red-500 border-red-200'
                    }`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    {/* Timeline Content */}
                    <div className="ml-6 flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {language === 'vi' ? phase.nameVi : phase.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                              {phase.status}
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              {phase.progress}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {language === 'vi' ? phase.descriptionVi : phase.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center text-gray-500">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${phase.budget.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                phase.status === 'completed' ? 'bg-green-500' :
                                phase.status === 'in-progress' ? 'bg-blue-500' :
                                'bg-gray-400'
                              }`}
                              style={{ width: `${phase.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment & Mitigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 text-red-600 mr-2" />
              {language === 'vi' ? 'Đánh giá Rủi ro & Chiến lược Giảm thiểu' : 'Risk Assessment & Mitigation Strategy'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Risk Level */}
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  {language === 'vi' ? 'Mức độ Rủi ro Tổng thể' : 'Overall Risk Level'}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-yellow-600">
                    {overallMetrics.riskLevel}
                  </span>
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  {language === 'vi' 
                    ? 'Dựa trên phân tích tất cả các giai đoạn và yếu tố rủi ro'
                    : 'Based on analysis of all phases and risk factors'
                  }
                </p>
              </div>

              {/* Risk Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'vi' ? 'Danh mục Rủi ro Chính' : 'Key Risk Categories'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-red-800">
                      {language === 'vi' ? 'Rủi ro Công nghệ' : 'Technology Risk'}
                    </span>
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                      {language === 'vi' ? 'Cao' : 'High'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium text-yellow-800">
                      {language === 'vi' ? 'Rủi ro Tài chính' : 'Financial Risk'}
                    </span>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                      {language === 'vi' ? 'Trung bình' : 'Medium'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-medium text-green-800">
                      {language === 'vi' ? 'Rủi ro Vận hành' : 'Operational Risk'}
                    </span>
                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                      {language === 'vi' ? 'Thấp' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mitigation Strategies */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'vi' ? 'Chiến lược Giảm thiểu Chính' : 'Key Mitigation Strategies'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    {language === 'vi' ? 'Quản lý Thay đổi' : 'Change Management'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === 'vi' 
                      ? 'Chương trình đào tạo toàn diện và giao tiếp thường xuyên với các bên liên quan'
                      : 'Comprehensive training programs and regular stakeholder communication'
                    }
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">
                    {language === 'vi' ? 'Triển khai Theo giai đoạn' : 'Phased Implementation'}
                  </h4>
                  <p className="text-sm text-green-700">
                    {language === 'vi' 
                      ? 'Triển khai từng bước với hệ thống song song để giảm thiểu gián đoạn'
                      : 'Step-by-step rollout with parallel systems to minimize disruption'
                    }
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">
                    {language === 'vi' ? 'Kiểm tra Chất lượng' : 'Quality Assurance'}
                  </h4>
                  <p className="text-sm text-purple-700">
                    {language === 'vi' 
                      ? 'Kiểm tra kỹ lưỡng và xác thực dữ liệu trong mọi giai đoạn'
                      : 'Rigorous testing and data validation at every stage'
                    }
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-medium text-orange-800 mb-2">
                    {language === 'vi' ? 'Dự phòng Ngân sách' : 'Budget Contingency'}
                  </h4>
                  <p className="text-sm text-orange-700">
                    {language === 'vi' 
                      ? 'Dự trữ 15% ngân sách cho các tình huống không lường trước'
                      : '15% budget reserve for unforeseen circumstances'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps & Recommendations */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              {language === 'vi' ? 'Các Bước Tiếp theo & Khuyến nghị' : 'Next Steps & Recommendations'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'vi' ? 'Ưu tiên Ngay lập tức' : 'Immediate Priorities'}
                </h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Hoàn thành triển khai WMS và TMS'
                      : 'Complete WMS and TMS implementation'
                    }
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Tăng cường đào tạo người dùng'
                      : 'Intensify user training programs'
                    }
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Bắt đầu phát triển mô hình AI'
                      : 'Begin AI model development'
                    }
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'vi' ? 'Khuyến nghị Chiến lược' : 'Strategic Recommendations'}
                </h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Đầu tư vào đào tạo AI cho đội ngũ'
                      : 'Invest in AI training for the team'
                    }
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Thiết lập quan hệ đối tác công nghệ'
                      : 'Establish technology partnerships'
                    }
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {language === 'vi' 
                      ? 'Chuẩn bị cho mở rộng quốc tế'
                      : 'Prepare for international expansion'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            {language === 'vi' 
              ? `Kế hoạch được cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')} | Phiên bản 2.0`
              : `Last updated: ${new Date().toLocaleDateString()} | Version 2.0`
            }
          </p>
          <p className="mt-2">
            {language === 'vi' 
              ? 'Được tạo bởi Hệ thống Quản lý Logistics AI LogiAI'
              : 'Generated by LogiAI Logistics Management System'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
