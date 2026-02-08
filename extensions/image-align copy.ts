import { Extension } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state' // 参考代码必备：保留节点选中状态

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
                    dataAlign: {
                        default: this.options.defaultAlignment,
                        parseHTML: (element) => {
                            // 1. 参考代码：去掉非空断言，空值兜底，避免校验失败
                            const value = element.getAttribute('data-align') || '';
                            // 严格校验：只有在对齐值列表中的值才生效，否则用默认值
                            return this.options.alignments.includes(value)
                                ? value
                                : this.options.defaultAlignment;
                        },
                        renderHTML: (attributes) => {
                            const { dataAlign } = attributes;
                            // 2. 参考代码：确保渲染到 DOM 的属性非 undefined，否则 Tiptap 会过滤
                            return {
                                'data-align': dataAlign || this.options.defaultAlignment,
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
                (alignment) =>
                    ({ chain, editor, commands }) => {
                        // 3. 参考代码：全链路前置校验（缺一不可，避免无效调用）
                        // 校验 1：对齐值是否合法
                        if (!this.options.alignments.includes(alignment)) {
                            console.warn('无效的对齐值：', alignment);
                            return false;
                        }
                        // 校验 2：编辑器是否存在且可编辑
                        if (!editor || !editor.isEditable) {
                            console.warn('编辑器不可用或只读');
                            return false;
                        }
                        // 校验 3：当前是否能执行 updateAttributes 命令（参考代码的核心校验）
                        const canUpdate = editor.can().updateAttributes(
                            this.options.types[0],
                            { dataAlign: alignment }
                        );
                        if (!canUpdate) {
                            console.warn('当前上下文无法更新图片对齐属性');
                            return false;
                        }

                        // 4. 参考代码：保存节点选中状态（避免修改属性后上下文丢失，无法同步 DOM）
                        const { selection } = editor.state;
                        const isNodeSelection = selection instanceof NodeSelection;
                        const selectionPosition = isNodeSelection
                            ? selection.from
                            : selection.$anchor.pos;

                        // 5. 参考代码：用 chain() 包裹，强制 focus() 保障上下文（核心！）
                        let alignmentUpdated = false;
                        try {
                            alignmentUpdated = chain()
                                .focus() // 强制聚焦，确保修改能同步到 DOM
                                .command(() => {
                                    // 保留你原有 map/some 写法，兜底多类型场景
                                    return this.options.types
                                        .map(type => commands.updateAttributes(type, {
                                            dataAlign: alignment
                                        }))
                                        .some(response => response);
                                })
                                .run();
                        } catch (e) {
                            console.error('修改图片对齐属性失败：', e);
                            alignmentUpdated = false;
                        }

                        // 6. 参考代码：还原节点选中状态（确保修改后，属性能同步到 DOM 上）
                        if (alignmentUpdated && isNodeSelection) {
                            editor.commands.setNodeSelection(selectionPosition);
                        }

                        // 7. 最终返回执行结果
                        return alignmentUpdated;
                    },
        };
    },
});