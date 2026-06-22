import re

with open('src/screens/CollegeScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"color: '#FFF'", r"color: isDark ? '#FFF' : '#111'", content)
content = re.sub(r"color: neonCyan", r"color: themeCyan", content)
content = re.sub(r"shadowColor: neonCyan", r"shadowColor: themeCyan", content)
content = re.sub(r"borderColor: neonCyan", r"borderColor: themeCyan", content)
content = re.sub(r"backgroundColor: neonCyan", r"backgroundColor: themeCyan", content)
content = re.sub(r"backgroundColor: '#0D0D1D'", r"backgroundColor: isDark ? '#0D0D1D' : '#FFF'", content)
content = re.sub(r"backgroundColor: '#070718'", r"backgroundColor: isDark ? '#070718' : '#F4F6F9'", content)
content = re.sub(r"backgroundColor: 'rgba\(255,255,255,0\.02\)'", r"backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFF'", content)
content = re.sub(r'barStyle="light-content"', r'barStyle={isDark ? "light-content" : "dark-content"}', content)
content = re.sub(r"color=\"#000\"", r"color={isDark ? '#000' : '#FFF'}", content)
content = re.sub(r"color: '#000'", r"color: isDark ? '#000' : '#FFF'", content)
content = re.sub(r"backgroundColor: 'rgba\(255,255,255,0\.05\)'", r"backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'", content)

with open('src/screens/CollegeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Styles updated!')
