# ingest.py - Load PDFs into ChromaDB
from pathlib import Path

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

def ingest_documents(pdf_path, persist_directory="./chroma_db"):
    loader = PyMuPDFLoader(pdf_path)
    documents = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(documents)
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001"
    )
    
    db_path = str(Path(persist_directory).resolve())

    vectorstore = Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory=db_path,
    )
    vectorstore.persist()
    print("✅ Documents ingested successfully!")