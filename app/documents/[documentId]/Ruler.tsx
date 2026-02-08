'use client'
import { cn } from "@/lib/tiptap-utils";
import { Divide, SeparatorVertical } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

const markers = Array.from({ length: 83 }, (_, i) => i);
const Ruler = () => {
  const ruleWidth = 816
  const markerWidth = ruleWidth / 82
  const ruleRef = useRef<HTMLDivElement>(null);
  const markerGap = 100
  const [leftMargin, setLeftMargin] = useState(56);
  const [rightMargin, setRightMargin] = useState(56);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // 使用ref存储拖拽状态，避免状态更新导致的抖动
  const dragStateRef = useRef({
    isDraggingLeft: false,
    isDraggingRight: false,
    leftMargin: 56,
    rightMargin: 56
  });

  // 防抖动画帧ID
  const animationFrameRef = useRef<number | null>(null);

  const handleDraggingleft = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingLeft(true);
    dragStateRef.current.isDraggingLeft = true;
    dragStateRef.current.leftMargin = leftMargin;
    dragStateRef.current.rightMargin = rightMargin;
  }, [leftMargin, rightMargin]);

  const handleDraggingright = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingRight(true);
    dragStateRef.current.isDraggingRight = true;
    dragStateRef.current.leftMargin = leftMargin;
    dragStateRef.current.rightMargin = rightMargin;
  }, [leftMargin, rightMargin]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
    dragStateRef.current.isDraggingLeft = false;
    dragStateRef.current.isDraggingRight = false;

    // 清除动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // 添加全局鼠标事件监听，确保鼠标离开标尺区域也能正确释放拖拽
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingLeft || isDraggingRight) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseLeave = (event: MouseEvent) => {
      // 如果鼠标离开文档区域，强制释放拖拽
      if (isDraggingLeft || isDraggingRight) {
        handleMouseUp();
      }
    };

    // 监听全局鼠标事件
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, [isDraggingLeft, isDraggingRight, handleMouseUp]);

  const handleLeftDoubleClick = useCallback(() => {
    setLeftMargin(56);
  }, []);

  const handleRightDoubleClick = useCallback(() => {
    setRightMargin(56);
  }, []);

  const handlerMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // 使用防抖优化，避免频繁的状态更新
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const { isDraggingLeft, isDraggingRight, leftMargin: dragLeft, rightMargin: dragRight } = dragStateRef.current;

      if ((isDraggingLeft || isDraggingRight) && ruleRef.current) {
        event.preventDefault();

        const container = ruleRef.current.querySelector('.rule-container');
        if (!container) {
          return;
        };

        const { clientX } = event;
        const { left, width } = container.getBoundingClientRect();
        const position = clientX - left;
        const rowPosition = Math.max(0, Math.min(width, position));

        if (isDraggingLeft) {
          // 正确的边界计算：左手柄不能超过右手柄减去最小间距
          const maxLeft = width - markerGap - dragRight;
          const newLeftPosition = Math.max(0, Math.min(rowPosition, maxLeft));
          setLeftMargin(newLeftPosition);
        } else {
          // 正确的边界计算：右手柄不能超过左手柄加上最小间距
          const maxRight = width - markerGap - dragLeft;
          const newRightPosition = Math.max(0, Math.min(width - rowPosition, maxRight));
          setRightMargin(newRightPosition);
        }
      }
    });
  }, [markerGap]);

  return (
    <div
      ref={ruleRef}
      onMouseMove={handlerMove}
      onMouseUp={handleMouseUp}
      className="h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      <div className="rule-container max-w-204 mx-auto mt-11 w-full h-full relative">
        <Marker
          position={leftMargin}
          isDragging={isDraggingLeft}
          onMouseDown={handleDraggingleft}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleDraggingright}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 h-full bottom-0">
          <div className="relative h-full w-204">
            {
              markers.map((marker) => {
                const position = markerWidth * marker
                return (<div key={marker} className="absolute bottom-0" style={{ left: `${position}px` }}>
                  {
                    marker % 10 === 0 && (<div className="absolute bottom-0 w-px h-2 bg-neutral-500" >
                      <span className="text-xs text-neutral-500 absolute bottom-2 transform -translate-x-1/2">{marker / 10 + 1}</span>
                    </div>)
                  }
                  {
                    marker % 5 === 0 && (marker % 10 !== 0 && <div className="absolute bottom-0 w-px h-1.5 bg-neutral-500" />)
                  }
                  {
                    marker % 5 !== 0 && (<div className="absolute bottom-0 w-px h-1 bg-neutral-500" />)
                  }
                </div>)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

interface MarkerProps {
  position: number;
  isLeft?: boolean;
  isDragging: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Marker = ({ position, isLeft = true, isDragging, onMouseDown, onDoubleClick }: MarkerProps) => {
  return (<div className={
    cn(
      'absolute top-0 w-4 h-full cursor-ew-resize z-5 -ml-2',
      isDragging && 'bg-gray-100',
      !isLeft && 'transform translate-x-1/2',
    )}
    style={{ [isLeft ? 'left' : 'right']: `${position}px` }}
    onMouseDown={onMouseDown}
    onDoubleClick={onDoubleClick}
  >
    <SeparatorVertical className="absolute top-0 h-full left-1/2 fill-blue-500 transform -translate-x-1/2" />
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 duration-30 transition-opacity w-[1px] h-screen bg-blue-500"
      style={{ display: isDragging ? 'block' : 'none' }}
    ></div>
  </div>)
}

export default Ruler;