import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { HighlighterIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { SketchPicker } from 'react-color'

// 定义高亮预设颜色选项
const highlightPresetColors = [
    '#ffffff', '#CCCCCC', '#F0F0F0', '#D2B48C', '#FFFF99',
    '#90EE90', '#ADD8E6', '#EE82EE', '#FFB6C1', '#FFC0CB'
]

export default function ColorSelectorDropdown() {
    const { editor } = useEditorStore()

    // 检查编辑器是否聚焦
    const isEditorFocused = editor?.isFocused
    // 获取当前高亮颜色
    const currentHighlightColor = editor?.getAttributes('highlight').color || '#ffffff'

    // 检查当前选中的内容是否是文字
    const isTextContent = editor?.state.selection.$from.marks().some(mark => mark.type.name === 'textStyle' || mark.type.name === 'highlight') ||
        editor?.state.selection.$from.parent.isTextblock

    // 只有当编辑器聚焦且选中的文字有高亮颜色时，才显示激活状态
    const shouldShowActive = isEditorFocused && isTextContent && currentHighlightColor && currentHighlightColor !== '#ffffff'

    // 当选中的内容不是文字时，禁用触发器按钮
    const isDisabled = isEditorFocused && !isTextContent

    // 处理高亮颜色选择
    const handleHighlightColorChange = (color: any) => {
        if (editor) {
            // 检查是否有实际选中的内容
            const hasSelection = editor.state.selection.ranges.some(range => {
                return range.$from.pos !== range.$to.pos;
            });

            // 检查光标位置是否在文本块中
            const isInTextBlock = editor.state.selection.$from.parent.isTextblock;

            // 检查是否有存储的标记（用于格式刷功能）
            const hasStoredMarks = !!editor.state.storedMarks;

            // 只有当有实际选中内容或光标在文本块中或有存储标记时，才应用高亮
            if (!hasSelection && !isInTextBlock && !hasStoredMarks) {
                return;
            }

            const currentColor = editor.getAttributes('highlight').color;
            if (currentColor === color.hex) {
                // 如果当前高亮颜色已选中，再次点击则移除高亮
                editor.chain()
                    .focus()
                    .unsetHighlight()
                    .run();
                return;
            }

            // 应用高亮颜色
            editor.chain()
                .focus()
                .setHighlight({ color: color.hex })
                .run();
        }
    }



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    data-style="ghost"
                    data-active-state={shouldShowActive ? 'on' : 'off'}
                    style={{ color: currentHighlightColor !== '#ffffff' ? currentHighlightColor : undefined }}
                    disabled={isDisabled}
                >
                    <HighlighterIcon className="w-4 h-4" />
                    <ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-3 shadow-md'>
                <DropdownMenuLabel className='text-sm font-medium text-muted-foreground mb-2'>Highlight Color</DropdownMenuLabel>
                <SketchPicker
                    color={currentHighlightColor}
                    onChange={handleHighlightColorChange}
                    presetColors={highlightPresetColors}
                    width="240px"
                    styles={{
                        default: {
                            picker: {
                                boxShadow: 'none',
                                background: 'transparent',
                                padding: 0
                            },
                            saturation: {
                                borderRadius: '8px',
                                marginBottom: '8px'
                            },
                            controls: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            },
                            hue: {
                                borderRadius: '4px',
                                height: '8px'
                            },
                            alpha: {
                                borderRadius: '4px',
                                height: '8px'
                            }
                        }
                    }}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}