import React from "react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HeadingButton } from "@/components/tiptap-ui/heading-button"
import { useHeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import useEditorStore from "@/store/use-editor-store"
import { ChevronDownIcon } from "lucide-react"

function HeadingListDropdown() {
    const { editor } = useEditorStore()
    const { isVisible, activeLevel, isActive, canToggle, levels, label, Icon } =
        useHeadingDropdownMenu({
            editor,
            levels: [1, 2, 3, 4, 5, 6],
            hideWhenUnavailable: false,
        })

    if (!isVisible) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!canToggle}>
                <Button data-style="ghost"
                    data-active-state={isActive ? 'on' : 'off'}
                    className={isActive ? 'is-active' : ''}>
                    {activeLevel ? `H${activeLevel}` : 'Heading'}
                    <ChevronDownIcon className="w-2.5 h-2.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-2xl border-none bg-popover p-2 shadow-md'>
                {levels.map((level) => {
                    // 创建动态H1-H6元素
                    const HeadingTag = React.createElement(
                        `h${level}`,
                        {
                            style: {
                                fontSize: `${1.5 - (level - 1) * 0.15}rem`,
                                fontWeight: 'bold',
                                margin: 0,
                                padding: 0
                            }
                        },
                        `Heading ${level}`
                    );

                    return (
                        <DropdownMenuItem key={level} asChild>
                            <HeadingButton editor={editor} level={level} text={HeadingTag} className="w-full justify-start!" />
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HeadingListDropdown;