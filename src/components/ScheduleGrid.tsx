import { useState } from 'react'

interface TimeBlock {
  label: string
  category: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const CATEGORIES = ['Work', 'Learning', 'Exercise', 'Meals', 'Rest', 'Personal', 'Reflection']

const STORAGE_KEY = 'bf-scheduler-blocks'

function loadBlocks(): Record<number, TimeBlock> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBlocks(blocks: Record<number, TimeBlock>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

function ScheduleGrid() {
  const [blocks, setBlocks] = useState<Record<number, TimeBlock>>(loadBlocks)
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState({ label: '', category: CATEGORIES[0] })

  function openSlot(hour: number) {
    const existing = blocks[hour]
    setDraft({ label: existing?.label ?? '', category: existing?.category ?? CATEGORIES[0] })
    setEditing(hour)
  }

  function saveSlot() {
    if (editing === null) return
    const updated = { ...blocks }
    if (draft.label.trim() === '') {
      delete updated[editing]
    } else {
      updated[editing] = { label: draft.label.trim(), category: draft.category }
    }
    setBlocks(updated)
    saveBlocks(updated)
    setEditing(null)
  }

  function cancelEdit() {
    setEditing(null)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-stone-700 mb-1 tracking-wide uppercase">
        Daily Schedule
      </h1>
      <p className="text-center text-stone-400 text-sm mb-8 italic">
        What good shall I do this day?
      </p>

      <div className="border border-stone-300 divide-y divide-stone-300 rounded">
        {HOURS.map((hour) => {
          const block = blocks[hour]
          const isEditing = editing === hour

          return (
            <div key={hour} className="flex items-stretch">
              <div className="w-20 shrink-0 flex items-center justify-center text-xs font-semibold text-stone-500 border-r border-stone-300 py-3 bg-[#f0eed4]">
                {formatHour(hour)}
              </div>

              <div className="flex-1 px-4 py-2 min-h-[48px]">
                {isEditing ? (
                  <div className="flex flex-col gap-2 py-1">
                    <input
                      autoFocus
                      type="text"
                      placeholder="What are you doing this hour?"
                      value={draft.label}
                      onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveSlot(); if (e.key === 'Escape') cancelEdit() }}
                      className="w-full border border-stone-300 rounded px-2 py-1 text-sm text-stone-700 bg-[#F9F9E0] focus:outline-none focus:border-stone-500"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                        className="border border-stone-300 rounded px-2 py-1 text-sm text-stone-600 bg-[#F9F9E0] focus:outline-none focus:border-stone-500"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button onClick={saveSlot} className="text-sm px-3 py-1 bg-stone-600 text-white rounded hover:bg-stone-700">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-sm px-3 py-1 text-stone-500 hover:text-stone-700">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => openSlot(hour)}
                    className="h-full min-h-[40px] flex items-center cursor-pointer group"
                  >
                    {block ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-700">{block.label}</span>
                        <span className="text-xs text-stone-400 italic">{block.category}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-300 group-hover:text-stone-400">+ add block</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScheduleGrid
