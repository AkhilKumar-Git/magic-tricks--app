import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface MagicTrick {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const magicTricks: MagicTrick[] = [
  {
    id: '1',
    title: 'The Vanishing Coin',
    description: 'Make a coin disappear right before your audience\'s eyes!',
    instructions: [
      'Hold the coin between your thumb and index finger',
      'Pretend to place it in your other hand',
      'Actually keep it hidden in your original hand',
      'Open your "empty" hand to show the coin has vanished'
    ],
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Mind Reading Numbers',
    description: 'Guess any number your audience is thinking of!',
    instructions: [
      'Ask someone to think of a number between 1-10',
      'Have them multiply by 2',
      'Add 8 to the result',
      'Divide by 2',
      'Subtract their original number',
      'The answer will always be 4!'
    ],
    difficulty: 'Easy'
  },
  {
    id: '3',
    title: 'The Floating Card',
    description: 'Make a playing card float in mid-air!',
    instructions: [
      'Hold a card between your thumb and middle finger',
      'Use your index finger to gently push the card up',
      'Practice the motion to make it look like the card is floating',
      'Add a slight wrist movement for extra effect'
    ],
    difficulty: 'Medium'
  },
  {
    id: '4',
    title: 'The Rubber Pencil',
    description: 'Make a pencil appear to bend like rubber!',
    instructions: [
      'Hold a pencil between your thumb and index finger',
      'Move your hand up and down rapidly',
      'The pencil will appear to bend due to the motion blur',
      'Keep the movement smooth and consistent'
    ],
    difficulty: 'Easy'
  },
  {
    id: '5',
    title: 'The Magic Knot',
    description: 'Tie a knot in a rope without letting go of the ends!',
    instructions: [
      'Hold both ends of a rope in your hands',
      'Cross your arms to form a loop',
      'Pull the ends through the loop',
      'Uncross your arms to reveal the knot'
    ],
    difficulty: 'Hard'
  },
  {
    id: '6',
    title: 'The Disappearing Thumb',
    description: 'Make your thumb disappear and reappear!',
    instructions: [
      'Hold your hand up with thumb extended',
      'Quickly bend your thumb and hide it behind your fingers',
      'Show your "missing" thumb to the audience',
      'Extend your thumb again to make it "reappear"'
    ],
    difficulty: 'Easy'
  }
];

interface MagicTricksPageProps {
  onBackToLanding: () => void;
}

export default function MagicTricksPage({ onBackToLanding }: MagicTricksPageProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const handleCardFlip = (trickId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trickId)) {
        newSet.delete(trickId);
      } else {
        newSet.add(trickId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      {/* Header */}
      <div className="bg-charcoal border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Landing</span>
            </button>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold">Magic Tricks Homepage</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Magic Trick
          </h2>
          <p className="text-gray-300 text-lg">
            Click on any card to reveal the secret behind the magic!
          </p>
        </div>

        {/* Magic Tricks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magicTricks.map((trick) => (
            <div
              key={trick.id}
              className="relative group cursor-pointer"
              onClick={() => handleCardFlip(trick.id)}
            >
              <div className={`relative w-full h-80 perspective-1000 transform-gpu transition-transform duration-700 ${
                flippedCards.has(trick.id) ? 'rotate-y-180' : ''
              }`}>
                {/* Front of Card */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow ${
                  flippedCards.has(trick.id) ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(trick.difficulty)}`}>
                        {trick.difficulty}
                      </span>
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {trick.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {trick.description}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 text-sm font-medium">
                      Click to reveal the secret!
                    </p>
                  </div>
                </div>

                {/* Back of Card */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl border border-purple-500 bg-gradient-to-br from-purple-900 to-pink-900 p-6 flex flex-col justify-between shadow-lg ${
                  flippedCards.has(trick.id) ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-purple-300 bg-purple-500/20">
                        Secret Revealed
                      </span>
                      <Sparkles className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">
                      {trick.title}
                    </h3>
                    <div className="space-y-3">
                      <h4 className="text-purple-300 font-semibold text-sm">Instructions:</h4>
                      <ol className="space-y-2">
                        {trick.instructions.map((instruction, index) => (
                          <li key={index} className="text-gray-200 text-sm leading-relaxed">
                            <span className="text-purple-400 font-medium">{index + 1}.</span> {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-pink-400 text-sm font-medium">
                      Click to flip back
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              Ready to Amaze Your Audience?
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Practice these tricks and you'll be ready to perform magic that will leave your friends and family speechless!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
