"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { RiPlayFill, RiBrushFill, RiDownload2Fill } from "react-icons/ri";

const Home = () => {
  const defaultCode = "Hello World\nHow are you?\ni'm fine";
  const [inputCode, setInputCode] = useState(defaultCode);
  const [codeLines, setCodeLines] = useState<JSX.Element[][]>([]);
  const [editorBg, setEditorBg] = useState("bg-gray-800");
  const editorRef = useRef<HTMLDivElement>(null);

  // Function to process the entered code and convert it to fancy lines
  const processCode = () => {
    const lines = inputCode.split("\n");
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-blue-600",
      "bg-red-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-purple-600",
      "bg-indigo-600",
      "bg-pink-600",
      "bg-white",
    ];

    const processedLines = lines.map((line, lineIndex) => {
      const words = line.match(/\w+|[^\w\s]/g) || [];
      return words.map((word, wordIndex) => {
        const color = colors[(lineIndex + wordIndex) % colors.length];
        const widthClasses = [
          "w-96",
          "w-64",
          "w-48",
          "w-32",
          "w-28",
          "w-24",
          "w-20",
          "w-16",
          "w-14",
        ];
        const randomWidthClass =
          widthClasses[Math.floor(Math.random() * widthClasses.length)];
        return (
          <div
            key={wordIndex}
            className={` p-1 rounded-lg ${color} ${randomWidthClass} gradient-border`}
          ></div>
        );
      });
    });

    setCodeLines(processedLines);
  };

  // Function to toggle the background color of the editor
  const toggleEditorBg = () => {
    const newBg = editorBg === "bg-gray-800" ? "bg-white" : "bg-gray-800";
    setEditorBg(newBg);
    localStorage.setItem("editorBg", newBg);
  };

  // Function to download the editor content as an image
  const downloadEditorAsImage = async () => {
    if (editorRef.current) {
      // Temporarily adjust the editor to capture the full content
      const originalHeight = editorRef.current.style.height;
      editorRef.current.style.height = "auto";
      editorRef.current.classList.remove(
        "overflow-x-auto",
        "max-h-96",
        "overflow-y-auto"
      );

      const canvas = await html2canvas(editorRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "code-editor.png";
      link.click();

      // Revert the editor to its original state
      editorRef.current.style.height = originalHeight;
      editorRef.current.classList.add(
        "overflow-x-auto",
        "max-h-96",
        "overflow-y-auto"
      );
    }
  };

  useEffect(() => {
    processCode();
    const storedBg = localStorage.getItem("editorBg");
    if (storedBg) {
      setEditorBg(storedBg);
    }
  }, []);

  return (
    <div>
      <div>
        <h2>fancy-codelines</h2>
      </div>
      <div className="flex justify-center items-center h-screen w-full">
        <div className="container mx-auto px-10">
          <div className="gap-10 flex">
            <div>
              <textarea
                className="h-40 p-4 border mb-4 w-full rounded-lg shadow-lg"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Insert your code here..."
              ></textarea>
              <div className="flex">
                <button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4 mr-2"
                  onClick={processCode}
                >
                  <RiPlayFill className="mr-2" />
                  <span>Fancy</span>
                </button>
                <button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4 mr-2"
                  onClick={toggleEditorBg}
                >
                  <RiBrushFill className="mr-2" />
                  <span>Background</span>
                </button>
                <button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4"
                  onClick={downloadEditorAsImage}
                >
                  <RiDownload2Fill className="mr-2" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div
              ref={editorRef}
              className={`whitespace-pre p-4 rounded-lg ${editorBg} overflow-x-auto max-h-96 overflow-y-auto`}
            >
              {codeLines.map((line, lineIndex) => (
                <div key={lineIndex} className="flex items-center">
                  <div className="line-number text-gray-400 pr-4">
                    {lineIndex + 1}
                  </div>
                  <div className="flex gap-5 py-2">{line}</div>
                </div>
              ))}
            </div>
          </div>
          <footer className="py-2">by Hernando Abella</footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
