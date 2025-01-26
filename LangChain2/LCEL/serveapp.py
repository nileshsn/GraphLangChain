import streamlit as st
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize the Groq model
model = ChatGroq(model="Gemma2-9b-It", groq_api_key=groq_api_key)
parser = StrOutputParser()

# Define a translation prompt template
prompt = ChatPromptTemplate.from_messages(
    [("system", "Translate the following into {language}:"), ("user", "{text}")]
)

st.title("Text Translator")
text_to_translate = st.text_input("Enter text to translate:")

# Input for target language
target_language = st.text_input("Enter the target language:")

if st.button("Translate"):
    if text_to_translate and target_language:
        try:
            # Translate the text
            result = (prompt | model | parser).invoke({"language": target_language, "text": text_to_translate})
            st.write("Translation:", result)
        except Exception as e:
            st.error(f"Error: {e}")
    else:
        st.warning("Please enter both the text and the target language.")


# import os
# from dotenv import load_dotenv
# load_dotenv()
# import streamlit as st
# st.title("Text Translation")
# import openai
# openai.api_key=os.getenv("OPENAI_API_KEY")
# groq_api_key=os.getenv("GROQ_API_KEY")
# from fastapi import FastAPI
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# parser=StrOutputParser()
# from langchain_groq import ChatGroq
# model=ChatGroq(model="Gemma2-9b-It",groq_api_key=groq_api_key)
# generic_templete="translate the following int {language}"
# prompt=ChatPromptTemplate.from_messages(
#   [("system",generic_templete),("user","{text}")]
# )
# chain2=prompt|model|parser
# languge=st.text_input("Language")
# text=st.text_input('Enter message to Translate')
# data=''
# if st.button("Transtale"):
#   data=chain2.invoke({"language":f"{languge}","text":f"{text}"})

# st.write(data)