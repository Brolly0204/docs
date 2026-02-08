import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { Type } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/tiptap-utils'

const fontFamilies = ['Times New Roman', 'Inter', 'serif', 'monospace', 'cursive', 'Arial', 'Courier New', 'Georgia', 'Verdana', 'Exo 2']
export default function FontFamilyDropdown() {
    const { editor } = useEditorStore()

    // 检查编辑器是否聚焦
    const isEditorFocused = editor?.isFocused

    // 检查当前选中的内容是否是文字（或光标所在位置是否在文字内容中）
    const isTextContent = editor?.state.selection.$from.parent.isTextblock || false

    // 获取当前选中文字的字体
    const currentFont = editor?.getAttributes('textStyle').fontFamily;
    // 检查当前字体是否在下拉列表中
    const isActive = isEditorFocused && isTextContent && currentFont && fontFamilies.includes(currentFont);

    // 当选中的内容不是文字时，禁用触发器按钮
    const isDisabled = (isEditorFocused && !isTextContent);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    data-style="ghost"
                    data-active-state={isActive ? 'on' : 'off'}
                    className={cn(isActive ? 'is-active' : '', isDisabled ? 'cursor-not-allowed opacity-50' : '')}
                    disabled={isDisabled}
                >
                    {currentFont || <Type className="w-4 h-4" />}<ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-2 shadow-md'>
                <DropdownMenuGroup>
                    {fontFamilies.map((font) => {
                        const isActive = editor?.isActive('textStyle', { fontFamily: font })
                        return <DropdownMenuItem asChild key={font}>
                            <Button
                                className={cn(isActive ? 'is-active' : '', 'w-full justify-start')}
                                data-active-state={isActive ? 'on' : 'off'}
                                data-style="ghost"
                                onClick={() => {
                                    editor?.chain().focus().setFontFamily(font).run()
                                }}
                                style={{
                                    fontFamily: font,
                                }}
                            >
                                {font}
                            </Button>
                        </DropdownMenuItem>
                    })}
                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}