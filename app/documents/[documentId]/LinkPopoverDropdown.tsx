import { LinkPopover } from '@/components/tiptap-ui/link-popover/link-popover'
import useEditorStore from '@/store/use-editor-store'

export default function LinkPopoverDropdown() {
    const { editor } = useEditorStore()

    return (
        <LinkPopover
            editor={editor}
            hideWhenUnavailable={false}
            autoOpenOnLinkActive={true}
            onSetLink={() => console.log('Link set!')}
            onOpenChange={(isOpen) => console.log('Popover opened:', isOpen)}
        />
    )
}