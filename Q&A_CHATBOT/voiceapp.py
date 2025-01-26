import streamlit as st
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
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
os.environ["LANGCHAIN_PROJECT"] = "Simple Q&A Chatbot With Groq"

# Initialize the output parser
output_parser = StrOutputParser()

# Prompt Template for Q&A
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Please respond to the user queries."),
        ("user", "Question: {question}")
    ]
)

def generate_response(question, model_name, temperature, max_tokens):
    # Initialize the Groq model with the selected model name and API key
    llm = ChatGroq(model=model_name, groq_api_key=groq_api_key)
    chain = prompt | llm | output_parser
    
    # Generate and return the response
    answer = chain.invoke({'question': question})
    return answer

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

# Title of the app
st.title("Enhanced Q&A Chatbot With Groq")
st.sidebar.title("Settings")

# Available models (ensure these models are accessible in your Groq environment)
available_models = ["Gemma2-9b-It", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]

# Select the model
model_name = st.sidebar.selectbox("Select Model", available_models)

# Adjust response parameter
temperature = st.sidebar.slider("Temperature", min_value=0.0, max_value=1.0, value=0.7)
max_tokens = st.sidebar.slider("Max Tokens", min_value=50, max_value=300, value=150)

# Main interface for user input
st.write("Go ahead and ask any question")
user_input = st.text_input("You:")

# Button for voice input
if st.button("Voice Input"):
    voice_query = voice_input()
    if voice_query:
        user_input = voice_query

# Trigger the response generation when user input is provided
if user_input:
    response = generate_response(user_input, model_name, temperature, max_tokens)
    st.write(response)
    
    # Play the response as audio
    st.audio(text_to_speech(response).read(), format="audio/wav")
else:
    st.write("Please provide the user input.")
