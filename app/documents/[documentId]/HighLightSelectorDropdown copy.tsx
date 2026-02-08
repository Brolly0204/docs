import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { HighlighterIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { ColorHighlightButton } from '@/components/tiptap-ui/color-highlight-button'

const highlightColors = [
    { name: 'None', value: '#ffffff' },
    { name: 'Gray', value: '#CCCCCC' },
    { name: 'Light Gray', value: '#F0F0F0' },
    { name: 'Tan', value: '#D2B48C' },
    { name: 'Yellow', value: '#FFFF99' },
    { name: 'Green', value: '#90EE90' },
    { name: 'Blue', value: '#ADD8E6' },
    { name: 'Violet', value: '#EE82EE' },
    { name: 'Light Pink', value: '#FFB6C1' },
    { name: 'Pink', value: '#FFC0CB' },
]

export default function ColorSelectorDropdown() {
    const { editor } = useEditorStore()

    // 检查编辑器是否聚焦
    const isEditorFocused = editor?.isFocused
    // 获取当前高亮颜色
    const currentHighlightColor = editor?.getAttributes('highlight').color

    // 检查当前选中的内容是否是文字
    const isTextContent = editor?.state.selection.$from.marks().some(mark => mark.type.name === 'textStyle' || mark.type.name === 'highlight') ||
        editor?.state.selection.$from.parent.isTextblock

    // 只有当编辑器聚焦且选中的文字有高亮颜色时，才显示激活状态
    const shouldShowActive = isEditorFocused && isTextContent && currentHighlightColor && currentHighlightColor !== '#ffffff'

    // 当选中的内容不是文字时，禁用触发器按钮
    const isDisabled = isEditorFocused && !isTextContent



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    data-style="ghost"
                    data-active-state={shouldShowActive ? 'on' : 'off'}
                    style={{ color: currentHighlightColor }}
                    disabled={isDisabled}
                >
                    <HighlighterIcon className="w-4 h-4" />
                    <ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-3 shadow-md w-[240px]'>

                <DropdownMenuLabel className='text-sm font-medium text-muted-foreground mb-2'>Highlight Color</DropdownMenuLabel>
                <div className='grid grid-cols-5 gap-2'>
                    {highlightColors.map((color) => {
                        const isActive = editor?.isActive('highlight', { color: color.value })
                        return (
                            <DropdownMenuItem
                                asChild
                                key={`highlight-${color.name}`}
                                className='p-0'
                            >
                                <ColorHighlightButton
                                    editor={editor}
                                    tooltip={color.name}
                                    highlightColor={color.value}
                                    hideWhenUnavailable={true}
                                    onApplied={({ color, label }) => {
                                        console.log(`Applied ${label} highlight: ${color}`)
                                    }}
                                />
                            </DropdownMenuItem>
                        )
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}