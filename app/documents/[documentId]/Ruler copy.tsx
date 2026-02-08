'use client'

import { useState } from 'react'

interface RulerProps {
  onWidthChange?: (width: number) => void
}

export default function Ruler({ onWidthChange }: RulerProps) {
  const [documentWidth, setDocumentWidth] = useState(816) // 默认宽度816px
  const totalTicks = 83 // 总刻度数
  const ticksPerGroup = 10 // 每10个刻度为一组

  // 生成刻度数据
  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    const isMajorTick = i % ticksPerGroup === 0 // 每10个刻度显示数字
    const tickNumber = i / ticksPerGroup

    return {
      position: i,
      isMajorTick,
      tickNumber: isMajorTick ? tickNumber : null,
      pixelPosition: (i / totalTicks) * documentWidth
    }
  })

  const handleWidthChange = (newWidth: number) => {
    setDocumentWidth(newWidth)
    onWidthChange?.(newWidth)
  }

  return (
    <div className="flex justify-center mb-4" >
      <div
        className="relative bg-gray-50 border border-gray-200 rounded-md h-12"
        style={{ width: `${documentWidth}px` }
        }
      >
        {/* 标尺刻度 */}
        < div className="absolute top-0 left-0 right-0 h-6 flex" >
          {
            ticks.map((tick) => (
              <div
                key={tick.position}
                className="absolute border-l border-gray-300"
                style={{
                  left: `${tick.pixelPosition}px`,
                  height: tick.isMajorTick ? '12px' : '6px',
                  top: tick.isMajorTick ? '0px' : '6px'
                }}
              >
                {
                  tick.isMajorTick && (
                    <span
                      className="absolute text-[10px] text-gray-500 -translate-x-1/2 mt-1"
                      style={{ left: '50%' }}
                    >
                      {tick.tickNumber}
                    </span>
                  )}
              </div>
            ))}
        </div>

        {/* 宽度调整手柄 */}
        <div className="absolute top-6 left-0 right-0 h-6 flex items-center justify-between px-2" >
          <button
            className="w-4 h-4 bg-blue-500 rounded-full cursor-ew-resize flex items-center justify-center text-white text-xs"
            onMouseDown={(e) => {
              e.preventDefault()
              const startX = e.clientX
              const startWidth = documentWidth

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX
                const newWidth = Math.max(400, Math.min(1200, startWidth + deltaX))
                handleWidthChange(newWidth)
              }

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
            title="调整文档宽度"
          >
            ←
          </button>

          < span className="text-xs text-gray-500" > {documentWidth}px </span>

          < button
            className="w-4 h-4 bg-blue-500 rounded-full cursor-ew-resize flex items-center justify-center text-white text-xs"
            onMouseDown={(e) => {
              e.preventDefault()
              const startX = e.clientX
              const startWidth = documentWidth

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX
                const newWidth = Math.max(400, Math.min(1200, startWidth + deltaX))
                handleWidthChange(newWidth)
              }

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
            title="调整文档宽度"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
