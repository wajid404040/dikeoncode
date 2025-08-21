export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ConversationResponse {
  success: boolean
  response?: string
  conversationHistory?: ConversationMessage[]
  error?: string
}

class ConversationService {
  private conversationHistory: ConversationMessage[] = []

  async sendMessage(message: string): Promise<ConversationResponse> {
    try {
      console.log('Sending message to AI:', message)
      
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: this.conversationHistory
        })
      })

      const data = await response.json()

      if (data.success) {
        this.conversationHistory = data.conversationHistory || []
        console.log('AI Response:', data.response)
        return {
          success: true,
          response: data.response,
          conversationHistory: this.conversationHistory
        }
      } else {
        console.error('Conversation failed:', data.error)
        return {
          success: false,
          error: data.error || 'Failed to get response from AI'
        }
      }
    } catch (error) {
      console.error('Conversation service error:', error)
      return {
        success: false,
        error: 'Failed to communicate with AI service'
      }
    }
  }

  getConversationHistory(): ConversationMessage[] {
    return [...this.conversationHistory]
  }

  clearConversation() {
    this.conversationHistory = []
    console.log('Conversation history cleared')
  }
}

export default new ConversationService() 