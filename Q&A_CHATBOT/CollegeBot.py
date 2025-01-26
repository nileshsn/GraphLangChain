import streamlit as st
import os
import fitz  # PyMuPDF library for PDF processing
import pdfplumber
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
import speech_recognition as sr
from gtts import gTTS
from io import BytesIO

# Load environment variables
load_dotenv()

# Fetch the GROQ API key from the environment variables
groq_api_key = os.getenv("GROQ_API_KEY")

# Langsmith Tracking
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "RAG Q&A Chatbot With Groq"

# Initialize the output parser
output_parser = StrOutputParser()

# Context and Prompt Template for Q&A with retrieval
context = """
You are a knowledgeable and helpful chatbot designed to assist students, faculty, and visitors of the Rajiv Gandhi University of Knowledge Technologies (RGUKT), Basar, Telangana State. Your primary role is to provide accurate and detailed information about the Six-Year Integrated B.Tech Programme, including the 2-Year Pre-University Course (PUC) and the 4-Year B.Tech Programme.

You can answer questions related to:
- Admissions process
- Program duration and study structure
- Grading system and examination procedures
- Attendance and promotion rules
- Disciplinary actions and student conduct
- Fees, certifications, and revaluation processes

You are strictly limited to providing information only about the university and its academic programs, rules, and regulations. If a query does not relate to the university or its academic guidelines, you should politely inform the user that you can only assist with university-related topics.
"""

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", context),
        ("user", "Question: {question}\n\nContext: {context}")
    ]
)

# Initialize the embedding model
embedding_model = HuggingFaceEmbeddings(model_name="distilbert-base-nli-stsb-mean-tokens")

# Function to extract text from a PDF using PyMuPDF and pdfplumber
def extract_text_from_pdf(pdf_path):
    text = ""
    
    # Using pdfplumber for complex PDFs
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        st.error(f"Error with pdfplumber: {e}")

    # Fall back to PyMuPDF if pdfplumber fails
    if not text:
        try:
            doc = fitz.open(pdf_path)
            for page_number in range(len(doc)):
                page = doc.load_page(page_number)
                text += page.get_text("text")
        except Exception as e:
            st.error(f"Error with PyMuPDF: {e}")
    
    return text

# Function to scrape data from the RGUKT website
def scrape_rgukt_website(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad HTTP status codes
        soup = BeautifulSoup(response.text, 'html.parser')
        texts = [p.get_text() for p in soup.find_all('p')]
        return " ".join(texts)
    except requests.RequestException as e:
        st.error(f"Error fetching website data: {e}")
        return ""

# Function to ingest predefined PDFs and create a vector store
# Function to ingest predefined PDFs and create a new vector store with 768-dimensional embeddings
def ingest_data():
    pdf_paths = ["academic_rules.pdf", "academic_rules2.pdf"]
    website_url = "https://www.rgukt.ac.in"
    documents = []

    # Extract text from predefined PDFs
    for pdf_path in pdf_paths:
        text = extract_text_from_pdf(pdf_path)
        if text:
            documents.append(Document(page_content=text))
        else:
            st.warning(f"No text extracted from {pdf_path}.")

    # Scrape and add website data
    website_text = scrape_rgukt_website(website_url)
    if (website_text):
        documents.append(Document(page_content=website_text))

    # Reinitialize vector store to match the embedding dimension of 768
    if documents:
        vector_store = Chroma.from_documents(documents, embedding_model)  # Make sure the collection is new
        return vector_store
    else:
        st.error("No documents to process.")
        return None

# Call the ingest_data function after setting up the new embedding model
embedding_model = HuggingFaceEmbeddings(model_name="distilbert-base-nli-stsb-mean-tokens")
vector_store = ingest_data()


# Function to capture voice input and convert it to text
def voice_input():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    with mic as source:
        st.write("Listening for your question...")
        audio = recognizer.listen(source)
    try:
        user_voice_input = recognizer.recognize_google(audio)
        st.write(f"Recognized: {user_voice_input}")
        return user_voice_input
    except sr.UnknownValueError:
        st.write("Could not understand the audio.")
    except sr.RequestError:
        st.write("Could not request results; check your internet connection.")
    return None

# Function to convert text response to speech
def text_to_speech(text):
    tts = gTTS(text)
    fp = BytesIO()
    tts.write_to_fp(fp)
    fp.seek(0)
    return fp

# Function to determine if a query is relevant
def is_query_relevant(context, threshold=0.2):
    return len(context.strip()) > 0

# Function to generate response using Groq model with enhanced context handling
def generate_response(question, model_name="Gemma2-9b-It", vector_store=None):
    try:
        if vector_store:
            # Retrieve multiple results from vector store to ensure broad coverage
            results = vector_store.similarity_search(question, k=5)  # Increase 'k' to retrieve more results
            context = " ".join([result.page_content for result in results])

            # Limit context size to a maximum number of tokens or characters
            max_context_length = 2000
            if len(context) > max_context_length:
                context = context[:max_context_length]

            if not is_query_relevant(context, threshold=0.2):
                return "I'm sorry, I can only answer questions related to the college data."

            # Initialize the Groq model with the selected model name and API key
            llm = ChatGroq(model=model_name, groq_api_key=groq_api_key)
            chain = prompt_template | llm | output_parser

            # Generate and return the response
            answer = chain.invoke({'question': question, 'context': context})
            return answer
        else:
            return "Vector store is not available."
    
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return "An error occurred while processing your request."

# Main interface for user input
st.write("Go ahead and ask any question related to your college data.")
user_input = st.text_input("You:")

# Button for voice input
if st.button("Voice Input"):
    voice_query = voice_input()
    if voice_query:
        user_input = voice_query

# Trigger the response generation when user input is provided
if user_input:
    # Assuming vector_store is already initialized by the ingest_data function
    vector_store = ingest_data()
    response = generate_response(user_input, vector_store=vector_store)
    st.write(response)
    
    # Play the response as audio
    st.audio(text_to_speech(response).read(), format="audio/wav")
else:
    st.write("Please provide the user input.")
