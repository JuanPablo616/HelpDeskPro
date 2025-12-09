export function emailTemplate({
  title,
  message,
  footer = "HelpDeskPro © 2025"
}: {
  title: string;
  message: string;
  footer?: string;
}) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 550px;
    margin: auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  ">
    <h2 style="
      color: #1e40af;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
    ">${title}</h2>

    <div style="font-size: 16px; color: #374151; margin-top: 20px; line-height: 1.6;">
      ${message}
    </div>

    <p style="
      text-align: center;
      margin-top: 35px;
      font-size: 12px;
      color: #9ca3af;
    ">
      ${footer}
    </p>
  </div>
  `;
}
