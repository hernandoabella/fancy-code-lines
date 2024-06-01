"use client";

import React, { useState, useEffect } from "react";

const Home = () => {
  const defaultCode = "Hello World";
  const [inputCode, setInputCode] = useState(defaultCode);
  const [codeLines, setCodeLines] = useState<JSX.Element[][]>([]);
  const [editorBg, setEditorBg] = useState("bg-gray-800");

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
        return (
          <div
            key={wordIndex}
            className={`inline-block p-1 rounded-lg ${color}`}
          >
            {word}
          </div>
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

  // Ejecutar la función processCode al montar el componente
  useEffect(() => {
    processCode();
    const storedBg = localStorage.getItem("editorBg");
    if (storedBg) {
      setEditorBg(storedBg);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div>
          <textarea
            className="h-40 p-4 border mb-4 w-1/2"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Ingresa tu código aquí..."
          ></textarea>
          <br />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 mr-2"
            onClick={processCode}
          >
            Convert to fancy lines
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
            onClick={toggleEditorBg}
          >
            Toggle Background
          </button>
        </div>
        <div className={`w-1/2 whitespace-pre p-4 rounded-lg ${editorBg}`}>
          {codeLines.map((line, lineIndex) => (
            <div key={lineIndex} className="flex items-center">
              <div className="line-number text-gray-400 pr-4">{lineIndex + 1}</div>
              <div className="flex gap-3 py-2">{line}</div>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-center py-2">by Hernando Abella</footer>
    </div>
  );
};

export default Home;
