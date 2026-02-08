'use client'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Table,
    Image,
    Undo2,
    Redo2,
} from 'lucide-react'

interface ToolbarProps {
    editor: Editor | null
}

export const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null

    const handleImageInsert = () => {
        const url = prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const handleTableInsert = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
    }

    return (
        <div className='sticky top-0 z-50 flex flex-wrap items-center gap-1 bg-white border-b border-gray-200 p-3 rounded-t-md shadow-sm'>
            {/* Text Format Group */}
            <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    title='Bold (Cmd+B)'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    title='Italic (Cmd+I)'
                />
            </div>

            {/* Heading Group */}
            <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    title='Heading 1'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    title='Heading 2'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading3}
                    title='Heading 3'
                />
            </div>

            {/* List Group */}
            <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    title='Bullet List'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title='Ordered List'
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive('taskList')}
                    icon={CheckSquare}
                    title='Task List'
                />
            </div>

            {/* Insert Group */}
            <div className='flex items-center gap-1 border-r border-gray-200 pr-2'>
                <ToolbarButton
                    onClick={handleImageInsert}
                    icon={Image}
                    title='Insert Image'
                />
                <ToolbarButton
                    onClick={handleTableInsert}
                    icon={Table}
                    title='Insert Table'
                />
            </div>

            {/* Undo/Redo Group */}
            <div className='flex items-center gap-1'>
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo2}
                    title='Undo'
                    disabled={!editor.can().undo()}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo2}
                    title='Redo'
                    disabled={!editor.can().redo()}
                />
            </div>
        </div>
    )
}

interface ToolbarButtonProps {
    onClick: () => void
    isActive?: boolean
    icon: React.ComponentType<{ className?: string }>
    title: string
    disabled?: boolean
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    title,
    disabled = false,
}: ToolbarButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <Icon size={18} />
        </button>
    )
}
