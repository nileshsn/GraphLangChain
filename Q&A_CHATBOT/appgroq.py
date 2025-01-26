import streamlit as st
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

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

# Trigger the response generation when user input is provided
if user_input:
    response = generate_response(user_input, model_name, temperature, max_tokens)
    st.write(response)
else:
    st.write("Please provide the user input.")



# import streamlit as st
# from langchain_community.llms import Ollama
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.prompts import ChatPromptTemplate
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Langsmith Tracking
# os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
# os.environ["LANGCHAIN_TRACING_V2"] = "true"
# os.environ["LANGCHAIN_PROJECT"] = "Simple Q&A Chatbot With Ollama"

# # Prompt Template
# prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", "You are a helpful assistant. Please respond to the user queries."),
#         ("user", "Question:{question}")
#     ]
# )

# def generate_response(question,llm,temperature,max_tokens):
#     llm=Ollama(model=llm)
#     output_parser=StrOutputParser()
#     chain=prompt|llm|output_parser
#     answer=chain.invoke({'question':question})
#     return answer

# # Title of the app
# st.title("Enhanced Q&A Chatbot With Ollama")

# # Sidebar for settings
# st.sidebar.title("Settings")

# # Select the model
# model_name = st.sidebar.selectbox("Select Model", ["gemma2:2b"])

# # Adjust response parameter
# temperature = st.sidebar.slider("Temperature", min_value=0.0, max_value=1.0, value=0.7)
# max_tokens = st.sidebar.slider("Max Tokens", min_value=50, max_value=300, value=150)

# # Main interface for user input
# st.write("Go ahead and ask any question")
# user_input = st.text_input("You:")

# if user_input:
#     response = generate_response(user_input, model_name, temperature, max_tokens)
#     st.write(response)
# else:
#     st.write("Please provide the user input.")

