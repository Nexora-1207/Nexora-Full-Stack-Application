for path in ['app/about/page.tsx', 'components/Footer.tsx']:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('\\"', '"')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
print('Fixed backslashes in about and footer!')

