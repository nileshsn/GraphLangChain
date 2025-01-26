# import streamlit as st
# import os
# from langchain import LLMChain
# from langchain.chains import RetrievalQA
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_chroma import Chroma
# from langchain_community.chat_message_histories import ChatMessageHistory
# from langchain_core.chat_history import BaseChatMessageHistory
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_groq import ChatGroq
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from dotenv import load_dotenv

# load_dotenv()

# os.environ['HF_TOKEN'] = os.getenv("HF_TOKEN")
# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# st.title("Conversational RAG With PDF Uploads and Chat History")
# st.write("Upload PDFs and chat with their content")

# # Directly setting the Groq API key
# api_key = "...."
# llm = ChatGroq(groq_api_key=api_key, model_name="Gemma2-9b-It")

# if 'store' not in st.session_state:
#     st.session_state.store = {}

# uploaded_files = st.file_uploader("Choose a PDF file", type="pdf", accept_multiple_files=True)

# if uploaded_files:
#     documents = []
#     for uploaded_file in uploaded_files:
#         temppdf = f"./temp.pdf"
#         with open(temppdf, "wb") as file:
#             file.write(uploaded_file.getvalue())
#             file_name = uploaded_file.name

#         loader = PyPDFLoader(temppdf)
#         docs = loader.load()
#         documents.extend(docs)

#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
#     splits = text_splitter.split_documents(documents)
#     vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
#     retriever = vectorstore.as_retriever()

#     # Only for reformulating the question based on the chat history
#     contextualize_q_system_prompt = (
#         "Given a chat history and the latest user question, "
#         "which might reference context in the chat history, "
#         "formulate a standalone question which can be understood "
#         "without the chat history. Do NOT answer the question, "
#         "just reformulate it if needed and otherwise return it as is."
#     )
#     contextualize_q_prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", contextualize_q_system_prompt),
#             MessagesPlaceholder("chat_history"),
#             ("human", "{input}"),
#         ]
#     )

#     history_aware_retriever = LLMChain(
#         llm=llm,
#         prompt=contextualize_q_prompt,
#         retriever=retriever
#     )

#     # QA Prompt Template
#     system_prompt = (
#         "You are an assistant for question-answering tasks. "
#         "Use the following pieces of retrieved context to answer "
#         "the question. If you don't know the answer, say that you "
#         "don't know. Use three sentences maximum and keep the "
#         "answer concise."
#         "\n\n"
#         "{context}"
#     )
#     qa_prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", system_prompt),
#             MessagesPlaceholder("chat_history"),
#             ("human", "{input}"),
#         ]
#     )

#     question_answer_chain = LLMChain(
#         llm=llm,
#         prompt=qa_prompt
#     )

#     rag_chain = RetrievalQA(
#         retriever=history_aware_retriever,
#         llm=llm,
#         chain=question_answer_chain
#     )

#     def get_session_history(session: str) -> BaseChatMessageHistory:
#         if session not in st.session_state.store:
#             st.session_state.store[session] = ChatMessageHistory()
#         return st.session_state.store[session]

#     session_id = st.text_input("Session ID", value="default_session")
#     user_input = st.text_input("Your question:")

#     if user_input:
#         session_history = get_session_history(session_id)
#         context = retriever.get_relevant_documents(user_input)
#         response = rag_chain(
#             {"input": user_input, "context": context},
#             config={
#                 "configurable": {"session_id": session_id}
#             },
#         )
#         st.write("Assistant:", response['answer'])
#         st.write("Chat History:", session_history.messages)










import streamlit as st
import os
from langchain import LLMChain
from langchain.chains import RetrievalQA
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_chroma import Chroma
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

os.environ['HF_TOKEN'] = os.getenv("HF_TOKEN")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

st.title("Conversational RAG With PDF Uploads and Chat History")
st.write("Upload PDFs and chat with their content")

api_key = "...."
llm = ChatGroq(groq_api_key=api_key, model_name="Gemma2-9b-It")

if 'store' not in st.session_state:
    st.session_state.store = {}

uploaded_files = st.file_uploader("Choose a PDF file", type="pdf", accept_multiple_files=True)

if uploaded_files:
    documents = []
    for uploaded_file in uploaded_files:
        temppdf = f"./temp.pdf"
        with open(temppdf, "wb") as file:
            file.write(uploaded_file.getvalue())
            file_name = uploaded_file.name

        loader = PyPDFLoader(temppdf)
        docs = loader.load()
        documents.extend(docs)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
    splits = text_splitter.split_documents(documents)
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
    retriever = vectorstore.as_retriever()

    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question, "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    history_aware_retriever = LLMChain(
        llm=llm,
        prompt=contextualize_q_prompt
    )

    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use three sentences maximum and keep the "
        "answer concise."
        "\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = LLMChain(
        llm=llm,
        prompt=qa_prompt
    )

    rag_chain = RetrievalQA(
        retriever=retriever,  # Use the retriever separately
        llm=llm,
        chain=question_answer_chain
    )

    def get_session_history(session: str) -> BaseChatMessageHistory:
        if session not in st.session_state.store:
            st.session_state.store[session] = ChatMessageHistory()
        return st.session_state.store[session]
    
    session_id = st.text_input("Session ID", value="default_session")
    user_input = st.text_input("Your question:")

    if user_input:
        session_history = get_session_history(session_id)
        context = retriever.get_relevant_documents(user_input)  
        response = rag_chain(
            {"input": user_input, "context": context},
            config={"configurable": {"session_id": session_id}},
        )
        st.write("Assistant:", response['answer'])
        st.write("Chat History:", session_history.messages)