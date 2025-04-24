import { boltAction } from "@/types/boltAction";
import { boltArtifact } from "@/types/boltArtifact";

export function parseBoltArtifact(text:string):boltArtifact{
  const artifactRegex = /<boltArtifact\s+id="([^"]+)"\s+title="([^"]+)">/;
  const artifactMatch = text.match(artifactRegex);
  
  // if (!artifactMatch) {
  //   throw new Error("No boltArtifact tag found in the XML string");
  // }
  
  const id = artifactMatch ? artifactMatch[1] : null;
  const title = artifactMatch ? artifactMatch[2] : null;
  const actions: boltAction[] = [];
  
  // Regular expression to match boltAction tags and their content
  const boltActionRegex = /<boltAction\s+type="([^"]+)"(?:\s+filePath="([^"]+)")?>([^<]*(?:<(?!\/boltAction)[^<]*)*)<\/boltAction>/g;
  
  let match;
  while ((match = boltActionRegex.exec(text)) !== null) {
    const type = match[1];
    const filePath = match[2] || undefined; // filePath might not exist for all actions
    const content = match[3].trim();
    
    actions.push({
      type,
      ...(filePath && { filePath }), // Add filePath only if it exists
      content,
    });
  }
  
  return {id, title, actions};
}