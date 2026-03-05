import React, { useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

interface FileDiffProps {
  content1: string;
  content2: string;
  file1Name?: string | undefined;
  file2Name?: string | undefined;
}

const FileDiff: React.FC<FileDiffProps> = ({
  content1,
  content2,
  file1Name,
  file2Name,
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return theme === 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setIsDarkTheme(currentTheme === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="card w-full">
      <div 
        className="file-diff rounded-md overflow-hidden w-full"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div className="flex flex-col">
          <div className="w-full">
            <ReactDiffViewer
              oldValue={content1}
              newValue={content2}
              leftTitle={file1Name || "文件 1"}
              rightTitle={file2Name || "文件 2"}
              splitView={true}
              useDarkTheme={isDarkTheme}
              infiniteLoading={{
                pageSize: 20,
                containerHeight: "80vh",
              }}
              styles={{
                diffContainer: {
                  minWidth: "0",
                },
                line: {
                  fontFamily: "'JetBrains Mono', monospace",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDiff;
