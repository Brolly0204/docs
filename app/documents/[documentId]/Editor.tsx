'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils'
import { TableKit } from '@tiptap/extension-table'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import useEditorStore from '@/store/use-editor-store'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import '@/components/tiptap-node/image-node/image-node.scss'
import TextAlign from '@tiptap/extension-text-align'
import { ImageAlign } from '@/extensions/image-align'

const Editor = () => {
  const { setEditor } = useEditorStore()
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor)
    },
    onUpdate({ editor }) {
      setEditor(editor)
    },
    onDestroy() {
      setEditor(null)
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor)
    },
    onTransaction({ editor }) {
      setEditor(editor)
    },
    onFocus({ editor }) {
      setEditor(editor)
    },
    onBlur({ editor }) {
      setEditor(editor)
    },
    onContentError({ editor }) {
      setEditor(editor)
    },
    extensions: [StarterKit.configure({
      heading: {
        // levels: [1, 2, 3, 4, 5, 6],
      },
    }),
      TextStyleKit,
      TaskList, TaskItem.configure({
        nested: true,
      }),
    TableKit.configure({
      table: { resizable: true },
    }),
    ImageAlign.configure({
      types: ['image']
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'my-custom-class',
      },
      resize: {
        enabled: true,
        // directions: ['top', 'bottom', 'left', 'right'], // can be any direction or diagonal combination
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      },
    }),
    ImageUploadNode.configure({
      accept: 'image/*',
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error) => console.error('Upload failed:', error),
    }),

    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https'],
      // HTMLAttributes: {
      //   onclick: 'return false;',
      //   style: 'pointer-events: none; cursor: default;',
      // },
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL (依赖 defaultProtocol 自动补全)
          const parsedUrl = new URL(url.includes(':') ? url : `${ctx.defaultProtocol}://${url}`)

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false
          }

          // disallowed protocols
          const disallowedProtocols = ['ftp', 'file', 'mailto']
          const protocol = parsedUrl.protocol.replace(':', '')

          if (disallowedProtocols.includes(protocol)) {
            return false
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

          if (!allowedProtocols.includes(protocol)) {
            return false
          }

          // disallowed domains
          const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
          const domain = parsedUrl.hostname

          if (disallowedDomains.includes(domain)) {
            return false
          }

          // all checks have passed
          return true
        } catch {
          return false
        }
      },
      shouldAutoLink: url => {
        try {
          // construct URL
          const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
          const domain = parsedUrl.hostname

          return !disallowedDomains.includes(domain)
        } catch {
          return false
        }
      },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none print:border-0 bg-white border-[#C7C7C7] min-h-[1054px] w-[816px] print:shadow-none shadow-md rounded-md pt-10 pr-14 pb-10 cursor-text',
      },
    },
    content: `
     <h1>This is a 1st level heading</h1>
            <h2>This is a 2nd level heading</h2>
            <h3>This is a 3rd level heading</h3>
            <h4>This is a 4th level heading</h4>
          <img src="https://placehold.co/600x400" />
        <img src="https://placehold.co/800x400" />
           
            <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>
            <ol>
                <li>A list item</li>
                <li>And another one</li>
            </ol>
             <ul data-type="taskList">
                <li data-type="taskItem" data-checked="true">A list item</li>
                <li data-type="taskItem" data-checked="false">And another one</li>
            </ul>
        `,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })
  return (
    <div className='h-full bg-[#FAFBFD] flex flex-col items-center print:h-auto'>
      <div className='w-full max-w-4xl flex-1 overflow-y-auto flex flex-col items-center print:overflow-visible print:h-auto scrollbar-hide'>
        <div className='mb-20'>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

export default Editor;