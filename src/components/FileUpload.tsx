import { useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  fileName?: string | undefined;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, fileName }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileInputChange}
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
            {fileName ? `已选择: ${fileName}` : '点击或拖放文件到此处'}
          </p>
          <p className="text-gray-400 text-sm">
            支持同时选择多个文件，只对比前两个
          </p>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;