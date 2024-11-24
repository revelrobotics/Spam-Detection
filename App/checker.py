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
def classify_email(new_email: str) -> str:
    """
    Classify an email as written by Alyazia, Aysha, or Suspicious, and provide a detailed explanation.
    
    Parameters:
        new_email (str): The new email to classify.
    
    Returns:
        str: A classification result and explanation.
    """
    
    # Define email examples for pattern recognition
    alyazia_examples = """
    Alyazia typically uses informal greetings and a casual tone, like:
    - Halla Awash
    - Hola Awash
    - Hi Awash
    
    Examples of her writing:
    1. Subject: Lunch Plans? 
       Halla Awash, What’s up? Got any plans for lunch? Thinking of hitting that new shawarma spot near the office.
    2. Subject: Weekend Vibes
       Halla Awash, Man, this week has been crazy! Got anything fun planned for the weekend?
    """

    aysha_examples = """
    Aysha typically uses semi-formal greetings and a supportive tone, like:
    - Ahlan Yazoy
    - Hello Yazoy
    
    Examples of her writing:
    1. Subject: Got Your Back
       Ahlan Yazoy, Just wanted to say I’ve got you covered on that project we discussed.
    2. Subject: Weekend Recap
       Ahlan Yazoy, How was your weekend? Mine was pretty chill—caught up on sleep and binged that series you recommended.
    """

    suspicious_criteria = """
    A suspicious email differs from Alyazia and Aysha's styles. It might:
    - Use a formal tone, which neither Alyazia nor Aysha typically use (e.g., "Dear Aysha").
    - Lack personal elements or shared context.
    - Have inconsistent language or tone.
    """

    # Create a prompt template
    prompt_template = PromptTemplate(
        input_variables=["email", "alyazia_examples", "aysha_examples", "suspicious_criteria"],
        template=(
            "You are an NLP algorithm that classifies emails as written by 'Alyazia', 'Aysha', or 'Suspicious'.\n"
            "Here are Alyazia's patterns:\n{alyazia_examples}\n\n"
            "Here are Aysha's patterns:\n{aysha_examples}\n\n"
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
        "alyazia_examples": alyazia_examples,
        "aysha_examples": aysha_examples,
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