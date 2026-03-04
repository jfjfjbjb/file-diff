import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

export interface DiffItem {
  type: "add" | "remove" | "neutral";
  line1: number | null;
  line2: number | null;
  content: string;
}

interface FileDiffProps {
  diffResult: DiffItem[];
  file1Name?: string | undefined;
  file2Name?: string | undefined;
}

const FileDiff: React.FC<FileDiffProps> = ({
  diffResult,
  file1Name,
  file2Name,
}) => {
  // 统计差异
  // const stats = {
  //   add: diffResult.filter(item => item.type === 'add').length,
  //   remove: diffResult.filter(item => item.type === 'remove').length,
  //   neutral: diffResult.filter(item => item.type === 'neutral').length
  // };

  // 从diffResult生成原始文本
  const generateOriginalText = () => {
    return diffResult
      .filter((item) => item.type !== "add")
      .map((item) => item.content)
      .join("\n");
  };

  const generateModifiedText = () => {
    return diffResult
      .filter((item) => item.type !== "remove")
      .map((item) => item.content)
      .join("\n");
  };


  const oldValue = generateOriginalText();
  const newValue = generateModifiedText();

  return (
    <div className="card w-full">
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <div>
            <h3 className="font-medium">{file1Name || '文件 1'}</h3>
          </div>
          <div className="text-gray-400">→</div>
          <div>
            <h3 className="font-medium">{file2Name || '文件 2'}</h3>
          </div>
        </div>
        <div className="stats flex flex-wrap gap-4">
          <div className="stat-item flex items-center gap-1">
            <span className="stat-add font-medium">+{stats.add}</span>
            <span className="text-gray-500">添加</span>
          </div>
          <div className="stat-item flex items-center gap-1">
            <span className="stat-remove font-medium">-{stats.remove}</span>
            <span className="text-gray-500">删除</span>
          </div>
          <div className="stat-item flex items-center gap-1">
            <span className="text-gray-600 font-medium">{stats.neutral}</span>
            <span className="text-gray-500">相同</span>
          </div>
        </div>
      </div> */}

      <div className="file-diff bg-gray-50 rounded-md overflow-hidden border border-gray-200 w-full">
        <div className="flex flex-col">
          {/* 内容区域 - 带滚动条 */}
          <div className="w-full">
            <ReactDiffViewer
              oldValue={oldValue}
              newValue={newValue}
              leftTitle={file1Name || "文件 1"}
              rightTitle={file2Name || "文件 2"}
              splitView={true}
              infiniteLoading={{
                pageSize: 20,
                containerHeight: "80vh",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDiff;
