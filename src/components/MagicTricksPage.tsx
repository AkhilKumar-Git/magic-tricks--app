import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Plus, Wand2, Loader2, X } from 'lucide-react';
import { supabase, MagicTrick } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { generateMagicTrick, getCommonItems, isClaudeConfigured, GeneratedTrick } from '../lib/claude';

interface MagicTrickWithOwnership extends MagicTrick {
  createdByMe?: boolean;
}

// Sample data for initial population (can be removed after adding real data)
const sampleMagicTricks: MagicTrick[] = [
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
    difficulty: 'Easy',
    user_id: 'sample-user',
    overall_rating: 4.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    difficulty: 'Easy',
    user_id: 'sample-user',
    overall_rating: 4.2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    difficulty: 'Medium',
    user_id: 'sample-user',
    overall_rating: 4.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

interface MagicTricksPageProps {
  onBackToLanding: () => void;
}

export default function MagicTricksPage({ onBackToLanding }: MagicTricksPageProps) {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [tricks, setTricks] = useState<MagicTrickWithOwnership[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Add Trick form state
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [newInstructionsText, setNewInstructionsText] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Trick generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [generationDifficulty, setGenerationDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [generationError, setGenerationError] = useState<string>('');
  const [generatedTrick, setGeneratedTrick] = useState<GeneratedTrick | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const commonItems = getCommonItems();

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleGenerateTrick = async () => {
    if (selectedItems.length === 0) {
      setGenerationError('Please select at least one item for the trick');
      return;
    }

    if (!isClaudeConfigured()) {
      setGenerationError('Claude API is not configured. Please add VITE_CLAUDE_API_KEY to your environment variables.');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const result = await generateMagicTrick({
        items: selectedItems,
        difficulty: generationDifficulty
      });

      if (result.success && result.trick) {
        setGeneratedTrick(result.trick);
      } else {
        setGenerationError(result.error || 'Failed to generate trick');
      }
    } catch (error) {
      console.error('Trick generation error:', error);
      setGenerationError('Failed to generate trick. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedTrick = async () => {
    if (!generatedTrick || !user) return;

    setSaving(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('magic_tricks')
        .insert([
          {
            user_id: user.id,
            title: generatedTrick.title,
            description: generatedTrick.description,
            instructions: generatedTrick.instructions,
            difficulty: generatedTrick.difficulty,
            overall_rating: 0.0
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add the new trick to the local state
      const newTrickWithOwnership: MagicTrickWithOwnership = {
        ...data,
        createdByMe: true
      };
      
      setTricks(prev => [newTrickWithOwnership, ...prev]);
      
      // Reset generation state
      setGeneratedTrick(null);
      setShowGenerateModal(false);
      setSelectedItems([]);
      setGenerationError('');
    } catch (err) {
      console.error('Error saving generated trick:', err);
      setError('Failed to save generated trick. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
    setGeneratedTrick(null);
    setSelectedItems([]);
    setGenerationError('');
  };

  // Load tricks from Supabase
  useEffect(() => {
    loadTricks();
  }, [user]);

  const loadTricks = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('magic_tricks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Add createdByMe flag based on current user
      const tricksWithOwnership: MagicTrickWithOwnership[] = (data || []).map(trick => ({
        ...trick,
        createdByMe: trick.user_id === user.id
      }));

      setTricks(tricksWithOwnership);
    } catch (err) {
      console.error('Error loading tricks:', err);
      setError('Failed to load magic tricks. Please try again.');
      // Fallback to sample data if database is empty
      if (tricks.length === 0) {
        const sampleWithOwnership = sampleMagicTricks.map(trick => ({
          ...trick,
          createdByMe: false
        }));
        setTricks(sampleWithOwnership);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const filteredTricks = useMemo(() => {
    if (!filter) return tricks;
    if (filter === 'Created by me') return tricks.filter(t => t.createdByMe);
    return tricks.filter(t => t.difficulty === filter);
  }, [filter, tricks]);

  const handleAddTrick = async () => {
    if (!newTitle.trim() || !newDescription.trim() || !user) return;
    
    setSaving(true);
    setError('');
    
    try {
      const instructions = newInstructionsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      
      const { data, error } = await supabase
        .from('magic_tricks')
        .insert([
          {
            user_id: user.id,
            title: newTitle.trim(),
            description: newDescription.trim(),
            instructions: instructions.length ? instructions : ['Practice and amaze your audience!'],
            difficulty: newDifficulty,
            overall_rating: 0.0
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add the new trick to the local state
      const newTrickWithOwnership: MagicTrickWithOwnership = {
        ...data,
        createdByMe: true
      };
      
      setTricks(prev => [newTrickWithOwnership, ...prev]);
      
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewDifficulty('Easy');
      setNewInstructionsText('');
      setIsAddOpen(false);
    } catch (err) {
      console.error('Error adding trick:', err);
      setError('Failed to save magic trick. Please try again.');
    } finally {
      setSaving(false);
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
            {user && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-3 hover:bg-gray-800 rounded-full p-2 transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-magenta p-0.5">
                  <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                    {userProfile?.profile ? (
                      <img
                        src={userProfile.profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-sm font-bold text-white">${getInitials(userProfile?.name || user?.email || 'U')}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {getInitials(userProfile?.name || user?.email || 'U')}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 hover:text-white transition-colors">
                  {userProfile?.name || user?.email?.split('@')[0] || 'Profile'}
                </span>
              </button>
            )}
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

        {/* Controls: Filter + Add Trick */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label htmlFor="trick-filter" className="text-sm text-gray-300">Filter:</label>
            <select
              id="trick-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Created by me">Created by me</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Generate a Trick
            </button>
            <button
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              {isAddOpen ? 'Close' : 'Add Magic Trick'}
            </button>
          </div>
        </div>

        {/* Add Trick Form */}
        {isAddOpen && (
          <div className="mb-10 border border-gray-700 rounded-xl p-6 bg-gray-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Amazing New Trick"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description of the trick"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Instructions (one per line)</label>
                <textarea
                  value={newInstructionsText}
                  onChange={(e) => setNewInstructionsText(e.target.value)}
                  placeholder={'Step 1...\nStep 2...\nStep 3...'}
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddTrick}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTitle.trim() || !newDescription.trim() || saving}
              >
                {saving ? 'Saving...' : 'Save Trick'}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading magic tricks...</p>
          </div>
        )}

        {/* Magic Tricks Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTricks.map((trick) => (
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
        )}

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

      {/* Trick Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-medium-gray rounded-2xl p-8 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bebas text-white">
                Generate a Magic Trick
              </h2>
              <button
                onClick={handleCloseGenerateModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!generatedTrick ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select items you have available:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {commonItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleItemToggle(item)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          selectedItems.includes(item)
                            ? 'bg-electric-blue text-white border-2 border-electric-blue'
                            : 'bg-charcoal text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {selectedItems.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Selected: {selectedItems.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={generationDifficulty}
                    onChange={(e) => setGenerationDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full bg-charcoal border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {generationError && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{generationError}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseGenerateModal}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateTrick}
                    disabled={isGenerating || selectedItems.length === 0}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isGenerating || selectedItems.length === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-4 h-4" />
                        <span>Generate Trick</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-charcoal rounded-lg border border-gray-600">
                  <h3 className="text-xl font-bold text-white mb-2">{generatedTrick.title}</h3>
                  <p className="text-gray-300 mb-4">{generatedTrick.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300">
                      {generatedTrick.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm">{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(generatedTrick.difficulty)}`}>
                      {generatedTrick.difficulty}
                    </span>
                    <span className="text-gray-400">
                      Items: {generatedTrick.items.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setGeneratedTrick(null)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={handleSaveGeneratedTrick}
                    disabled={saving}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      saving
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-electric-blue to-magenta text-white hover:shadow-lg hover:shadow-electric-blue/25'
                    }`}
                  >
                    {saving ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Save Trick</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
