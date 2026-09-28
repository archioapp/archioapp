import os
import glob

# Find the file
for root, dirs, files in os.walk('/'):
    for f in files:
        if f == 'PsychologyAnalytics.tsx':
            full_path = os.path.join(root, f)
            print(f"Found: {full_path}")
            
            with open(full_path, 'r') as fh:
                lines = fh.readlines()
            
            # Find marker
            marker_idx = None
            for i, line in enumerate(lines):
                if '___ORPHAN_REMOVAL_POINT___' in line:
                    marker_idx = i
                    break
            
            if marker_idx is None:
                print("Marker not found")
            else:
                good_lines = lines[:marker_idx]
                with open(full_path, 'w') as fh:
                    fh.writelines(good_lines)
                print(f"Truncated at line {marker_idx + 1}. Kept {len(good_lines)} lines. Removed {len(lines) - marker_idx} lines.")
            break
    else:
        continue
    break
