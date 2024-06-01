"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { RiPlayFill, RiBrushFill, RiDownload2Fill } from "react-icons/ri";

const Home = () => {
  const defaultCode = "Hello World";
  const [inputCode, setInputCode] = useState(defaultCode);
  const [codeLines, setCodeLines] = useState<JSX.Element[][]>([]);
  const [editorBg, setEditorBg] = useState("bg-gray-800");
  const editorRef = useRef<HTMLDivElement>(null);

  // Función para procesar el código ingresado y convertirlo en líneas fancy
  const processCode = () => {
    // Dividir el código por líneas
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

    // Procesar cada línea en palabras y caracteres especiales
    const processedLines = lines.map((line, lineIndex) => {
      const words = line.match(/\w+|[^\w\s]/g) || [];
      return words.map((word, wordIndex) => {
        const color = colors[(lineIndex + wordIndex) % colors.length];
        const widthClasses = [
          "w-96", // Long width
          "w-64", // Medium width
          "w-48", // Short width
          "w-32", // Very short width
        ];
        const randomWidthClass =
          widthClasses[Math.floor(Math.random() * widthClasses.length)];
        return (
          <div
            key={wordIndex}
            className={`inline-block p-1 rounded-lg ${color} ${randomWidthClass}`}
          ></div>
        );
      });
    });

    // Actualizar el estado con las líneas de código procesadas
    setCodeLines(processedLines);
  };

  // Función para alternar el color de fondo del editor
  const toggleEditorBg = () => {
    const newBg = editorBg === "bg-gray-800" ? "bg-white" : "bg-gray-800";
    setEditorBg(newBg);
    localStorage.setItem("editorBg", newBg);
  };

  // Función para descargar el editor como imagen
  const downloadEditorAsImage = async () => {
    if (editorRef.current) {
      const canvas = await html2canvas(editorRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "code-editor.png";
      link.click();
    }
  };

  // Ejecutar la función processCode al montar el componente
  useEffect(() => {
    processCode();
    const storedBg = localStorage.getItem("editorBg");
    if (storedBg) {
      setEditorBg(storedBg);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="container mx-auto p x-10">
        <div className="gap-10">
          <div>
            <textarea
              className="h-40 p-4 border mb-4 w-full"
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
                <span>Convert to fancy lines</span>
              </button>
              <button
                className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4 mr-2"
                onClick={toggleEditorBg}
              >
                <RiBrushFill className="mr-2" />
                <span>Toggle Background</span>
              </button>
              <button
                className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4"
                onClick={downloadEditorAsImage}
              >
                <RiDownload2Fill className="mr-2" />
                <span>Download as Image</span>
              </button>
            </div>
          </div>
          <div
            ref={editorRef}
            className={`whitespace-pre p-4 rounded-lg ${editorBg} overflow-x-auto`}
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
  );
};

export default Home;
