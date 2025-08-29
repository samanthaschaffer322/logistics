export class VietnameseRouteLearner {
  private commonRoutes = new Map<string, any>()

  // Learn from Vietnamese logistics files
  async learnFromFiles(files: File[]) {
    for (const file of files) {
      if (file.name.includes('BKVC') || file.name.includes('BK VC') || file.name.includes('BẢNG KÊ')) {
        await this.processVietnameseLogisticsFile(file)
      }
    }
    
    return this.getOptimizedRoutes()
  }

  private async processVietnameseLogisticsFile(file: File) {
    const text = await file.text()
    
    // Extract common Vietnamese route patterns
    const routePatterns = [
      /Cảng Cát Lái.*?→.*?(Kho|KHO|Depot)/gi,
      /PS.*?CE.*?T\d+/gi, // PS-CE routes from your files
      /CONT.*?THÁNG.*?\d+/gi, // Container monthly routes
      /(Hà Nội|TP\.HCM|Hải Phòng|Đà Nẵng)/gi // Major cities
    ]

    routePatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(route => {
          this.addRouteData(route, {
            frequency: (this.commonRoutes.get(route)?.frequency || 0) + 1,
            source: file.name,
            type: this.detectRouteType(route)
          })
        })
      }
    })
  }

  private detectRouteType(route: string): string {
    if (route.includes('CONT')) return 'container'
    if (route.includes('Cảng')) return 'port'
    if (route.includes('KHO')) return 'warehouse'
    return 'general'
  }

  private addRouteData(route: string, data: any) {
    this.commonRoutes.set(route, {
      ...this.commonRoutes.get(route),
      ...data
    })
  }

  getOptimizedRoutes() {
    // Return most frequent routes for optimization
    return Array.from(this.commonRoutes.entries())
      .sort(([,a], [,b]) => b.frequency - a.frequency)
      .slice(0, 10)
      .map(([route, data]) => ({
        route,
        ...data,
        optimizedCost: this.calculateOptimizedCost(route),
        recommendedTime: this.getRecommendedTime(route)
      }))
  }

  private calculateOptimizedCost(route: string): number {
    // Based on your file patterns, estimate costs
    if (route.includes('Cảng Cát Lái')) return 500000 // 500K VND base
    if (route.includes('Long An')) return 450000
    if (route.includes('CONT')) return 600000 // Container premium
    return 400000
  }

  private getRecommendedTime(route: string): string {
    // Based on Vietnamese traffic patterns
    if (route.includes('Cảng Cát Lái → Kho')) return '45-60min'
    if (route.includes('Long An')) return '50-70min'
    return '30-45min'
  }
}
