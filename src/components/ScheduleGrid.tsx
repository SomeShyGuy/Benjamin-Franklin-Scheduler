import { useState, useEffect } from 'react'

interface TimeBlock {
  label: string
  category: string
  notes?: string
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
  const [dragState, setDragState] = useState<{ sourceHour: number; toHour: number } | null>(null)
  const [notesEditing, setNotesEditing] = useState<number | null>(null)
  const [notesDraft, setNotesDraft] = useState('')

  useEffect(() => {
    if (!dragState) return
    const { sourceHour, toHour } = dragState

    function handleMouseUp() {
      if (toHour > sourceHour) {
        const sourceBlock = blocks[sourceHour]
        if (sourceBlock) {
          const updated = { ...blocks }
          for (let h = sourceHour + 1; h <= toHour; h++) {
            updated[h] = { label: sourceBlock.label, category: sourceBlock.category }
          }
          setBlocks(updated)
          saveBlocks(updated)
        }
      }
      setDragState(null)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [dragState, blocks])

  function startDrag(hour: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragState({ sourceHour: hour, toHour: hour })
  }

  function onRowMouseEnter(hour: number) {
    if (!dragState) return
    if (hour >= dragState.sourceHour) {
      setDragState({ ...dragState, toHour: hour })
    }
  }

  function openSlot(hour: number) {
    const existing = blocks[hour]
    setDraft({ label: existing?.label ?? '', category: existing?.category ?? CATEGORIES[0] })
    setEditing(hour)
    setNotesEditing(null)
  }

  function saveSlot() {
    if (editing === null) return
    const updated = { ...blocks }
    if (draft.label.trim() === '') {
      delete updated[editing]
    } else {
      updated[editing] = { ...updated[editing], label: draft.label.trim(), category: draft.category }
    }
    setBlocks(updated)
    saveBlocks(updated)
    setEditing(null)
  }

  function cancelEdit() {
    setEditing(null)
  }

  function clearSlot(hour: number, e: React.MouseEvent) {
    e.stopPropagation()
    const updated = { ...blocks }
    delete updated[hour]
    setBlocks(updated)
    saveBlocks(updated)
    if (notesEditing !== null) {
      const g = groupOf[hour]
      if (g && notesEditing === g.start) setNotesEditing(null)
    }
  }

  function detectGroup(hour: number): { start: number; end: number } {
    const block = blocks[hour]
    if (!block) return { start: hour, end: hour }
    let start = hour
    while (start > 0 && blocks[start - 1]?.label === block.label && blocks[start - 1]?.category === block.category) start--
    let end = hour
    while (end < 23 && blocks[end + 1]?.label === block.label && blocks[end + 1]?.category === block.category) end++
    return { start, end }
  }

  function openNotes(hour: number, e: React.MouseEvent) {
    e.stopPropagation()
    const group = detectGroup(hour)
    setNotesDraft(blocks[group.start]?.notes ?? '')
    setNotesEditing(group.start)
    setEditing(null)
  }

  function saveNotes() {
    if (notesEditing === null) return
    const updated = { ...blocks }
    if (updated[notesEditing]) {
      const trimmed = notesDraft.trim()
      updated[notesEditing] = { ...updated[notesEditing], notes: trimmed || undefined }
    }
    setBlocks(updated)
    saveBlocks(updated)
    setNotesEditing(null)
  }

  function closeNotes() {
    setNotesEditing(null)
  }

  // Precompute group membership for every hour
  const groupOf: Record<number, { start: number; end: number }> = {}
  const processed = new Set<number>()
  for (const h of HOURS) {
    if (processed.has(h) || !blocks[h]) continue
    const ref = blocks[h]
    let s = h
    while (s > 0 && blocks[s - 1]?.label === ref.label && blocks[s - 1]?.category === ref.category) s--
    let e = h
    while (e < 23 && blocks[e + 1]?.label === ref.label && blocks[e + 1]?.category === ref.category) e++
    for (let i = s; i <= e; i++) {
      groupOf[i] = { start: s, end: e }
      processed.add(i)
    }
  }

  // Collect unique groups that need a note panel rendered
  const activeGroups: Array<{ start: number; end: number }> = []
  const seenStarts = new Set<number>()
  for (const h of HOURS) {
    const group = groupOf[h]
    if (!group || seenStarts.has(group.start)) continue
    seenStarts.add(group.start)
    if (notesEditing === group.start || !!blocks[group.start]?.notes) {
      activeGroups.push(group)
    }
  }

  const hasAnyNotes = Object.values(blocks).some(b => b?.notes)
  const showLeftPanel = hasAnyNotes || notesEditing !== null

  // CSS Grid: col 1 = notes content, col 2 = brace, col 3 = time, col 4 = block content
  // Each hour occupies exactly one grid row. Note panels span their group's rows via grid-row.
  const gridCols = showLeftPanel ? '9rem 1rem 5rem 1fr' : '5rem 1fr'
  const timeCol = showLeftPanel ? 3 : 1
  const contentCol = showLeftPanel ? 4 : 2

  return (
    <div className={`max-w-3xl mx-auto py-10 px-4${dragState ? ' select-none' : ''}`}>
      <h1 className="text-2xl font-bold text-center text-stone-700 mb-1 tracking-wide uppercase">
        Daily Schedule
      </h1>
      <p className="text-center text-stone-400 text-sm mb-8 italic">
        What good shall I do this day?
      </p>

      <div
        className="border border-stone-300 rounded overflow-hidden"
        style={{ display: 'grid', gridTemplateColumns: gridCols }}
      >
        {/* Note panels — each spans its group's grid rows so it naturally fills that space */}
        {showLeftPanel && activeGroups.map(({ start, end }) => {
          const isEditingThisGroup = notesEditing === start
          const groupHasNotes = !!blocks[start]?.notes
          return (
            <div
              key={`note-panel-${start}`}
              className="flex flex-col px-2 py-1 gap-1 overflow-hidden"
              style={{ gridColumn: 1, gridRow: `${start + 1} / ${end + 2}` }}
            >
              {isEditingThisGroup ? (
                <>
                  <textarea
                    autoFocus
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Escape') closeNotes() }}
                    placeholder="Notes..."
                    rows={Math.max(3, (end - start + 1) * 2)}
                    className="flex-1 w-full text-xs text-stone-700 bg-[#F9F9E0] border border-stone-300 rounded p-1 resize-none focus:outline-none leading-relaxed"
                    style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                  />
                  <div className="flex gap-1 justify-end shrink-0">
                    <button onClick={closeNotes} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
                    <button onClick={saveNotes} className="text-xs px-2 py-0.5 bg-stone-600 text-white rounded hover:bg-stone-700">Save</button>
                  </div>
                </>
              ) : groupHasNotes ? (
                <p className="text-xs text-stone-400 italic leading-relaxed">
                  {blocks[start]?.notes}
                </p>
              ) : null}
            </div>
          )
        })}

        {/* Per-hour cells: brace + time + content */}
        {HOURS.flatMap(hour => {
          const block = blocks[hour]
          const isEditing = editing === hour
          const isDragOver = dragState && hour > dragState.sourceHour && hour <= dragState.toHour
          const hasNotes = !!block?.notes

          const group = groupOf[hour]
          const groupStart = group?.start ?? -1
          const groupEnd = group?.end ?? -1
          const mid = group ? Math.round((groupStart + groupEnd) / 2) : -1
          const isMid = hour === mid
          const isSingle = group ? groupStart === groupEnd : false
          const isGroupStart = group ? hour === groupStart : false
          const isGroupEnd = group ? hour === groupEnd : false
          const isEditingThisGroup = group !== undefined && notesEditing === groupStart
          const groupHasNotes = group !== undefined && !!blocks[groupStart]?.notes
          const showBrace = isEditingThisGroup || groupHasNotes

          const borderTop = hour > 0 ? 'border-t border-stone-300' : ''

          const cells = []

          // Brace cell
          if (showLeftPanel) {
            cells.push(
              <div
                key={`brace-${hour}`}
                className={`relative ${borderTop}`}
                style={{ gridColumn: 2, gridRow: hour + 1 }}
              >
                {showBrace && (
                  <div className={`absolute inset-0 border-l border-stone-300 ${
                    isSingle
                      ? 'border-y rounded-l-lg'
                      : isGroupStart
                        ? 'border-t rounded-tl-lg'
                        : isGroupEnd
                          ? 'border-b rounded-bl-lg'
                          : ''
                  }`} />
                )}
                {isMid && showBrace && (
                  <div
                    className="absolute top-1/2 -translate-y-px border-t border-stone-300"
                    style={{ left: '-0.5rem', width: '0.5rem' }}
                  />
                )}
              </div>
            )
          }

          // Time label cell
          cells.push(
            <div
              key={`time-${hour}`}
              className={`flex items-center justify-center text-xs font-semibold text-stone-500 border-r border-stone-300 py-3 bg-[#f0eed4] ${borderTop}`}
              style={{ gridColumn: timeCol, gridRow: hour + 1 }}
            >
              {formatHour(hour)}
            </div>
          )

          // Content cell
          cells.push(
            <div
              key={`content-${hour}`}
              className={`px-4 py-2 min-h-[48px] relative ${isDragOver ? 'bg-amber-50' : ''} ${borderTop}`}
              onMouseEnter={() => onRowMouseEnter(hour)}
              style={{ gridColumn: contentCol, gridRow: hour + 1 }}
            >
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
                  onClick={() => !dragState && openSlot(hour)}
                  className="h-full min-h-[40px] flex items-center cursor-pointer group"
                >
                  {block ? (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-stone-700">{block.label}</span>
                        <span className="text-xs text-stone-400 italic">{block.category}</span>
                      </div>
                      <div
                        className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 leading-none text-xs cursor-pointer"
                        onClick={(e) => clearSlot(hour, e)}
                        title="Clear block"
                      >
                        ✕
                      </div>
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 right-2 leading-none text-xs cursor-pointer transition-opacity ${
                          hasNotes
                            ? 'opacity-50 text-stone-500 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600'
                        }`}
                        onClick={(e) => openNotes(hour, e)}
                        title="Notes"
                      >
                        ≡
                      </div>
                      <div
                        className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 cursor-grab text-stone-400 hover:text-stone-600 leading-none text-xs"
                        onMouseDown={(e) => startDrag(hour, e)}
                        onClick={(e) => e.stopPropagation()}
                        title="Drag down to fill hours below"
                      >
                        ▼
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-stone-300 group-hover:text-stone-400">+ add block</span>
                  )}
                </div>
              )}
            </div>
          )

          return cells
        })}
      </div>
    </div>
  )
}

export default ScheduleGrid
