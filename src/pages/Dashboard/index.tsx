import { useState, useMemo } from 'react'
import { formatCurrency, formatCompactNumber } from '@/utils/formatters'
// import { AvailableCars, RentalCars, TotalBooking, TotalRevenue } from '@/components/common/svg/DashboardSVG'
import { StatCard } from './StatCard'
import { RevenueChart } from './RevenueChart'
import { RecentActivityCard } from './RecentActivityCard'
import { yearlyData } from './dashboardData'
import {  DollarSignIcon, FileCheck, ListOrdered, Users } from 'lucide-react'
import { PieChartComponent } from './PieChart'
import { Chatbot } from './Chatbot/Chatbot'
// import { TotalRevenue } from '@/components/common/svg/DashboardSVG'

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('2026')

  const chartData = useMemo(() => yearlyData[selectedYear], [selectedYear])

  const stats = [
    {
      title: 'Active Projects',
      value: formatCompactNumber(12543),
      change: 12.5,
      icon: ListOrdered,
      description: 'vs last month',
    },
    {
      title: 'Total Employees',
      value: formatCompactNumber(3420),
      change: 8.2,
      icon: Users,
      description: 'vs last month',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(142000),
      change: 3.1,
      icon: DollarSignIcon,
      description: 'vs last month',
    },
    {
      title: 'Pending Approvals',
      value: formatCompactNumber(142),
      change: -2.4,
      icon: FileCheck,
      description: 'vs last month',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Chart Section - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
       <div className='col-span-8'>
         <RevenueChart
          chartData={chartData}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear} 
          
        />
       </div>
       <div className='col-span-4'>
        <PieChartComponent />
       </div>
      </div>

      {/* Recent Activity */}
      <div>
        <RecentActivityCard />
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
