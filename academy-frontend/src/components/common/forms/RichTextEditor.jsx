// components/common/forms/RichTextEditor.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Maximize,
  Minimize,
} from "lucide-react";

export default function RichTextEditor({
  label,
  value = "",
  onChange,
  placeholder = "Start writing...",
  minHeight = "250px",
  error,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[var(--primary)] underline cursor-pointer' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        // This removes the default outline/border when focused on the Prosemirror instance
        class: "focus:outline-none w-full h-full",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarDivider = () => <div className="mx-1 h-5 w-[1px] bg-[var(--border)]/60" />;

  const ToolbarButton = ({ icon: Icon, command, isActive, ariaLabel }) => (
    <button
      type="button"
      onClick={command}
      title={ariaLabel}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ${
        isActive
          ? "bg-[var(--primary)] text-primary-foreground shadow-sm"
          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
      aria-label={ariaLabel}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[var(--background)] animate-in fade-in zoom-in-95"
          : "relative w-full"
      }`}
    >
      {label && !isFullscreen && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </label>
      )}

      {/* Main Editor Container */}
      <div
        className={`flex flex-col overflow-hidden transition-colors duration-200 ${
          isFullscreen
            ? "h-full w-full"
            : `rounded-xl border ${error ? "border-red-500/50" : "border-[var(--border)]/60"} bg-[var(--card)] shadow-sm hover:border-[var(--border)]`
        }`}
      >
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-[var(--border)]/60 bg-[var(--card)]/95 px-2 py-1.5 backdrop-blur-md">
          <ToolbarButton
            icon={Bold}
            command={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            ariaLabel="Bold"
          />
          <ToolbarButton
            icon={Italic}
            command={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            ariaLabel="Italic"
          />
          <ToolbarButton
            icon={UnderlineIcon}
            command={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            ariaLabel="Underline"
          />
          <ToolbarButton
            icon={Strikethrough}
            command={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            ariaLabel="Strikethrough"
          />

          <ToolbarDivider />

          <ToolbarButton
            icon={Heading1}
            command={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            ariaLabel="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            command={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            ariaLabel="Heading 2"
          />

          <ToolbarDivider />

          <ToolbarButton
            icon={AlignLeft}
            command={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            ariaLabel="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            command={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            ariaLabel="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            command={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            ariaLabel="Align Right"
          />
          <ToolbarButton
            icon={AlignJustify}
            command={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            ariaLabel="Justify"
          />

          <ToolbarDivider />

          <ToolbarButton
            icon={List}
            command={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            ariaLabel="Bullet list"
          />
          <ToolbarButton
            icon={ListOrdered}
            command={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            ariaLabel="Numbered list"
          />
          <ToolbarButton
            icon={CheckSquare}
            command={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            ariaLabel="Task list"
          />

          <ToolbarDivider />

          <ToolbarButton
            icon={Quote}
            command={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            ariaLabel="Quote"
          />
          <ToolbarButton
            icon={Code}
            command={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            ariaLabel="Code block"
          />
          <ToolbarButton
            icon={LinkIcon}
            command={setLink}
            isActive={editor.isActive("link")}
            ariaLabel="Insert Link"
          />

          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarButton
              icon={Undo}
              command={() => editor.chain().focus().undo().run()}
              isActive={false}
              ariaLabel="Undo"
            />
            <ToolbarButton
              icon={Redo}
              command={() => editor.chain().focus().redo().run()}
              isActive={false}
              ariaLabel="Redo"
            />
            <ToolbarDivider />
            <ToolbarButton
              icon={isFullscreen ? Minimize : Maximize}
              command={() => setIsFullscreen(!isFullscreen)}
              isActive={isFullscreen}
              ariaLabel={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            />
          </div>
        </div>

        {/* Editor Content Canvas */}
        <div 
          className={`flex-1 overflow-y-auto ${isFullscreen ? "mx-auto w-full max-w-4xl p-8 lg:p-12" : "p-4"}`}
          style={{ minHeight: isFullscreen ? "100vh" : minHeight }}
          onClick={() => editor.commands.focus()}
        >
          <EditorContent
            editor={editor}
            className="prose prose-stone dark:prose-invert max-w-none 
              focus:outline-none focus:ring-0
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)]
              prose-p:text-[var(--foreground)] prose-p:leading-relaxed
              prose-a:text-[var(--primary)] prose-a:underline prose-a:underline-offset-4
              prose-strong:text-[var(--foreground)]
              prose-ul:list-disc prose-ul:pl-5
              prose-ol:list-decimal prose-ol:pl-5
              prose-blockquote:border-l-4 prose-blockquote:border-[var(--muted-foreground)]/30 prose-blockquote:bg-[var(--muted)]/20 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:rounded-r-lg
              prose-code:bg-[var(--muted)] prose-code:text-[var(--foreground)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-medium
              pre:bg-[var(--muted)] pre:text-[var(--foreground)] pre:rounded-xl
              empty:before:text-[var(--muted-foreground)]
              [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-0
              [&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:gap-2 [&_li[data-type='taskItem']]:items-start
              [&_input[type='checkbox']]:mt-1.5 [&_input[type='checkbox']]:h-4 [&_input[type='checkbox']]:w-4 [&_input[type='checkbox']]:rounded-sm [&_input[type='checkbox']]:border-[var(--primary)] [&_input[type='checkbox']]:text-[var(--primary)] [&_input[type='checkbox']]:focus:ring-[var(--primary)]
              "
          />
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-red-500 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}