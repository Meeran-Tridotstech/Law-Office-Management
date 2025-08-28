# Copyright (c) 2025, Meeran and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _
import re

class Advocate(Document):
	def validate(self):
		# ✅ Advocate Name
		if not self.advocate_name or len(self.advocate_name.strip()) < 3:
			frappe.throw(_("😕 Advocate name must be at least 3 characters."))

		if not self.advocate_name.replace(" ", "").isalpha():
			frappe.throw(_("🚫 Advocate name should not contain numbers or special characters."))

		# ✅ Bar Council ID
		pattern = r"^[A-Z]{2}\d{4}/\d{4}$"
		if not re.match(pattern, self.bar_council_id or ""):
			frappe.throw(_("🆔 Invalid Bar Council ID format. Use format like TN1234/2025."))

		if frappe.db.exists("Advocate", {"bar_council_id": self.bar_council_id, "name": ["!=", self.name]}):
			frappe.throw(_("⚠️ Bar Council ID already exists. Please check for duplicates."))

		# ✅ Specialization
		if not self.specialization:
			frappe.throw(_("📚 Please select a specialization."))

		# ✅ Experience
		if not isinstance(self.experience, int) or self.experience < 0 or self.experience > 60:
			frappe.throw(_("🧓 Experience must be a number between 0 and 60."))

		# ✅ Email ID
		if not self.mail_id or "@" not in self.mail_id or "." not in self.mail_id:
			frappe.throw(_("📧 Invalid email format."))

		if self.mail_id.lower() == "example@gmail.com":
			frappe.throw(_("🙈 Please enter a valid email address, not a placeholder."))

		if frappe.db.exists("Advocate", {"mail_id": self.mail_id, "name": ["!=", self.name]}):
			frappe.throw(_("📌 Email ID already exists. Try a different one."))