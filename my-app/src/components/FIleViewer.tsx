'use client';

import { Tree, NodeApi, TreeApi } from 'react-arborist';
import { useMemo, useState } from 'react';
import { useStore } from '@/store/store';
import { boltAction } from '@/types/boltAction';
import { buildTree } from '@/helper/buildTree';
import { TreeNode } from '@/types/TreeNode';
import { VscFile, VscFolder, VscFolderOpened } from "react-icons/vsc";

export default function FileViewer({files}:{files:boltAction[]}) {
  const {template} = useStore();  
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const treeData = useMemo(()=>{
    const allFiles = [...files];
    template.forEach(tfile => {
        const name = tfile.filePath
        if(!(allFiles.find(item => item.filePath===name)))
            allFiles.push(tfile);
    })
    return buildTree(allFiles);
  }, [files, template])

  return (
    <div className="h-full flex">
      <div className="w-1/4 h-full overflow-auto">
        <Tree<TreeNode>
          data={treeData}
          openByDefault
          rowHeight={30}
          onSelect={(nodes) => {
            const fileNode = nodes[0];
            if (fileNode && !fileNode.data.isFolder) {
              setSelectedContent(fileNode.data.content ?? "");
            }
          }}
        >
          {(props) => (
            <Node {...props} />
          )}
        </Tree>
      </div>

      <div className="w-3/4 h-full">
        <div className="w-full h-full bg-black p-4 rounded whitespace-pre-wrap text-sm overflow-auto">
          {selectedContent || "Select a file to view its content"}
        </div>
      </div>
    </div>
  );
}

// Properly typed Node component
interface NodeProps {
    style: React.CSSProperties;
    node: NodeApi<TreeNode>;
    tree: TreeApi<TreeNode>;
    dragHandle?: (el: HTMLDivElement | null) => void;
    preview?: boolean;
  }

function Node({ node, style, dragHandle }: NodeProps) {
  const handleFolderClick = (e: React.MouseEvent) => {
    if (node.data.isFolder) {
      e.stopPropagation();
      node.toggle();
    }
  };

  // Handle both click on the entire row and icon
  const handleRowClick = (e: React.MouseEvent) => {
    if (node.data.isFolder) {
      e.stopPropagation();
      node.toggle();
    }
  };

  return (
    <div 
      style={style} 
      ref={dragHandle || null}
      className="flex items-center gap-2 py-1 px-2 hover:bg-slate-700 cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Indentation based on depth */}
      <div style={{ paddingLeft: `${node.level * 16}px` }} className="flex items-center gap-2 w-full">
        {/* File/Folder Icons - clickable for folders */}
        <div onClick={handleFolderClick} className="flex items-center">
          {node.data.isFolder ? (
            node.isOpen ? (
              <VscFolderOpened className="text-yellow-300" />
            ) : (
              <VscFolder className="text-yellow-300" />
            )
          ) : (
            <VscFile className="text-blue-300" />
          )}
        </div>
        
        {/* File/Folder Name */}
        <span className={node.data.isFolder ? "font-medium" : ""}>
          {node.data.name}
        </span>
      </div>
    </div>
  );
}