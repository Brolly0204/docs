import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { PaletteIcon, HighlighterIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/tiptap-utils'
import { ColorHighlightButton } from '@/components/tiptap-ui/color-highlight-button'


// 定义颜色选项
const textColors = [
    { name: 'Default', value: '#000000' },
    { name: 'Gray', value: '#808080' },
    { name: 'Brown', value: '#A52A2A' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Green', value: '#008000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Purple', value: '#800080' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Red', value: '#FF0000' },
]

export default function ColorSelectorDropdown() {
    const { editor } = useEditorStore()

    // 获取当前文字颜色
    const currentTextColor = editor?.getAttributes('textStyle').color || textColors[0].value

    // 检查编辑器是否聚焦
    const isEditorFocused = editor?.isFocused

    // 检查当前选中的内容是否是文字
    const isTextContent = editor?.state.selection.$from.marks().some(mark => mark.type.name === 'textStyle' || mark.type.name === 'highlight') ||
        editor?.state.selection.$from.parent.isTextblock

    // 只有当编辑器聚焦且选中的是文字内容时，才显示激活状态
    const shouldShowActive = isEditorFocused && isTextContent

    // 当选中的内容不是文字时，禁用触发器按钮
    const isDisabled = isEditorFocused && !isTextContent

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    data-style="ghost"
                    data-active-state={shouldShowActive ? 'on' : 'off'}
                    disabled={isDisabled}
                    style={{ color: currentTextColor }}
                >
                    <PaletteIcon className="w-4 h-4" />
                    <ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-3 shadow-md w-[240px]'>
                <DropdownMenuLabel className='text-sm font-medium text-muted-foreground mb-2'>Text Color</DropdownMenuLabel>
                <div className='grid grid-cols-5 gap-2'>
                    {textColors.map((color) => {
                        // 获取当前文字颜色
                        const currentColor = editor?.getAttributes('textStyle').color
                        // 如果没有设置颜色（默认黑色）且当前颜色选项是黑色，则标记为激活
                        const isActive =
                            (currentColor === color.value) ||
                            (currentColor === undefined && color.value === '#000000')
                        return (
                            <DropdownMenuItem
                                asChild
                                key={`text-${color.name}`}
                                className='p-0'
                            >
                                <Button
                                    data-active-state={isActive ? 'on' : 'off'}
                                    className={cn(
                                        isActive ? 'is-active' : '',
                                        'w-8 h-8 p-1',
                                        'justify-center items-center'
                                    )}
                                    data-style="ghost"
                                    onClick={() => {
                                        if (editor) {
                                            // 检查是否有实际选中的内容
                                            const hasSelection = editor.state.selection.ranges.some(range => {
                                                return range.$from.pos !== range.$to.pos;
                                            });

                                            // 检查光标位置是否在文本块中
                                            const isInTextBlock = editor.state.selection.$from.parent.isTextblock;

                                            // 检查是否有存储的标记（用于格式刷功能）
                                            const hasStoredMarks = !!editor.state.storedMarks;

                                            // 只有当有实际选中内容或光标在文本块中或有存储标记时，才应用颜色
                                            if (!hasSelection && !isInTextBlock && !hasStoredMarks) {
                                                return;
                                            }

                                            const currentColor = editor.getAttributes('textStyle').color;
                                            if (currentColor === color.value) {
                                                // 如果当前颜色已选中，再次点击则重置为默认颜色
                                                editor.chain()
                                                    .focus()
                                                    .unsetColor()
                                                    .run();
                                                return;
                                            }

                                            // 应用颜色
                                            editor.chain()
                                                .focus()
                                                .setColor(color.value)
                                                .run();
                                        }
                                    }}
                                >
                                    <span
                                        className='w-6 h-6 shrink-0 font-semibold rounded-full flex items-center justify-center text-xs border'
                                        style={{
                                            borderColor: color.value,
                                            color: color.value
                                        }}
                                    >
                                        A
                                    </span>
                                </Button>
                            </DropdownMenuItem>
                        )
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}