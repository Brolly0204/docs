import { Button } from "@/components/tiptap-ui-primitive/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/tiptap-utils";
import useEditorStore from "@/store/use-editor-store";
import { isActive } from "@tiptap/core";
import { Type, ChevronDown, ALargeSmall } from "lucide-react";

const fontSize = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'];

const FontSizeDropdown = () => {
    const { editor } = useEditorStore();
    const currentFontSize = editor?.getAttributes('textStyle').fontSize;
    const isEditorFocused = editor?.isFocused
    const isTextContent = editor?.state.selection.$from.parent.isTextblock || false

    const isDisabled = (isEditorFocused && !isTextContent);

    return (<DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isDisabled}>
            <Button
                data-style="ghost"
                data-active-state={isDisabled ? 'off' : 'on'}
                className={cn(isDisabled ? 'cursor-not-allowed opacity-50' : '')}

            >
                {currentFontSize || <ALargeSmall className="w-4 h-4 shrink-0" />}<ChevronDown className="w-2.5 h-2.5" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='rounded-2xl border-none bg-popover p-2 shadow-md'>
            {fontSize.map((size) => {
                const isActive = editor?.isActive('textStyle', { fontSize: size });
                return <DropdownMenuItem key={size} asChild >
                    <Button
                        data-style="ghost"
                        data-active-state={isActive ? 'on' : 'off'}
                        className={cn(isActive ? 'is-active' : '', 'w-full justify-start')}
                        onClick={() => {
                            if (isActive) {
                                // 如果已经是当前大小，取消设置
                                editor?.chain().focus().unsetFontSize().run()
                            } else {
                                // 否则设置新的字体大小
                                editor?.chain().focus().setFontSize(size).run()
                            }
                        }}
                    >{size}</Button>
                </DropdownMenuItem>
            })}
        </DropdownMenuContent>
    </DropdownMenu>
    );
}

export default FontSizeDropdown;