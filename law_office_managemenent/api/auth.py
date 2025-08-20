import frappe
import requests
import json


import frappe

def boot_session(bootinfo):
    bootinfo.google_client_id = frappe.conf.google_client_id


@frappe.whitelist(allow_guest=True)
def google_callback(code=None, state=None):
    """
    Handles OAuth callback from Google
    """
    client_id = frappe.conf.get("google_client_id")
    client_secret = frappe.conf.get("google_client_secret")

    redirect_uri = "http://localhost:8004/api/method/law_office_management.api.auth.google_callback"

    # Step 1: Exchange code for access_token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    res = requests.post(token_url, data=data)
    token_info = res.json()

    access_token = token_info.get("access_token")

    # Step 2: Use token to create Google Meet link
    event_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    headers = {"Authorization": f"Bearer {access_token}"}
    event = {
        "summary": "Client Consultation Meeting",
        "conferenceData": {
            "createRequest": {"requestId": frappe.generate_hash(length=10)}
        },
        "start": {"dateTime": "2025-08-21T10:00:00+05:30"},
        "end": {"dateTime": "2025-08-21T11:00:00+05:30"}
    }

    event_res = requests.post(event_url, headers=headers, json=event, params={"conferenceDataVersion": 1})
    event_data = event_res.json()

    meet_link = event_data.get("hangoutLink")

    return {"meet_link": meet_link}
