# Importing necessary libraries
from fastapi import FastAPI
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

import os 
from langserve import add_routes
from dotenv import load_dotenv
load_dotenv()

# Initialize the Groq model with a free open-source model
groq_api_key = os.getenv("GROQ_API_KEY")
model = ChatGroq(model="Gemma2-9b-It", groq_api_key=groq_api_key)

# 1. Create prompt template
system_template = "Translate the following into {language}:"
prompt_template = ChatPromptTemplate.from_messages([
    ('system', system_template),
    ('user', '{text}'),
])

# Correct parser initialization
parser = StrOutputParser()

# Create chain
chain = prompt_template | model | parser

# App definition
app = FastAPI(
    title="Langchain Server",
    version="1.0",
    description="A simple API server using Langchain runnable interfaces"
)

# Adding chain routes
add_routes(
    app,
    chain,
    path="/chain"
)

# Run the FastAPI app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
