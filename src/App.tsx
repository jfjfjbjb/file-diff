import { useState } from 'react';
import FileDiff from './components/FileDiff';
import type { DiffItem } from './components/FileDiff';
import { diff_match_patch } from 'diff-match-patch';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [diffResult, setDiffResult] = useState<DiffItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadKey, setUploadKey] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');
  
  const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.html', '.json', '.xml', '.csv', '.log', '.py', '.java', '.c', '.cpp', '.h', '.hpp'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleMultipleFileChange = (selectedFiles: File[]) => {
    setErrorMessage('');
    setWarningMessage('');
    
    const validFiles: File[] = [];
    const warnings: string[] = [];
    
    for (const file of selectedFiles) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase() || '';
      const isSupported = SUPPORTED_EXTENSIONS.includes(fileExtension);
      
      if (!isSupported) {
        warnings.push(`"${file.name}"：不支持的文件类型（仅支持文本文件）`);
        continue;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(`"${file.name}"：文件过大（最大限制 10MB）`);
        continue;
      }
      
      const isDuplicate = files.some(f => f.name === file.name && f.size === file.size);
      if (isDuplicate) {
        warnings.push(`"${file.name}"：文件已存在`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (warnings.length > 0) {
      setWarningMessage(warnings.join('\n'));
    }
    
    if (validFiles.length === 0) {
      if (warnings.length === 0) {
        setErrorMessage('请上传有效的文件');
      }
      return;
    }
    
    const newFiles = [...files, ...validFiles].slice(0, 2);
    setFiles(newFiles);
    
    if (newFiles.length < 2) {
      setErrorMessage(`已选择 ${newFiles.length} 个文件，还需选择 ${2 - newFiles.length} 个文件`);
      return;
    }
    
    setErrorMessage('');
    
    const [file1, file2] = newFiles;
    
    Promise.all([
      new Promise<string>((resolve) => {
        const reader1 = new FileReader();
        reader1.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader1.readAsText(file1);
      }),
      new Promise<string>((resolve) => {
        const reader2 = new FileReader();
        reader2.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader2.readAsText(file2);
      })
    ]).then(([content1, content2]) => {
      
      const dmp = new diff_match_patch();
      const diffs = dmp.diff_main(content1, content2);
      dmp.diff_cleanupSemantic(diffs);
      
      const lineDiffs: DiffItem[] = [];
      
      let line1Index = 0;
      let line2Index = 0;
      
      for (const [type, text] of diffs) {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!line && i === lines.length - 1) continue;
          
          if (type === -1) {
            lineDiffs.push({
              type: 'remove',
              line1: line1Index + 1,
              line2: null,
              content: line
            });
            line1Index++;
          } else if (type === 1) {
            lineDiffs.push({
              type: 'add',
              line1: null,
              line2: line2Index + 1,
              content: line
            });
            line2Index++;
          } else {
            lineDiffs.push({
              type: 'neutral',
              line1: line1Index + 1,
              line2: line2Index + 1,
              content: line
            });
            line1Index++;
            line2Index++;
          }
        }
      }
      
      setDiffResult(lineDiffs);
    });
  };

  const handleClearAll = () => {
    setFiles([]);
    setDiffResult([]);
    setErrorMessage('');
    setWarningMessage('');
    setUploadKey(prev => prev + 1);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (newFiles.length === 0) {
      setDiffResult([]);
      setErrorMessage('');
      setWarningMessage('');
      setUploadKey(prev => prev + 1);
    } else if (newFiles.length < 2) {
      setDiffResult([]);
      setErrorMessage(`已选择 ${newFiles.length} 个文件，还需选择 ${2 - newFiles.length} 个文件`);
      setWarningMessage('');
    } else {
      setErrorMessage('');
      setWarningMessage('');
      
      const [file1, file2] = newFiles;
      
      Promise.all([
        new Promise<string>((resolve) => {
          const reader1 = new FileReader();
          reader1.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content);
          };
          reader1.readAsText(file1);
        }),
        new Promise<string>((resolve) => {
          const reader2 = new FileReader();
          reader2.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content);
          };
          reader2.readAsText(file2);
        })
      ]).then(([content1, content2]) => {
        
        const dmp = new diff_match_patch();
        const diffs = dmp.diff_main(content1, content2);
        dmp.diff_cleanupSemantic(diffs);
        
        const lineDiffs: DiffItem[] = [];
        let line1Index = 0;
        let line2Index = 0;
        
        for (const [type, text] of diffs) {
          const lines = text.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line && i === lines.length - 1) continue;
            
            if (type === -1) {
              lineDiffs.push({
                type: 'remove',
                line1: line1Index + 1,
                line2: null,
                content: line
              });
              line1Index++;
            } else if (type === 1) {
              lineDiffs.push({
                type: 'add',
                line1: null,
                line2: line2Index + 1,
                content: line
              });
              line2Index++;
            } else {
              lineDiffs.push({
                type: 'neutral',
                line1: line1Index + 1,
                line2: line2Index + 1,
                content: line
              });
              line1Index++;
              line2Index++;
            }
          }
        }
        
        setDiffResult(lineDiffs);
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-['Inter'] tracking-tight text-white drop-shadow-md">
            File-Diff
          </h1>
          <p className="mt-1 text-sm text-blue-50 font-medium">专业文件对比工具</p>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">选择文件</h2>
          <div
            className="upload-area w-full"
            key={uploadKey}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-active');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-active');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-active');
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const fileList = Array.from(e.dataTransfer.files);
                handleMultipleFileChange(fileList);
              }
            }}
          >
            <input
              type="file"
              className="hidden"
              id="file-upload"
              key={uploadKey}
              accept=".txt,.md,.js,.ts,.jsx,.tsx,.css,.scss,.html,.json,.xml,.csv,.log,.py,.java,.c,.cpp,.h,.hpp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const fileList = Array.from(e.target.files);
                  handleMultipleFileChange(fileList);
                }
              }}
              multiple
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">
                  {files.length > 0 ? `已选择 ${files.length} 个文件` : '点击或拖放文件到此处'}
                </p>
                <p className="text-xs text-gray-500 bg-yellow-50 px-3 py-2 rounded border border-yellow-100 inline-block">
                  📝 仅支持文本文件（最大 10MB）| .txt, .md, .js, .ts, .json 等
                </p>
              </div>
            </label>
          </div>
          
          {files.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    已选择 {files.length} 个文件
                  </span>
                  {diffResult.length === 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      可继续添加
                    </span>
                  )}
                </div>
                {files.length > 0 && (
                  <button 
                    className="btn btn-secondary text-sm px-4 py-2"
                    onClick={handleClearAll}
                  >
                    清空
                  </button>
                )}
              </div>
              
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex-shrink-0"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-100">
              {errorMessage}
            </div>
          )}
          
          {warningMessage && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-100 whitespace-pre-line">
              {warningMessage}
            </div>
          )}
        </div>
        
        {diffResult.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">对比结果</h2>
            <div className="">
              <FileDiff 
                diffResult={diffResult} 
                file1Name={files[0]?.name} 
                file2Name={files[1]?.name} 
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white shadow-inner mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">File-Diff © 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;