import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
import os

def send_anomaly_alert(
    sender_email,
    app_password,
    receiver_email,
    camera_id,
    timestamp,
    video_path=None
):
    # Build subject and body content
    subject = f"Anomaly Alert: Smoking Detected on Camera {camera_id} ({timestamp})"

    plain_text = f"""
Anomaly Detected

Details:
- Camera: {camera_id}
- Timestamp: {timestamp}

Please check the attached video clip (if any) for review.

Regards,
CampusView AI Surveillance System
FAST-NUCES
"""

    html_content = f"""
<html>
  <body>
    <p><strong>Anomaly Detected</strong><br><br>
       <b>Camera:</b> {camera_id}<br>
       <b>Timestamp:</b> {timestamp}<br><br>
       Please check the attached video clip (if any) for review.<br><br>
       <hr>
       <small>CampusView AI Surveillance System<br>FAST-NUCES</small>
    </p>
  </body>
</html>
"""

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = formataddr(('CampusView Surveillance', sender_email))
    msg['To'] = receiver_email

    msg.set_content(plain_text)
    msg.add_alternative(html_content, subtype='html')

    # Attach video file if provided
    if video_path and os.path.exists(video_path):
        with open(video_path, 'rb') as f:
            file_data = f.read()
            file_name = os.path.basename(video_path)
            msg.add_attachment(
                file_data,
                maintype='video',
                subtype='x-msvideo',
                filename=file_name
            )

    # Send the email
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
            print("✅ Alert email sent successfully.")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

# Example usage
if __name__ == "__main__":
    send_anomaly_alert(
        sender_email="study.binarybeats@gmail.com",
        app_password="lagamgdkuulgzcfp",
        receiver_email="hamidishaq476@gmail.com",
        camera_id="2",
        timestamp="2025-06-15 14:33",
        video_path="bhai.mp4"  # Optional
    )
