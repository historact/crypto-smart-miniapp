async function askAI() {
  const question = document.getElementById('userQuestion').value;
  if (!question) {
    alert("Please enter your question!");
    return;
  }

  document.getElementById('aiAnswer').innerText = "Thinking... 🤔";

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": question}],
        max_tokens: 400,
        temperature: 0.5
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();
    document.getElementById('aiAnswer').innerText = answer;
  } catch (error) {
    document.getElementById('aiAnswer').innerText = "❌ Error contacting AI.";
  }
}
