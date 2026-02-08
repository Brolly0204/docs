import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button/image-upload-button'
import useEditorStore from '@/store/use-editor-store'

export default function ImageUploadDropdown() {
    const { editor } = useEditorStore()

    return (
        <ImageUploadButton
            editor={editor}
            hideWhenUnavailable={true}
            onInserted={() => console.log('Image inserted!')}
        />
    )
}