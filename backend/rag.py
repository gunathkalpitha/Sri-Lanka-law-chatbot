#part1-simplified the answer for user question 

from dotenv import load_dotenv
import os

load_dotenv()

def answer_question(user_question: str) -> dict:

#step1: embedded the user question
    from langchain_google_genai import GoogleGenerativeAIEmbeddings #import libraries
    embedding_model = os.getenv("GOOGLE_EMBEDDING_MODEL", "models/gemini-embedding-001")
    embeddings = GoogleGenerativeAIEmbeddings(model=embedding_model)
    question_vector = embeddings.embed_query(user_question)
    
#step2: Result save in chromaDB database
    import chromadb
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    chroma_collection = chroma_client.get_or_create_collection(name="langchain")
    results = chroma_collection.query(
        query_embeddings=[question_vector],
        n_results=5
    )
#step3: Build context from retrieved chunks
    context = "\n\n".join(results["documents"][0])

 # 4step: Send to LLM with a prompt
    prompt = f"""
    You are a Sri Lanka legal assistant.
    Answer the question using ONLY the context below.
    Always cite the specific Act and section.
    
    Context: {context}
    Question: {user_question}
    """
    
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-2.5-flash")
    llm = ChatGoogleGenerativeAI(model=llm_model, temperature=0)
    response = llm.invoke(prompt)
    return {"answer": response.content, "sources": results["metadatas"][0]}        