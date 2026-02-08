import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import useEditorStore from "@/store/use-editor-store"
const ListDropdown = () => {
    const { editor } = useEditorStore()
    return (
        <ListDropdownMenu
            editor={editor!}
            types={['bulletList', 'orderedList', 'taskList']}
            hideWhenUnavailable={true}
            portal={false}
            onOpenChange={(isOpen) => console.log('Dropdown opened:', isOpen)}
        />
    )
}


export default ListDropdown
