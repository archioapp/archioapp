import os
import glob

# Find the file
search_paths = [
    '/vercel/share/v0-project/components/copilot/ai/CopilotAIView.tsx',
    os.path.join(os.getcwd(), 'components', 'copilot', 'ai', 'CopilotAIView.tsx'),
]

# Also try to find via glob
found = glob.glob('/vercel/**/CopilotAIView.tsx', recursive=True)
found += glob.glob('/home/**/CopilotAIView.tsx', recursive=True)
found += glob.glob('/workspace/**/CopilotAIView.tsx', recursive=True)
found += glob.glob('/app/**/CopilotAIView.tsx', recursive=True)

all_paths = search_paths + found
print("Searching paths:", all_paths)

file_path = None
for p in all_paths:
    if os.path.exists(p):
        file_path = p
        break

if not file_path:
    # Try to find it
    for root, dirs, files in os.walk('/'):
        if 'CopilotAIView.tsx' in files:
            file_path = os.path.join(root, 'CopilotAIView.tsx')
            break
        # Don't go too deep
        if root.count(os.sep) > 6:
            dirs.clear()

print(f"Found file at: {file_path}")

if file_path:
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    print(f"Total lines: {len(lines)}")
    
    # Find markers
    start_idx = None
    content_layer_idx = None
    
    for i, line in enumerate(lines):
        if 'old-code-start-marker' in line:
            start_idx = i
        if 'CONTENT LAYER' in line:
            content_layer_idx = i
    
    print(f"Start marker at line: {start_idx + 1 if start_idx is not None else 'NOT FOUND'}")
    print(f"Content layer at line: {content_layer_idx + 1 if content_layer_idx is not None else 'NOT FOUND'}")
    
    if start_idx is not None and content_layer_idx is not None:
        # Find the {/* that starts the CONTENT LAYER comment block
        block_start = content_layer_idx
        while block_start > start_idx and '{/*' not in lines[block_start]:
            block_start -= 1
        
        print(f"Will remove lines {start_idx + 1} through {block_start}")
        print(f"Removing {block_start - start_idx} lines")
        
        # Remove the dead code
        new_lines = lines[:start_idx] + lines[block_start:]
        
        with open(file_path, 'w') as f:
            f.writelines(new_lines)
        
        print(f"Done! File now has {len(new_lines)} lines (was {len(lines)})")
    else:
        print("Could not find markers!")
else:
    print("Could not find CopilotAIView.tsx!")
    # Print cwd
    print(f"CWD: {os.getcwd()}")
    print(f"Contents of CWD: {os.listdir(os.getcwd())}")
