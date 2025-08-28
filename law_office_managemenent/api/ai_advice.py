import frappe
import openai

# OpenAI API Key
openai.api_key = frappe.conf.get("openai_api_key")

@frappe.whitelist()
def get_case_advice(case_title):
    """Generate AI advice for given case title"""
    prompt = f"Suggest a good legal strategy for the case: {case_title}"
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        frappe.throw(f"AI Error: {str(e)}")
