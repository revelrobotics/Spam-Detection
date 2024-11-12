import os
import streamlit as st
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import GoogleGenerativeAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Set up the Gemini API client
gemini_llm = GoogleGenerativeAI(temperature=0.5, model="gemini-pro")

# Step 1: Define each prompt template for analyzing components
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

# Step 3: Provide inputs and get output
def run_spam_detection(email_address, body, footer):
    response = spam_detection_chain.run({
        "email_address": email_address,
        "body": body,
        "footer": footer
    })
    return response

# Sample execution
if __name__ == "__main__":
    # Example email text
    text = "Congratulations! Thanks to a good friend U have WON the £2,000 Xmas prize. 2 claim is easy, just call 08718726971 NOW! Only 10p per minute. BT-national-rate."

    # Run spam detection and print result
    print(run_spam_detection(
        email_address="master@masterpiece1357.net",
        body=text,
        footer="Best regards, Investment Team"
    ))
