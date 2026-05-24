import subprocess, os, shutil

ffmpeg = r'C:\Program Files\Red Giant\Trapcode Suite\Tools\ffmpeg.exe'
input_file = r'Q:\tsvetkova pro ai\Landing\media\herobg_optimized.mp4'
output_file = r'Q:\tsvetkova pro ai\Landing\media\herobg.mp4'

# Create reversed version
reversed_file = r'Q:\tsvetkova pro ai\Landing\media\herobg_rev.mp4'
subprocess.run([ffmpeg, '-i', input_file, '-vf', 'setpts=PTS-STARTPTS', '-an', '-y', reversed_file], capture_output=True)

# Concatenate forward + reverse for ping-pong
list_file = r'C:\Users\user\AppData\Local\Temp\ffmpeg_list.txt'
with open(list_file, 'w') as f:
    f.write(f"file '{input_file}'\nfile '{reversed_file}'\n")

final = r'Q:\tsvetkova pro ai\Landing\media\herobg_final.mp4'
subprocess.run([ffmpeg, '-f', 'concat', '-safe', '0', '-i', list_file, '-c', 'copy', '-y', final], capture_output=True)

# Replace original with ping-pong version
shutil.copy(final, output_file)

# Cleanup
for f in [reversed_file, final]:
    if os.path.exists(f):
        os.remove(f)

size = os.path.getsize(output_file) / 1024 / 1024
print(f'Final size: {size:.2f} MB')
