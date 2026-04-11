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
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    return theme === 'dark';
  });

  const [isSplitView, setIsSplitView] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setIsDarkTheme(currentTheme === 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const effectiveSplitView = isSmallScreen ? false : isSplitView;

  return (
    <div className="card w-full">
      <div
        className="file-diff rounded-md overflow-hidden w-full relative"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        {!isSmallScreen && (
          <button
            onClick={() => setIsSplitView(!isSplitView)}
            title={effectiveSplitView ? '切换为上下对比' : '切换为左右对比'}
            className="p-1.5 rounded transition-colors absolute top-1 right-4 z-10"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            {effectiveSplitView ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            )}
          </button>
        )}
        <div className="flex flex-col">
          <div className="w-full">
            <ReactDiffViewer
              oldValue={content1}
              newValue={content2}
              leftTitle={file1Name || "文件 1"}
              rightTitle={file2Name || "文件 2"}
              splitView={effectiveSplitView}
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
