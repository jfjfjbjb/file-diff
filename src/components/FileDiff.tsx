import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

/**
 * 文件差异对比组件属性
 */
interface FileDiffProps {
  content1: string;
  content2: string;
  file1Name?: string | undefined;
  file2Name?: string | undefined;
}

/**
 * 文件差异对比组件
 */
const FileDiff: React.FC<FileDiffProps> = ({
  content1,
  content2,
  file1Name,
  file2Name,
}) => {
  const oldValue = content1;
  const newValue = content2;

  return (
    <div className="card w-full">
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
              styles={{
                diffContainer: {
                  minWidth: "0",
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
