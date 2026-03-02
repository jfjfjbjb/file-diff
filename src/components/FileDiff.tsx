export interface DiffItem {
  type: 'add' | 'remove' | 'neutral';
  line1: number | null;
  line2: number | null;
  content: string;
}

interface FileDiffProps {
  diffResult: DiffItem[];
  file1Name?: string | undefined;
  file2Name?: string | undefined;
}

const FileDiff: React.FC<FileDiffProps> = ({ diffResult, file1Name, file2Name }) => {
  // 统计差异
  const stats = {
    add: diffResult.filter(item => item.type === 'add').length,
    remove: diffResult.filter(item => item.type === 'remove').length,
    neutral: diffResult.filter(item => item.type === 'neutral').length
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-medium">{file1Name || '文件 1'}</h3>
          </div>
          <div className="text-gray-400">→</div>
          <div>
            <h3 className="font-medium">{file2Name || '文件 2'}</h3>
          </div>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-add font-medium">+{stats.add}</span>
            <span className="text-gray-500">添加</span>
          </div>
          <div className="stat-item">
            <span className="stat-remove font-medium">-{stats.remove}</span>
            <span className="text-gray-500">删除</span>
          </div>
          <div className="stat-item">
            <span className="text-gray-600 font-medium">{stats.neutral}</span>
            <span className="text-gray-500">相同</span>
          </div>
        </div>
      </div>
      
      <div className="file-diff bg-gray-50 rounded-md overflow-hidden border border-gray-200">
        <div className="grid grid-cols-[40px_1fr_40px_1fr] border-b border-gray-200">
          <div className="bg-gray-100 p-2 text-xs font-medium text-gray-500 text-center">#</div>
          <div className="bg-gray-100 p-2 text-xs font-medium text-gray-500">{file1Name || '文件 1'}</div>
          <div className="bg-gray-100 p-2 text-xs font-medium text-gray-500 text-center">#</div>
          <div className="bg-gray-100 p-2 text-xs font-medium text-gray-500">{file2Name || '文件 2'}</div>
        </div>
        
        {diffResult.map((item, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-[40px_1fr_40px_1fr] ${item.type === 'add' ? 'diff-line-add' : item.type === 'remove' ? 'diff-line-remove' : 'diff-line-neutral'}`}
          >
            {/* 文件1的行号 */}
            <div className="text-right text-gray-500 px-2 py-0.5 font-mono text-sm">
              {item.line1 || ''}
            </div>
            {/* 文件1的内容 */}
            <div className="px-2 py-0.5 font-mono text-sm break-all">
              {item.type !== 'add' ? item.content : ''}
            </div>
            {/* 文件2的行号 */}
            <div className="text-right text-gray-500 px-2 py-0.5 font-mono text-sm">
              {item.line2 || ''}
            </div>
            {/* 文件2的内容 */}
            <div className="px-2 py-0.5 font-mono text-sm break-all">
              {item.type !== 'remove' ? item.content : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDiff;