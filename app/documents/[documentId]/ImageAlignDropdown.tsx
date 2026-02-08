import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'
import { AlignLeft, AlignCenter, AlignRight, Image } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/tiptap-utils'

export default function ImageAlignDropdown() {
    const { editor } = useEditorStore()

    // 检查当前是否选中了图片
    const isImageSelected = editor?.isActive('image')

    // 获取当前图片的对齐方式
    const currentAlign = editor?.getAttributes('image').dataAlign || 'center'

    // 检查编辑器是否聚焦
    const isEditorFocused = editor?.isFocused

    // 只有当编辑器聚焦且选中了图片时，才启用按钮
    const isDisabled = !isImageSelected

    const alignments = [
        { label: '左对齐', value: 'left', icon: AlignLeft },
        { label: '居中对齐', value: 'center', icon: AlignCenter },
        { label: '右对齐', value: 'right', icon: AlignRight },
    ]

    const handleAlignChange = (alignment: 'left' | 'center' | 'right') => {
        if (editor && isImageSelected) {
            editor.chain().focus().setImageAlign(alignment).run()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isDisabled}>
                <Button
                    data-style="ghost"
                    data-active-state={isImageSelected ? 'on' : 'off'}
                    className={cn(isImageSelected ? 'is-active' : '', isDisabled ? 'cursor-not-allowed opacity-50' : '')}
                >
                    <Image className="w-4 h-4 shrink-0" />
                    <ChevronDown className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-2 shadow-md w-[140px]'>
                <DropdownMenuGroup>
                    {alignments.map((align) => {
                        const isActive = currentAlign === align.value
                        const IconComponent = align.icon
                        return (
                            <DropdownMenuItem asChild key={align.value}>
                                <Button
                                    className={cn(
                                        isActive ? 'is-active' : '',
                                        'w-full justify-start'
                                    )}
                                    data-style="ghost"
                                    onClick={() => handleAlignChange(align.value as 'left' | 'center' | 'right')}
                                >
                                    <IconComponent className="w-4 h-4 mr-2" />
                                    {align.label}
                                </Button>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}