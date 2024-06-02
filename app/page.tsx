"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { RiBrushFill, RiDownload2Fill } from "react-icons/ri";
import { FaMagic } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";
import { Button } from "@/components/ui/button";

const Home = () => {
  const defaultCode =
    "num1 = 10\nnum2 = 20\nsum = num1 + num2\nprint('The sum of', num1, 'and', num2, 'is:', sum)";
  const [inputCode, setInputCode] = useState(defaultCode);
  const [codeLines, setCodeLines] = useState<JSX.Element[][]>([]);
  const [editorBg, setEditorBg] = useState("bg-gray-800");
  const editorRef = useRef<HTMLDivElement>(null);

  // Function to process the entered code and convert it to fancy lines
  const processCode = () => {
    const lines = inputCode.split("\n");
    const colors = [
      "bg-white",
      "bg-gradient-to-l from-blue-400 to-blue-500",
      "bg-gradient-to-l from-red-400 to-red-500",
      "bg-gradient-to-l from-green-400 to-green-500",
      "bg-gradient-to-l from-yellow-400 to-yellow-500",
      "bg-gradient-to-l from-purple-400 to-purple-500",
      "bg-gradient-to-l from-indigo-400 to-indigo-500",
      "bg-gradient-to-l from-pink-400 to-pink-500",
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
            className={`p-1 rounded-lg ${color} ${randomWidthClass} gradient-border`}
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
      const originalWidth = editorRef.current.style.width;
      (editorRef.current as HTMLDivElement).style.height = "auto";
      (editorRef.current as HTMLDivElement).style.width = "auto"; // Change width to auto to capture full content
      editorRef.current.classList.remove(
        "overflow-x-auto",
        "max-h-96",
        "overflow-y-auto",
        "max-w-96"
      );

      // Adjust the position of elements for better alignment
      const lines = editorRef.current.querySelectorAll(".flex");
      const originalMargins = new Map<HTMLElement, string>(); // Map to store original margin values
      lines.forEach((line) => {
        const numbers = line.querySelectorAll(".line-number");
        const elements = line.querySelectorAll(".flex");
        if (numbers.length && elements.length) {
          const numbersHeight = (numbers[0] as HTMLElement).clientHeight;
          elements.forEach((element) => {
            const originalMargin = (element as HTMLElement).style.marginTop; // Store original margin
            originalMargins.set(element as HTMLElement, originalMargin); // Store in the map
            (element as HTMLElement).style.marginTop = `${
              parseInt(originalMargin) + numbersHeight
            }px`; // Adjust margin
          });
        }
      });

      // Wait for a short delay to ensure the DOM updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(editorRef.current, {
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      // Revert the position of elements to their original state
      originalMargins.forEach((originalMargin, element) => {
        element.style.marginTop = originalMargin;
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "code-editor.png";
      link.click();

      // Revert the editor to its original state
      (editorRef.current as HTMLDivElement).style.height = originalHeight;
      (editorRef.current as HTMLDivElement).style.width = originalWidth;
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
    <div className="md:h-screen md:w-screen">
      <div
        className=""
        style={{
          backgroundImage: "url('/ccchaos.svg')",
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "-1",
          top: "-100",
          left: 0,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-50% 0%",
          transform: "translateY(20%)",
        }}
      ></div>

      <div
        className=""
        style={{
          backgroundImage: "url('/ccchaos.svg')",
          width: "100%",
          height: "80%",
          position: "fixed",
          zIndex: "-1",
          top: "30%", // Ajustado al centro verticalmente
          left: 800,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% 50%",
          transform: "translateY(-50%)", // Ajustado al centro verticalmente
        }}
      ></div>
      <div>
        <Header />
      </div>

      <div className="overflow-hidden flex justify-center items-center pt-5 md:pt-20 w-full">
        <div className="container mx-auto px-10 overflow-hidden">
          <div className="gap-10 md:flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="md:w-1/2"
            >
              <textarea
                className="h-40 p-4 border mb-4 w-full rounded-lg shadow-lg"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Insert your code here..."
              ></textarea>
              <div className="flex flex-wrap">
                <Button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4 mr-2"
                  onClick={processCode}
                >
                  <FaMagic className="mr-2" />
                  <span>Fancy</span>
                </Button>
                <Button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4 mr-2"
                  onClick={toggleEditorBg}
                >
                  <RiBrushFill className="mr-2" />
                  <span>Background</span>
                </Button>
                <Button
                  className="flex items-center bg-slate-800 text-white px-4 py-2 rounded-md mb-4"
                  onClick={downloadEditorAsImage}
                >
                  <RiDownload2Fill className="mr-2" />
                  <span>Download</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              ref={editorRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className={`whitespace-pre w-full h-60 p-4 rounded-lg ${editorBg} overflow-x-auto max-h-96 overflow-y-auto`}
            >
              {codeLines.map((line, lineIndex) => (
                <div key={lineIndex} className="flex items-center">
                  <div className="line-number text-gray-400 pr-4">
                    {lineIndex + 1}
                  </div>
                  <div className="flex gap-5 py-2">{line}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <footer className="py-2">
            <p>by Hernando Abella</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
