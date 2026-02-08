'use client'
import React from 'react'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { getToolbarConfig, ToolbarButtonConfig } from './toolbar-config'
import useEditorStore from '@/store/use-editor-store'


const EToolbar = () => {
    const { editor } = useEditorStore()
    const toolbarConfig = getToolbarConfig()

    const renderButton = (button: ToolbarButtonConfig) => {
        let isActive = false
        try {
            if (editor && button?.isActive) {
                isActive = button.isActive(editor)
            }
        } catch (error) {
            console.error(`Error checking isActive for ${button.label}:`, error)
        }

        return (
            <Button
                key={button.label}
                data-style={button.dataStyle || 'ghost'}
                data-active-state={isActive ? 'on' : 'off'}
                onClick={() => editor && button.onClick(editor)}
                title={button.label}
                disabled={editor && button.disabled ? button.disabled(editor) : false}
            >
                {button.icon ? <button.icon className="tiptap-button-icon" /> : button.label}
            </Button>
        )
    }

    return (
        <Toolbar variant='fixed' className='rounded-md'>
            {toolbarConfig.map((section, idx) => {
                if (section.type === 'separator') {
                    return <ToolbarSeparator key={`separator-${idx}`} />
                }
                if (section.type === 'spacer') {
                    return <Spacer key={`spacer-${idx}`} />
                }

                if (section.type === 'custom' && section.component) {
                    const { component } = section;
                    const Component = component as React.FC<any>;
                    return <Component key={`custom-${idx}`} />;
                }
                return (
                    <ToolbarGroup key={`group-${idx}`}>
                        {section.buttons?.map((button) => renderButton(button))}
                    </ToolbarGroup>
                )
            })}
        </Toolbar>
    )
}

export default EToolbar;
