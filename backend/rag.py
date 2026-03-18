#part1-simplified the answer for user question 

def answer_question(user_question: str) -> dict:

#step1: embedded the user question
    from langchain_google_genai import GoogleGenerativeAIEmbeddings #import libraries
    import os
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
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
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    response = llm.invoke(prompt)
    return {"answer": response.content, "sources": results["metadatas"][0]}        