// Claude API integration for magic trick generation
import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export interface GeneratedTrick {
  title: string;
  description: string;
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  items: string[];
}

export interface TrickGenerationRequest {
  items: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  additionalContext?: string;
}

export interface TrickGenerationResponse {
  success: boolean;
  trick?: GeneratedTrick;
  error?: string;
}

/**
 * Generate a magic trick using Claude API based on available items
 */
export const generateMagicTrick = async (
  request: TrickGenerationRequest
): Promise<TrickGenerationResponse> => {
  if (!CLAUDE_API_KEY) {
    return {
      success: false,
      error: 'Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your environment variables.'
    };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY,
      dangerouslyAllowBrowser: true, // Only for local testing - remove in production
    });

    const prompt = createTrickGenerationPrompt(request);
    
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a professional magician and magic trick creator. Create engaging, safe, and entertaining magic tricks that can be performed with common household items. Always provide clear, step-by-step instructions that are easy to follow.

${prompt}`
        }
      ]
    });

    const content = msg.content[0]?.text;

    if (!content) {
      throw new Error('No content received from Claude API');
    }

    // Parse the generated content
    const trick = parseGeneratedTrick(content, request.items);
    
    return {
      success: true,
      trick
    };
  } catch (error) {
    console.error('Claude API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate magic trick'
    };
  }
};

/**
 * Create a prompt for trick generation based on available items
 */
const createTrickGenerationPrompt = (request: TrickGenerationRequest): string => {
  const { items, difficulty = 'Easy', additionalContext = '' } = request;
  
  const itemsList = items.join(', ');
  const difficultyDescription = getDifficultyDescription(difficulty);
  
  return `Create a magic trick using these items: ${itemsList}

Requirements:
- Difficulty level: ${difficultyDescription}
- Use only the provided items (you can suggest additional common household items if needed)
- Make it safe and family-friendly
- Provide clear, step-by-step instructions
- Include a catchy title and engaging description

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Please format your response as JSON with the following structure:
{
  "title": "Trick Title",
  "description": "Brief description of what the trick does",
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "difficulty": "${difficulty}",
  "items": ["item1", "item2", "item3"]
}

Make sure the JSON is valid and the instructions are clear and easy to follow.`;
};

/**
 * Get difficulty description for the prompt
 */
const getDifficultyDescription = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'Beginner-friendly, simple to learn and perform, requires minimal practice';
    case 'Medium':
      return 'Intermediate level, requires some practice and skill, more impressive effects';
    case 'Hard':
      return 'Advanced level, requires significant practice and skill, very impressive effects';
    default:
      return 'Beginner-friendly, simple to learn and perform';
  }
};

/**
 * Parse the generated trick from Claude response
 */
const parseGeneratedTrick = (content: string, requestedItems: string[]): GeneratedTrick => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and clean the parsed data
    return {
      title: parsed.title || 'Generated Magic Trick',
      description: parsed.description || 'A magical trick created just for you!',
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : ['Follow the magic!'],
      difficulty: ['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : 'Easy',
      items: Array.isArray(parsed.items) ? parsed.items : requestedItems
    };
  } catch (error) {
    console.error('Error parsing generated trick:', error);
    
    // Fallback: create a basic trick structure
    return {
      title: 'AI Generated Magic Trick',
      description: 'A magical trick created using artificial intelligence!',
      instructions: [
        'Gather your items',
        'Follow the magical steps',
        'Practice the routine',
        'Amaze your audience!'
      ],
      difficulty: 'Easy',
      items: requestedItems
    };
  }
};

/**
 * Get common household items for trick generation
 */
export const getCommonItems = (): string[] => {
  return [
    'Playing cards',
    'Coins',
    'Rubber bands',
    'Paper clips',
    'String or rope',
    'Cups',
    'Napkins or tissues',
    'Pencils or pens',
    'Keys',
    'Bottles',
    'Matches or toothpicks',
    'Scissors',
    'Tape',
    'Magnets',
    'Mirrors'
  ];
};

/**
 * Validate if Claude API is configured
 */
export const isClaudeConfigured = (): boolean => {
  return !!CLAUDE_API_KEY;
};
