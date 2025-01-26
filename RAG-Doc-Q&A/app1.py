import streamlit as st
import os
import tempfile
from langchain_groq import ChatGroq
from langchain_community.embeddings import SentenceTransformerEmbeddings  # Use an alternative like SentenceTransformers
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
import time
from dotenv import load_dotenv

load_dotenv()

# Load the GROQ API KEY
groq_api_key = os.getenv("GROQ_API_KEY")
os.environ['GROQ_API_KEY'] = groq_api_key

# Initialize the language model with Groq
llm = ChatGroq(groq_api_key=groq_api_key, model_name="mixtral-8x7b-32768")

# Define the prompt template
prompt = ChatPromptTemplate.from_template(
    """
    Answer the questions based on the provided context only.
    Please provide the most accurate response based on the question.
    <context>
    {context}
    <context>
    Question: {input}
    """
)

def create_vector_embedding(uploaded_files):
    if "vectors" not in st.session_state:
        st.session_state.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

        all_docs = []
        for uploaded_file in uploaded_files:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(uploaded_file.read())
                temp_file_path = temp_file.name

            # Use PyPDFLoader with the temp file path
            loader = PyPDFLoader(temp_file_path)
            docs = loader.load()
            all_docs.extend(docs)

        # Clean up the temporary files
        for file in uploaded_files:
            os.remove(temp_file_path)

        # Split the documents into chunks
        st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        st.session_state.final_documents = st.session_state.text_splitter.split_documents(all_docs)

        # Create a vector store from the documents
        st.session_state.vectors = FAISS.from_documents(st.session_state.final_documents, st.session_state.embeddings)

st.title("RAG Document Q&A With Groq Cloud Models")

# File uploader for user to upload PDFs
uploaded_files = st.file_uploader("Upload PDF files", type=["pdf"], accept_multiple_files=True)

if st.button("Document Embedding"):
    if uploaded_files:
        create_vector_embedding(uploaded_files)
        st.write("Vector Database is ready")
    else:
        st.write("Please upload at least one PDF file.")

user_prompt = st.text_input("Enter your query from the research paper")

if user_prompt:
    if "vectors" in st.session_state and st.session_state.vectors:
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = st.session_state.vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        start = time.process_time()
        response = retrieval_chain.invoke({'input': user_prompt})
        print(f"Response time: {time.process_time() - start}")

        st.write(response['answer'])

        # With a Streamlit expander
        with st.expander("Document similarity Search"):
            for i, doc in enumerate(response['context']):
                st.write(doc.page_content)
                st.write('------------------------')
    else:
        st.write("Please initialize the vector database first by uploading documents and clicking the 'Document Embedding' button.")
