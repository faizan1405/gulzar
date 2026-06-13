export const getProfileImage = (gender: string, index: number): string => {
  const maleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300'
  ];
  const femaleImages = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300'
  ];

  if (gender.toLowerCase() === 'male') {
    return maleImages[index % maleImages.length];
  }
  return femaleImages[index % femaleImages.length];
};

export const getThemeClass = (color: string): string => {
  if (!color) return 'theme-emerald';
  if (color.includes('hsl(')) {
    if (color.includes('150')) return 'theme-emerald';
    if (color.includes('345')) return 'theme-crimson';
    if (color.includes('42')) return 'theme-gold';
    return 'theme-navy';
  }
  return `theme-${color}`;
};
