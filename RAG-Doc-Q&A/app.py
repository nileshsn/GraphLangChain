# ## RAG Q&A Conversation With PDF Including Chat History
# import streamlit as st
# from langchain.chains import create_history_aware_retriever, create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.vectorstores import FAISS
# from langchain_community.chat_message_histories import ChatMessageHistory
# from langchain_core.chat_history import BaseChatMessageHistory
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_groq import ChatGroq
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Set up Hugging Face embeddings
# os.environ['HF_TOKEN'] = os.getenv("HF_TOKEN")
# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# # Set up Streamlit app
# st.title("Conversational RAG With PDF Uploads and Chat History")
# st.write("Upload PDFs and chat with their content")

# # Input the Groq API Key
# api_key = "...."

# # Check if Groq API key is provided
# if api_key:
#     llm = ChatGroq(groq_api_key=api_key, model_name="Gemma2-9b-It")

#     # Chat interface
#     session_id = st.text_input("Session ID", value="default_session")

#     # Statefully manage chat history
#     if 'store' not in st.session_state:
#         st.session_state.store = {}

#     # File uploader for PDF
#     uploaded_files = st.file_uploader("Choose A PDF file", type="pdf", accept_multiple_files=True)

#     # Process uploaded PDFs
#     if uploaded_files:
#         documents = []
#         for uploaded_file in uploaded_files:
#             temppdf = "./temp.pdf"
#             with open(temppdf, "wb") as file:
#                 file.write(uploaded_file.getvalue())
#                 file_name = uploaded_file.name

#             loader = PyPDFLoader(temppdf)
#             docs = loader.load()
#             documents.extend(docs)

#         # Split and create embeddings for the documents
#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
#         splits = text_splitter.split_documents(documents)
        
#         # Use FAISS as the vector store
#         vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
#         retriever = vectorstore.as_retriever()

#         # Set up history-aware retrieval system
#         contextualize_q_system_prompt = (
#             "Given a chat history and the latest user question"
#             " which might reference context in the chat history, "
#             "formulate a standalone question which can be understood "
#             "without the chat history. Do NOT answer the question, "
#             "just reformulate it if needed and otherwise return it as is."
#         )

#         contextualize_q_prompt = ChatPromptTemplate.from_messages(
#             [
#                 ("system", contextualize_q_system_prompt),
#                 MessagesPlaceholder("chat_history"),
#                 ("human", "{input}"),
#             ]
#         )

#         history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

#         # Answer question
#         system_prompt = (
#             "You are an assistant for question-answering tasks. "
#             "Use the following pieces of retrieved context to answer "
#             "the question. If you don't know the answer, say that you "
#             "don't know. Use three sentences maximum and keep the "
#             "answer concise."
#             "\n\n"
#             "{context}"
#         )

#         qa_prompt = ChatPromptTemplate.from_messages(
#             [
#                 ("system", system_prompt),
#                 MessagesPlaceholder("chat_history"),
#                 ("human", "{input}"),
#             ]
#         )

#         question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
#         rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

#         def get_session_history(session: str) -> BaseChatMessageHistory:
#             if session_id not in st.session_state.store:
#                 st.session_state.store[session_id] = ChatMessageHistory()
#             return st.session_state.store[session_id]

#         def manage_conversation(user_input: str):
#             session_history = get_session_history(session_id)
#             response = rag_chain.invoke({
#                 "input": user_input,
#                 "chat_history": session_history.messages
#             })
#             # Update chat history
#             session_history.add_message({"role": "user", "content": user_input})
#             session_history.add_message({"role": "assistant", "content": response['answer']})
#             return response['answer']

#         # User input for question
#         user_input = st.text_input("Your question:")
#         if user_input:
#             answer = manage_conversation(user_input)
#             # Display the response and chat history
#             st.write(st.session_state.store)
#             st.write("Assistant:", answer)
#             st.write("Chat History:", get_session_history(session_id).messages)
# else:
#     st.warning("Please enter the Groq API Key")


## RAG Q&A Conversation With PDF Including Chat History
import streamlit as st
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.vectorstores import FAISS
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import os

# Set up Hugging Face embeddings with a token
os.environ['HF_TOKEN'] = "...."
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Set up Streamlit app
st.title("Conversational RAG With PDF Uploads and Chat History")
st.write("Upload PDFs and chat with their content")

# Input the Groq API Key
api_key = "...."

# Check if Groq API key is provided
if api_key:
    llm = ChatGroq(groq_api_key=api_key, model_name="Gemma2-9b-It")

    # Chat interface
    session_id = st.text_input("Session ID", value="default_session")

    # Statefully manage chat history
    if 'store' not in st.session_state:
        st.session_state.store = {}

    # File uploader for PDF
    uploaded_files = st.file_uploader("Choose A PDF file", type="pdf", accept_multiple_files=True)

    # Process uploaded PDFs
    if uploaded_files:
        documents = []
        for uploaded_file in uploaded_files:
            temppdf = "./temp.pdf"
            with open(temppdf, "wb") as file:
                file.write(uploaded_file.getvalue())
                file_name = uploaded_file.name

            loader = PyPDFLoader(temppdf)
            docs = loader.load()
            documents.extend(docs)

        # Split and create embeddings for the documents
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
        splits = text_splitter.split_documents(documents)
        
        # Use FAISS as the vector store
        vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
        retriever = vectorstore.as_retriever()

        # Set up history-aware retrieval system
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question"
            " which might reference context in the chat history, "
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

        history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

        # Answer question
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

        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        def get_session_history(session: str) -> BaseChatMessageHistory:
            if session_id not in st.session_state.store:
                st.session_state.store[session_id] = ChatMessageHistory()
            return st.session_state.store[session_id]

        def manage_conversation(user_input: str):
            session_history = get_session_history(session_id)
            response = rag_chain.invoke({
                "input": user_input,
                "chat_history": session_history.messages
            })
            # Update chat history
            session_history.add_message({"role": "user", "content": user_input})
            session_history.add_message({"role": "assistant", "content": response['answer']})
            return response['answer']

        # User input for question
        user_input = st.text_input("Your question:")
        if user_input:
            answer = manage_conversation(user_input)
            # Display the response and chat history
            st.write(st.session_state.store)
            st.write("Assistant:", answer)
            st.write("Chat History:", get_session_history(session_id).messages)
else:
    st.warning("Please enter the Groq API Key")


