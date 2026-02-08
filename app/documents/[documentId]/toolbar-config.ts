import React from 'react'
import { Editor } from '@tiptap/react'
import { PrinterIcon, SaveIcon, Redo2Icon, Undo2Icon, SpellCheck2Icon, UnderlineIcon, MessageSquarePlusIcon, ListTodoIcon, RemoveFormatting, RemoveFormattingIcon, HighlighterIcon, PaletteIcon } from 'lucide-react'
import { BoldIcon } from '@/components/tiptap-icons/bold-icon'
import { ItalicIcon } from '@/components/tiptap-icons/italic-icon'
import ListDropdown from './ListDropdown'
import FontFamilyDropdown from './FontFamilyDropdown'
import HeadingListDropdown from './HeadingListDropdown'
import ColorSelectorDropdown from './ColorSelectorDropdown'
import HighLightSelectorDropdown from './HighLightSelectorDropdown'
import LinkPopoverDropdown from './LinkPopoverDropdown'
import ImageUploadDropdown from './ImageUploadDropdown'
import ImageAlignDropdown from './ImageAlignDropdown'
import TextAlignButtons from './TextAlignButtons'
import FontSizeDropdown from './FontSizeDropdown'
// import ImageAlignButtons from './ImageAlignButtons'

export interface ToolbarButtonConfig {
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null
    onClick: (editor: Editor) => void
    isActive?: (editor: Editor) => boolean
    dataStyle?: 'ghost' | 'primary' | 'secondary'
    disabled?: (editor: Editor) => boolean
}

export interface ToolbarGroupConfig {
    type: 'group' | 'separator' | 'spacer' | 'custom'
    buttons?: ToolbarButtonConfig[]
    component?: React.FC<any> | React.ReactNode
}

export const getToolbarConfig = (): ToolbarGroupConfig[] => [
    {
        type: 'group',
        buttons: [
            {
                label: 'Undo',
                icon: Undo2Icon,
                onClick: (editor) => editor.chain().focus().undo().run(),
                disabled: (editor) => !editor.can().undo(),
                dataStyle: 'ghost',
            },
            {
                label: 'Redo',
                icon: Redo2Icon,
                onClick: (editor) => editor.chain().focus().redo().run(),
                disabled: (editor) => !editor.can().redo(),
                dataStyle: 'ghost',
            },
            {
                label: 'Print',
                icon: PrinterIcon,
                onClick: () => { window.print() },
                dataStyle: 'ghost',
            },
            {
                label: 'Spell Check',
                icon: SpellCheck2Icon,
                onClick: (editor) => { /* Spellcheck toggle logic here */
                    editor.view.dom.spellcheck = !editor.view.dom.spellcheck
                    editor.view.updateState(editor.view.state);

                },
                dataStyle: 'ghost',
            },
        ],
    },
    {
        type: 'separator',
    },
    {
        type: 'group',
        buttons: [
            {
                label: 'Bold',
                icon: BoldIcon,
                onClick: (editor) => editor.chain().focus().toggleBold().run(),
                isActive: (editor) => editor?.isActive('bold'),
                dataStyle: 'ghost',
            },
            {
                label: 'Italic',
                icon: ItalicIcon,
                onClick: (editor) => editor.chain().focus().toggleItalic().run(),
                isActive: (editor) => editor?.isActive('italic'),
                dataStyle: 'ghost',
            },
            {
                label: 'Underline',
                icon: UnderlineIcon,
                onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
                isActive: (editor) => editor?.isActive('underline'),
                dataStyle: 'ghost',
            },

        ],
    },
    {
        type: 'separator',
    },
    {
        type: 'group',
        buttons: [
            {
                label: 'Comment',
                icon: MessageSquarePlusIcon,
                onClick: () => { console.log('Add Comment Clicked') },
                dataStyle: 'ghost',
            },
            {
                label: 'List Todo',
                icon: ListTodoIcon,
                onClick: (editor) => editor.chain().focus().toggleTaskList().run(),
                dataStyle: 'ghost',
            },
            {
                label: 'Remove Formatting',
                icon: RemoveFormattingIcon,
                onClick: (editor) => editor.chain().focus().unsetAllMarks().run(),
            }

        ]
    },
    {
        type: 'custom',
        component: HeadingListDropdown,
    },
    {
        type: 'custom',
        component: ListDropdown,
    },
    {
        type: 'custom',
        component: FontFamilyDropdown,
    },
    {
        type: 'custom',
        component: FontSizeDropdown,
    },
    {
        type: 'custom',
        component: HighLightSelectorDropdown,
    },
    {
        type: 'custom',
        component: ColorSelectorDropdown,
    },
    {
        type: 'custom',
        component: TextAlignButtons,
    },
    {
        type: 'custom',
        component: ImageUploadDropdown,
    },
    {
        type: 'custom',
        component: ImageAlignDropdown,
    },
    {
        type: 'custom',
        component: LinkPopoverDropdown,
    },
    // {
    //     type: 'custom',
    //     component: ImageAlignButtons,
    // },

    {
        type: 'separator',
    },
    {
        type: 'spacer',
    },
    {
        type: 'group',
        buttons: [
            {
                label: 'Save',
                icon: SaveIcon,
                onClick: () => { },
                dataStyle: 'primary',
            },
        ],
    },
]