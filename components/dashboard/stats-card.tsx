interface StatsCardProps {
  title: string
  value: string
  description?: string
  trend?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, description, trend, icon }: StatsCardProps) {
  // Added subtle hover effect to make the dashboard feel more interactive
  // The transition makes it feel polished without being distracting
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4">
          <span className="text-xs text-green-600">{trend}</span>
        </div>
      )}
    </div>
  )
}