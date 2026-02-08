import Editor from "./Editor";
import Toolbar from "./Toolbar";
import Ruler from "./Ruler"; // 新增导入

interface DocumentPageProps {
    params: Promise<{
        documentId: string;
    }>;
}

const DocumentPage = async ({ params }: DocumentPageProps) => {
    const { documentId } = await params;

    return (
        <div className="size-full overflow-hidden bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
            <div className="size-full flex flex-col print:h-auto print:w-full print:py-0">
                <Toolbar />
                <Ruler /> {/* 新增标尺组件 */}
                <Editor />
            </div>
        </div>
    );
}

export default DocumentPage;