import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ScheduleGrid from './components/ScheduleGrid'

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('bf-theme') === 'dark')

  useEffect(() => {
    localStorage.setItem('bf-theme', dark ? 'dark' : 'light')
  }, [dark])

  async function handleExport() {
    const el = document.getElementById('schedule-root')
    if (!el) return

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: dark ? '#3B3B3B' : '#F9F9E0',
      useCORS: true,
      height: el.scrollHeight,
      windowHeight: el.scrollHeight,
      scrollY: -window.scrollY,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] })
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('daily-schedule.pdf')
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F9F9E0] dark:bg-[#3B3B3B] relative">
        <div className="no-print absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={handleExport}
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            title="Export as PDF"
          >
            ↓ PDF
          </button>
          <button
            onClick={() => setDark(d => !d)}
            className="text-lg text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            title="Toggle dark mode"
          >
            {dark ? '☀︎' : '☾'}
          </button>
        </div>
        <ScheduleGrid />
      </div>
    </div>
  )
}

export default App
