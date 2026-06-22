with open('src/screens/CollegeScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("\\'", "'")

with open('src/screens/CollegeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed backslashes!')
