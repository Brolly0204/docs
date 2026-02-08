import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { ChevronDown, PaletteIcon } from 'lucide-react'
import { SketchPicker } from 'react-color'

export default function ColorSelectorDropdown() {
    const { editor } = useEditorStore()

    // 获取当前文字颜色
    const currentTextColor = editor?.getAttributes('textStyle').color || '#000000'

    // 处理颜色选择
    const handleColorChange = (color: any) => {
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
            if (currentColor === color.hex) {
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
                .setColor(color.hex)
                .run();
        }
    }

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
            <DropdownMenuTrigger asChild disabled={isDisabled}>
                <Button
                    data-style="ghost"
                    data-active-state={shouldShowActive ? 'on' : 'off'}
                    disabled={isDisabled}
                    style={{ color: currentTextColor !== '#ffffff' ? currentTextColor : undefined }}
                >
                    <PaletteIcon className="w-4 h-4" />
                    <ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-3 shadow-md'>
                <SketchPicker
                    color={currentTextColor}
                    onChange={handleColorChange}
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