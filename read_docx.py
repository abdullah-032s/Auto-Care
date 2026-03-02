import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path, output_path):
    try:
        docx = zipfile.ZipFile(docx_path)
        content = docx.read('word/document.xml')
        tree = ET.fromstring(content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in tree.findall('.//w:p', ns):
            texts = [t.text for r in p.findall('.//w:r', ns) for t in r.findall('.//w:t', ns) if t is not None and t.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(paragraphs))
            
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    extract_text_from_docx(r'C:\Users\Chaudhry Traders\Desktop\Chapter 5 Implementation.docx', 'extracted_chapter5.txt')
