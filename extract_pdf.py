import sys
import subprocess

def install_and_extract():
    try:
        import PyPDF2
    except ImportError:
        print("Installing PyPDF2...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
        import PyPDF2
        
    pdf_path = r'C:\Users\Chaudhry Traders\Desktop\latex 8th\FYP Latex Templete.pdf'
    output_path = 'extracted_latex_pdf.txt'
    
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = []
        for page in reader.pages:
            text.append(page.extract_text())
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n\n---PAGE BREAK---\n\n'.join(text))
            
        print("Successfully extracted PDF text!")
    except Exception as e:
        print(f"Error extracting PDF: {e}")

if __name__ == '__main__':
    install_and_extract()
