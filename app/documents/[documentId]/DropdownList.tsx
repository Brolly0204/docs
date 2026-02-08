import { useListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { ListButton } from '@/components/tiptap-ui/list-button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button, ButtonGroup } from '@/components/tiptap-ui-primitive/button'
import useEditorStore from '@/store/use-editor-store'

export default function MyListDropdown() {
    const { editor } = useEditorStore()
    const { filteredLists, canToggle, isActive, isVisible, Icon, activeType } = useListDropdownMenu({
        editor,
        types: ['bulletList', 'orderedList', 'taskList'],
        hideWhenUnavailable: false,
    })

    if (!isVisible) return null

    console.log('canToggle', canToggle)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!canToggle}>
                <Button disabled={!canToggle}>
                    <Icon />
                    Lists {isActive ? '(Active)' : ''}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <ButtonGroup>
                    {filteredLists.map((option) => (
                        <DropdownMenuItem key={option.type} asChild>
                            <ListButton editor={editor} type={option.type} text={option.label} />
                        </DropdownMenuItem>
                    ))}
                </ButtonGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}