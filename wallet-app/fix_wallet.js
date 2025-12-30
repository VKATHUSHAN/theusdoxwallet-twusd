import { readFileSync, writeFileSync } from 'fs';
const path = 'c:\\Users\\kathu\\projects\\theusdoxwallet-twusd\\wallet-app\\src\\wallet-architecture.ts';

try {
  const content = readFileSync(path, 'utf8');
  const lines = content.split('\n');
  
  // Lines to remove: 335 to 368 (1-based)
  // 0-based index: 334 to 367
  
  const startLine = 335;
  const endLine = 368;
  const startIndex = startLine - 1;
  const count = endLine - startLine + 1;
  
  console.log(`Total lines before: ${lines.length}`);
  console.log(`Removing lines ${startLine} to ${endLine} (${count} lines)`);
  
  // Verify context
  console.log('Line 333 (Index 332):', lines[332]); // Should be "}"
  console.log('Line 335 (Index 334):', lines[334]); // Should start with "export"
  console.log('Line 368 (Index 367):', lines[367]); // Should be "}"
  console.log('Line 371 (Index 370):', lines[370]); // Should contain EXAMPLE USAGE

  lines.splice(startIndex, count);
  
  console.log(`Total lines after: ${lines.length}`);
  
  const newContent = lines.join('\n');
  writeFileSync(path, newContent, 'utf8');
  console.log('File updated successfully.');
  
} catch (error) {
  console.error('Error:', error);
}
