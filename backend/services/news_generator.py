from langchain_groq.chat_models import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

# Setup your LLM model
llm = ChatGroq(model="llama3-70b-8192", temperature=0.8)

async def generate_news(company_name: str) -> str:
    """
    Generates an AI news headline for a given company.
    """
    messages = [
        SystemMessage(content="You are a financial news headline generator. Your headlines should be short, realistic, and impactful."),
        HumanMessage(content=f"Generate a breaking news headline about {company_name} that could influence its stock price.")
    ]
    
    response = await llm.ainvoke(messages)
    return response.content
