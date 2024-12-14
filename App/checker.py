import os
import streamlit as st
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import GoogleGenerativeAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Checker
def classify_email(person_1_examples: str, person_2_examples: str, new_email: str) -> str:
    """
    Classify an email as written by Alyazia, Aysha, or Suspicious, and provide a detailed explanation.
    
    Parameters:
        new_email (str): The new email to classify.
    
    Returns:
        str: A classification result and explanation.
    """

    suspicious_criteria = """
    A suspicious email differs from Alyazia and Aysha's styles. It might:
    - Use a formal tone, which neither Alyazia nor Aysha typically use (e.g., "Dear Aysha").
    - Lack personal elements or shared context.
    - Have inconsistent language or tone.
    """

    # Create a prompt template
    prompt_template = PromptTemplate(
        input_variables=["email", "person_1_examples", "person_2_examples", "suspicious_criteria"],
        template=(
            "You are an NLP algorithm that classifies emails as written by 'Person 1', 'Person 2', or 'Suspicious'.\n"
            "Here are Person 1's patterns:\n{person_1_examples}\n\n"
            "Here are Person 2's patterns:\n{person_2_examples}\n\n"
            "Criteria for a suspicious email:\n{suspicious_criteria}\n\n"
            "Classify the following email:\n---\n{email}\n---\n"
            "Provide your classification and a detailed explanation for your decision."
        )
    )

    # Initialize Gemini LLM
    gemini_llm = GoogleGenerativeAI(temperature=0.5, model="gemini-pro")
    
    # Create the LangChain LLM chain
    chain = LLMChain(llm=gemini_llm, prompt=prompt_template)
    
    # Generate a response
    result = chain.run({
        "email": new_email,
        "person_1_examples": person_1_examples,
        "person_2_examples": person_2_examples,
        "suspicious_criteria": suspicious_criteria,
    })
    
    return result

# Sample execution
if __name__ == "__main__":
    new_email = """
    Subject: Collaboration Opportunity
    Dear Aysha,

    I hope this message finds you well. I wanted to discuss a potential collaboration opportunity for next quarter.
    Let me know when you're available to chat.

    Best regards,
    John Doe
    """

    print(classify_email(new_email))