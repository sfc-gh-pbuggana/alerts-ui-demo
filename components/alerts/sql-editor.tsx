"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import { createPortal } from "react-dom"
import { Send, Sparkles, X } from 'lucide-react'

export type SQLEditorHandle = {
  showAiRow: () => void
  hideAiRow: () => void
  isAiRowVisible: () => boolean
}

type SQLEditorProps = { disabled?: boolean; value: string; onChange: (v: string) => void }

export const SQLEditor = forwardRef<SQLEditorHandle, SQLEditorProps>(function SQLEditor({ disabled = false, value, onChange }, ref) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const [aiZone, setAiZone] = useState<{ id: string; container: HTMLDivElement } | null>(null)

  useEffect(() => {
    return () => {
      if (editorRef.current && aiZone?.id) {
        editorRef.current.changeViewZones((accessor: any) => accessor.removeZone(aiZone.id))
      }
    }
  }, [aiZone])

  const showAiRow = () => {
    if (!editorRef.current) return
    const editor = editorRef.current as any
    const afterLineNumber = editor.getPosition()?.lineNumber ?? 1
    const container = document.createElement("div")
    container.className = "px-2"
    editor.changeViewZones((accessor: any) => {
      if (aiZone?.id) accessor.removeZone(aiZone.id)
      const id = accessor.addZone({
        afterLineNumber,
        heightInPx: 44,
        domNode: container,
      })
      setAiZone({ id, container })
    })
    editor.revealLineInCenterIfOutsideViewport(afterLineNumber)
  }

  const hideAiRow = () => {
    if (!editorRef.current || !aiZone?.id) return
    editorRef.current.changeViewZones((accessor: any) => accessor.removeZone(aiZone.id))
    setAiZone(null)
  }

  const isAiRowVisible = () => !!aiZone

  useImperativeHandle(ref, () => ({ showAiRow, hideAiRow, isAiRowVisible }), [aiZone])

  return (
    <div className="h-full w-full relative bg-[var(--panel-2)]">
      <MonacoEditor
        height="100%"
        width="100%"
        language="sql"
        theme="vs"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => showAiRow())
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          renderWhitespace: "none",
          readOnly: disabled,
          wordWrap: "off",
        }}
      />
      {disabled && <div className="absolute inset-0 cursor-wait" aria-hidden="true" />}

      {aiZone && createPortal(
        <AiInlineRow
          onClose={hideAiRow}
          onSubmit={() => hideAiRow()}
        />,
        aiZone.container
      )}
    </div>
  )
})

function AiInlineRow({ onClose, onSubmit }: { onClose: () => void; onSubmit: (text: string) => void }) {
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full">
      <div className="sf-ai-row h-10 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3">
        <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 h-8 outline-none text-sm bg-transparent"
          placeholder="Write me a query that..."
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose()
            if (e.key === "Enter") onSubmit(text.trim())
          }}
        />
        <button
          className="inline-flex items-center justify-center h-7 w-8 rounded-md border border-[var(--border)] text-[var(--subtle-text)] hover:bg-[var(--panel-3)]"
          aria-label="Send"
          onClick={() => onSubmit(text.trim())}
        >
          <Send className="h-4 w-4" />
        </button>
        <button
          className="inline-flex items-center justify-center h-7 w-8 rounded-md border border-[var(--border)] text-[var(--subtle-text)] hover:bg-[var(--panel-3)]"
          aria-label="Dismiss"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
