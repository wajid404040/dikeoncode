import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()
    console.log('Received message:', message)
    console.log('Conversation history length:', conversationHistory?.length || 0)

    // Create conversation context for DIA
    const systemPrompt = `You are DIA, a friendly and helpful AI assistant. Talk naturally and conversationally like a human friend. Keep responses short, warm, and helpful. Don't ask questions to yourself or be repetitive. Just respond naturally to what the user says.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    console.log('Sending to OpenRouter with messages:', messages)

    const requestBody = {
      "model": "openai/gpt-3.5-turbo",
      "messages": messages,
      "max_tokens": 100,
      "temperature": 0.7
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "DIA AI Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    console.log('OpenRouter API response status:', response.status)
    console.log('OpenRouter API raw response:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('OpenRouter API error:', data)
      throw new Error(`OpenRouter API error: ${data.error?.message || 'Unknown error'}`)
    }

    // Extract the AI response properly
    const aiResponse = data.choices?.[0]?.message?.content
    console.log('AI Response extracted:', aiResponse)

    if (!aiResponse) {
      console.error('No AI response found in data:', data)
      throw new Error('No response content from AI')
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    })

  } catch (error) {
    console.error('Conversation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get response from AI' },
      { status: 500 }
    )
  }
} 