import useEditorStore from "@/store/use-editor-store";
import { TextAlign } from '@tiptap/extension-text-align'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
const TextAlignButtons = () => {
    const { editor } = useEditorStore();

    return (
        <div className="flex items-center">
            <TextAlignButton
                editor={editor}
                align="left"
                onAligned={() => console.log('Text aligned!')}
            />
            <TextAlignButton editor={editor} align="center" />
            <TextAlignButton editor={editor} align="right" />
            <TextAlignButton editor={editor} align="justify" />
        </div>
    )
}

export default TextAlignButtons

