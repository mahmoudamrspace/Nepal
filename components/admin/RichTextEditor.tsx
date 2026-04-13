'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('bold') ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('italic') ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#485342] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          "
        </button>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  );
}

