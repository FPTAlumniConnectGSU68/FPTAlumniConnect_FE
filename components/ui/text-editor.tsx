"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TextEditor({
  content,
  setContent,
  height = "200px",
  placeholder = "Mô tả",
  extraItems = [],
}: {
  content: string;
  setContent: (v: string) => void;
  height?: string;
  placeholder?: string;
  extraItems?: string[];
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [...extraItems],
    ],
  };

  return (
    <div className="flex flex-col">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        modules={modules}
      />
    </div>
  );
}
