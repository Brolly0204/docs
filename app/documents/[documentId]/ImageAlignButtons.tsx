import { ImageAlignButton } from "@/components/tiptap-ui/image-align-button";
import useEditorStore from "@/store/use-editor-store";

export default function ImageAlignButtons() {
  const { editor } = useEditorStore();
  return (
    <div className="flex items-center gap-1">
      <ImageAlignButton
        editor={editor}
        align="left"
        hideWhenUnavailable={true}
        onAligned={() => console.log('Image aligned!')}
      />
      <ImageAlignButton
        editor={editor}
        align="center"
        hideWhenUnavailable={true}
      />
      <ImageAlignButton
        editor={editor}
        align="right"
        hideWhenUnavailable={true}
      />
    </div>
  )
}