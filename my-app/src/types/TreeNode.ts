export type TreeNode = {
    id: string;
    name: string;
    isFolder: boolean;
    content?: string;
    children?: TreeNode[];
};