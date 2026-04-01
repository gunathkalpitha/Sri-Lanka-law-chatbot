How It Works

Upload a Sri Lankan legal Act as a PDF
Ask a question in English, Sinhala, or Tamil
Get an AI-generated answer citing the exact Act and section

Uses a RAG pipeline — ChromaDB retrieves relevant document chunks, Google Gemini generates the answer.

Tech Stack
LayerToolsBackendPython, FastAPI, LangChainFrontendReact, Vite, Tailwind CSS, i18nextLLM & EmbeddingsGoogle GeminiVector StoreChromaDBPDF ParsingPyMuPDF

Quick Start
Backend
bashcd backend
pip install -r requirements.txt
echo "GOOGLE_API_KEY=your_key_here" > .env
uvicorn main:app --reload
Frontend
bashcd frontend
npm install
npm run dev
Open http://localhost:5173, upload a PDF, and start asking questions.

Project Structure
├── backend/
│   ├── main.py          # API endpoints
│   ├── ingest.py        # PDF → chunks → embeddings → ChromaDB
│   ├── rag.py           # Retrieval + Gemini generation
│   └── chroma_db/       # Persistent vector store
└── frontend/
    ├── src/
    │   ├── components/ChatInterface.jsx
    │   └── components/DocumentUpload.jsx
    └── locales.json     # EN / සිංහල / தமிழ்
