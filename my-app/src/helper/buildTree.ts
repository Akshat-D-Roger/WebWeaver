import { boltAction } from "@/types/boltAction";
import { TreeNode } from "@/types/TreeNode";

export function buildTree(files: boltAction[]): TreeNode[] {
    const root: TreeNode = {
      id: '/',
      name: '/',
      isFolder: true,
      children: [],
    };
  
    for (const item of files) {
      if(item.type!='file')
      continue;
      const parts = (item.filePath as string).split('/');
      let current = root;
  
      parts.forEach((part, idx) => {
        const isLast = idx === parts.length - 1;
        const path = parts.slice(0, idx + 1).join('/');
  
        if (!current.children) current.children = [];
  
        let existing = current.children.find((child) => child.name === part);
  
        if (!existing) {
          existing = {
            id: path,
            name: part,
            isFolder: !isLast,
            ...(isLast ? { content: item.content } : { children: [] }),
          };
          current.children.push(existing);
        }
  
        current = existing;
      });
    }
  
    return root.children || [];
  }
  