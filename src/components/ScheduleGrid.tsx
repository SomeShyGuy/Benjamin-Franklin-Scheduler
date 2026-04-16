const HOURS = Array.from({ length: 24 }, (_, i) => i)

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

function ScheduleGrid() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-stone-700 mb-1 tracking-wide uppercase">
        Daily Schedule
      </h1>
      <p className="text-center text-stone-400 text-sm mb-8 italic">
        What good shall I do this day?
      </p>

      <div className="border border-stone-300 divide-y divide-stone-300 rounded">
        {HOURS.map((hour) => (
          <div key={hour} className="flex items-stretch">
            <div className="w-20 shrink-0 flex items-center justify-center text-xs font-semibold text-stone-500 border-r border-stone-300 py-3 bg-[#f0eed4]">
              {formatHour(hour)}
            </div>
            <div className="flex-1 py-3 px-4 min-h-[48px] text-stone-700" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleGrid