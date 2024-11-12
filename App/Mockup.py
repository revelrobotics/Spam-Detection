import os
import streamlit as st
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import GoogleGenerativeAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Ensure the API key exists
if GOOGLE_API_KEY is None:
    st.error("Google API Key not found. Please set GOOGLE_API_KEY in the environment variables.")
else:
    # Set up the Gemini API client
    gemini_llm = GoogleGenerativeAI(temperature=0.5, model="gemini-pro")

    # Step 1: Define the prompt template for analyzing components
    email_prompt = PromptTemplate(
        input_variables=["email_address", "body", "footer"],
        template=(
            """
            Analyze the following email for potential spam indicators:
            - Email Address: {email_address}
            - Body: {body}
            - Footer: {footer}
            
            For each section, provide an analysis and list any unusual or suspicious language, greeting style, and footer content.
            Give an overall assessment based on these indicators.
            """
        )
    )

    # Step 2: Set up LLMChain for Gemini
    spam_detection_chain = LLMChain(
        llm=gemini_llm,
        prompt=email_prompt
    )

    # Step 3: Function to run spam detection
    def run_spam_detection(email_address, body, footer):
        response = spam_detection_chain.run({
            "email_address": email_address,
            "body": body,
            "footer": footer
        })
        return response

    # Streamlit UI
    st.title("Spam Detector")

    # Input fields
    email_address = st.text_input("Email Address", placeholder="e.g., example@domain.com")
    body = st.text_area("Email Body", placeholder="Paste the email body here...")
    footer = st.text_input("Email Footer", placeholder="e.g., Regards, Your Name")

    # Run analysis when the "Analyze" button is clicked
    if st.button("Analyze"):
        if email_address and body and footer:
            # Perform spam detection
            with st.spinner("Analyzing..."):
                result = run_spam_detection(email_address, body, footer)
            st.subheader("Analysis Result")
            st.write(result)
        else:
            st.warning("Please fill out all fields to perform the analysis.")
