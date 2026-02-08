import { Extension } from '@tiptap/core'
import { NodeSelection, type Transaction, type EditorState } from '@tiptap/pm/state';

export interface ImageAlignOptions {
    types: string[],
    alignments: string[],
    defaultAlignment: string | null,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageAlign: {
            setImageAlign: (alignment: 'left' | 'center' | 'right') => ReturnType
            unsetImageAlign: () => ReturnType
        }
    }
}


export const ImageAlign = Extension.create<ImageAlignOptions>({
    name: 'imageAlign',

    addOptions() {
        return {
            types: ['image'],
            alignments: ['left', 'center', 'right'],
            defaultAlignment: 'left',
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    // 定义一个名为 'dataAlign' 的属性 (JS 中用驼峰命名)
                    dataAlign: {
                        default: this.options.defaultAlignment,
                        // 解析：从 <img> 标签的 data-align 属性中读取值
                        parseHTML: (element) => {
                            // element 是渲染出的 DOM 节点 (可能是 img)
                            const value = element.getAttribute('data-align')!;
                            return this.options.alignments.includes(value) ? value : this.options.defaultAlignment;
                        },
                        // 渲染：将值写入 <img> 标签的 data-align 属性
                        renderHTML: (attributes) => {
                            const { dataAlign } = attributes;
                            // 确保输出的是 HTML 属性 data-align
                            return {
                                'data-align': dataAlign,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setImageAlign:
                (alignment, extensionName: string = "image",
                    attributeName: string = "data-align") =>
                    ({ chain, editor, commands }) => {
                        if (!this.options.alignments.includes(alignment)) {
                            return false;
                        }


                        try {
                            const { selection } = editor.state
                            const isNodeSelection = selection instanceof NodeSelection
                            const selectionPosition = isNodeSelection
                                ? selection.from
                                : selection.$anchor.pos
                            const selectedNode = editor.view.dom.querySelector('.ProseMirror-selectednode')
                            if (selectedNode && selectedNode.nodeName === 'IMG') {
                                selectedNode.setAttribute(attributeName, alignment)
                            } else {
                                selectedNode?.querySelector('img')?.setAttribute(attributeName, alignment)
                            }
                            if (isNodeSelection) {
                                editor.commands.setNodeSelection(selectionPosition)
                            }
                            return true
                        } catch (error) {
                            console.error('Error setting image align:', error)
                            return false
                        }



                        // return this.options.types
                        //     .map(type => commands.updateAttributes(type, { dataAlign: alignment }))
                        //     .some(response => response)
                    },
        };
    },
});
